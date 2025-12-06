import * as monaco from 'monaco-editor';

interface StructInfo {
    name: string;
    methods: Array<{ name: string; receiver?: string }>;
    fields: Array<{ name: string; type?: string }>;
}

interface ParsedCode {
    structs: Map<string, StructInfo>;
    functions: Array<{ name: string; params?: string }>;
    variables: Array<{ name: string; type?: string }>;
}

export function parseGoCode(code: string): ParsedCode {
    const result: ParsedCode = {
        structs: new Map(),
        functions: [],
        variables: []
    };

    // Remove comments
    const cleanCode = code
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

    // Parse struct definitions
    const structRegex = /type\s+(\w+)\s+struct\s*\{([^}]*)\}/g;
    let structMatch;

    while ((structMatch = structRegex.exec(cleanCode)) !== null) {
        const structName = structMatch[1];
        const structBody = structMatch[2];

        const structInfo: StructInfo = {
            name: structName,
            methods: [],
            fields: []
        };

        // Parse struct fields
        const fieldRegex = /(\w+)\s+(\w+)/g;
        let fieldMatch;

        while ((fieldMatch = fieldRegex.exec(structBody)) !== null) {
            const fieldName = fieldMatch[1];
            const fieldType = fieldMatch[2];

            structInfo.fields.push({
                name: fieldName,
                type: fieldType
            });
        }

        result.structs.set(structName, structInfo);
    }

    // Parse methods (functions with receivers)
    const methodRegex = /func\s+\((\w+)\s+\*?(\w+)\)\s+(\w+)\s*\(([^)]*)\)/g;
    let methodMatch;

    while ((methodMatch = methodRegex.exec(cleanCode)) !== null) {
        const receiverName = methodMatch[1];
        const receiverType = methodMatch[2];
        const methodName = methodMatch[3];

        if (result.structs.has(receiverType)) {
            result.structs.get(receiverType)!.methods.push({
                name: methodName,
                receiver: receiverName
            });
        }
    }

    // Parse functions
    const functionRegex = /func\s+(\w+)\s*\(([^)]*)\)/g;
    let functionMatch;

    while ((functionMatch = functionRegex.exec(cleanCode)) !== null) {
        const funcName = functionMatch[1];
        const params = functionMatch[2];

        // Skip if it's a method (has receiver)
        if (!cleanCode.substring(Math.max(0, functionMatch.index - 50), functionMatch.index).includes('(')) {
            result.functions.push({
                name: funcName,
                params
            });
        }
    }

    // Parse variables
    const varRegex = /(?:var|const)\s+(\w+)\s+(\w+)/g;
    let varMatch;

    while ((varMatch = varRegex.exec(cleanCode)) !== null) {
        const varName = varMatch[1];
        const varType = varMatch[2];

        result.variables.push({
            name: varName,
            type: varType
        });
    }

    // Parse short variable declarations
    const shortVarRegex = /(\w+)\s*:=\s*(?:new\((\w+)\)|(\w+)\{)/g;
    let shortVarMatch;

    while ((shortVarMatch = shortVarRegex.exec(cleanCode)) !== null) {
        const varName = shortVarMatch[1];
        const varType = shortVarMatch[2] || shortVarMatch[3];

        if (varType) {
            result.variables.push({
                name: varName,
                type: varType
            });
        }
    }

    return result;
}

function findGoVariableType(code: string, variableName: string): string | null {
    // Try to find variable type from declaration
    const patterns = [
        new RegExp(`var\\s+${variableName}\\s+(\\w+)`),
        new RegExp(`${variableName}\\s*:=\\s*new\\((\\w+)\\)`),
        new RegExp(`${variableName}\\s*:=\\s*(\\w+)\\{`),
        new RegExp(`${variableName}\\s+(\\w+)\\s*[,)]`), // Function parameter
    ];

    for (const pattern of patterns) {
        const match = code.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function registerGoCompletion(monaco: typeof import('monaco-editor')): monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider('go', {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
            const code = model.getValue();
            const parsed = parseGoCode(code);

            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });

            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            const suggestions: monaco.languages.CompletionItem[] = [];

            // Check for member access
            if (textUntilPosition.endsWith('.')) {
                const beforeDot = textUntilPosition.slice(0, -1).trim();
                const varName = beforeDot.split(/\s+/).pop() || '';
                const structType = findGoVariableType(code, varName);

                if (structType && parsed.structs.has(structType)) {
                    const structInfo = parsed.structs.get(structType)!;

                    // Add methods
                    structInfo.methods.forEach(method => {
                        suggestions.push({
                            label: method.name,
                            kind: monaco.languages.CompletionItemKind.Method,
                            insertText: `${method.name}()`,
                            range: range,
                            detail: `method of ${structType}`,
                        });
                    });

                    // Add fields
                    structInfo.fields.forEach(field => {
                        suggestions.push({
                            label: field.name,
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: field.name,
                            range: range,
                            detail: `${field.type} ${field.name}`,
                        });
                    });

                    return { suggestions };
                }
            }

            // General suggestions
            parsed.structs.forEach((structInfo, structName) => {
                suggestions.push({
                    label: structName,
                    kind: monaco.languages.CompletionItemKind.Struct,
                    insertText: structName,
                    range: range,
                    detail: 'struct',
                });
            });

            parsed.functions.forEach(func => {
                suggestions.push({
                    label: func.name,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: `${func.name}()`,
                    range: range,
                    detail: `func ${func.name}(${func.params || ''})`,
                });
            });

            parsed.variables.forEach(variable => {
                suggestions.push({
                    label: variable.name,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: variable.name,
                    range: range,
                    detail: `${variable.type} ${variable.name}`,
                });
            });

            // Go keywords
            const keywords = [
                'package', 'import', 'func', 'type', 'struct', 'interface', 'map', 'chan',
                'var', 'const', 'if', 'else', 'for', 'range', 'switch', 'case', 'default',
                'break', 'continue', 'return', 'go', 'defer', 'select', 'fallthrough',
                'true', 'false', 'nil', 'make', 'new', 'len', 'cap', 'append', 'copy',
                'delete', 'panic', 'recover', 'int', 'int8', 'int16', 'int32', 'int64',
                'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'float32', 'float64',
                'string', 'bool', 'byte', 'rune', 'error'
            ];

            keywords.forEach(keyword => {
                suggestions.push({
                    label: keyword,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: keyword,
                    range: range,
                });
            });

            return { suggestions };
        },
    });
}
