import * as monaco from 'monaco-editor';

interface ClassInfo {
    name: string;
    methods: Array<{ name: string; returnType?: string; params?: string }>;
    properties: Array<{ name: string; type?: string }>;
}

interface ParsedCode {
    classes: Map<string, ClassInfo>;
    functions: Array<{ name: string; returnType?: string }>;
    variables: Array<{ name: string; type?: string }>;
}

export function parseCppCode(code: string): ParsedCode {
    const result: ParsedCode = {
        classes: new Map(),
        functions: [],
        variables: []
    };

    // Remove comments
    const cleanCode = code
        .replace(/\/\/.*$/gm, '') // Single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line comments

    // Parse class definitions
    const classRegex = /class\s+(\w+)\s*(?::\s*public\s+\w+)?\s*\{([^}]*)\}/g;
    let classMatch;

    while ((classMatch = classRegex.exec(cleanCode)) !== null) {
        const className = classMatch[1];
        const classBody = classMatch[2];

        const classInfo: ClassInfo = {
            name: className,
            methods: [],
            properties: []
        };

        // Parse methods within class
        const methodRegex = /(?:public|private|protected)?\s*(?:virtual|static)?\s*(\w+)\s+(\w+)\s*\(([^)]*)\)/g;
        let methodMatch;

        while ((methodMatch = methodRegex.exec(classBody)) !== null) {
            const returnType = methodMatch[1];
            const methodName = methodMatch[2];
            const params = methodMatch[3];

            if (methodName !== className) { // Skip constructors
                classInfo.methods.push({
                    name: methodName,
                    returnType,
                    params
                });
            }
        }

        // Parse member variables
        const propertyRegex = /(?:public|private|protected)?\s*(\w+)\s+(\w+)\s*;/g;
        let propertyMatch;

        while ((propertyMatch = propertyRegex.exec(classBody)) !== null) {
            const type = propertyMatch[1];
            const propName = propertyMatch[2];

            classInfo.properties.push({
                name: propName,
                type
            });
        }

        result.classes.set(className, classInfo);
    }

    // Parse global functions
    const functionRegex = /^(?!.*class)(?:static|inline)?\s*(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/gm;
    let functionMatch;

    while ((functionMatch = functionRegex.exec(cleanCode)) !== null) {
        const returnType = functionMatch[1];
        const funcName = functionMatch[2];

        if (!['if', 'for', 'while', 'switch'].includes(funcName)) {
            result.functions.push({
                name: funcName,
                returnType
            });
        }
    }

    // Parse global variables
    const globalVarRegex = /^(?:extern|static)?\s*(\w+)\s+(\w+)\s*(?:=|;)/gm;
    let varMatch;

    while ((varMatch = globalVarRegex.exec(cleanCode)) !== null) {
        const type = varMatch[1];
        const varName = varMatch[2];

        if (!['class', 'struct', 'int', 'void', 'return'].includes(varName)) {
            result.variables.push({
                name: varName,
                type
            });
        }
    }

    return result;
}

function findCppVariableClass(code: string, variableName: string): string | null {
    // Try to find: ClassName varName or ClassName* varName or auto varName = ClassName()
    const patterns = [
        new RegExp(`(\\w+)\\s+${variableName}\\s*[;=]`),
        new RegExp(`(\\w+)\\s*\\*\\s*${variableName}`),
        new RegExp(`${variableName}\\s*=\\s*(\\w+)\\s*\\(`),
    ];

    for (const pattern of patterns) {
        const match = code.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function registerCppCompletion(monaco: typeof import('monaco-editor')): monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider('cpp', {
        triggerCharacters: ['.', '>', ':'],
        provideCompletionItems: (model, position) => {
            const code = model.getValue();
            const parsed = parseCppCode(code);

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

            // Check for member access (. or ->)
            if (textUntilPosition.match(/\w+\s*(?:\.|->)\s*$/)) {
                const beforeAccess = textUntilPosition.replace(/\s*(?:\.|->)\s*$/, '').trim();
                const varName = beforeAccess.split(/\s+/).pop() || '';
                const className = findCppVariableClass(code, varName);

                if (className && parsed.classes.has(className)) {
                    const classInfo = parsed.classes.get(className)!;

                    // Add methods
                    classInfo.methods.forEach(method => {
                        suggestions.push({
                            label: method.name,
                            kind: monaco.languages.CompletionItemKind.Method,
                            insertText: `${method.name}()`,
                            range: range,
                            detail: `${method.returnType || 'void'} ${method.name}(${method.params || ''})`,
                        });
                    });

                    // Add properties
                    classInfo.properties.forEach(prop => {
                        suggestions.push({
                            label: prop.name,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: prop.name,
                            range: range,
                            detail: `${prop.type} ${prop.name}`,
                        });
                    });

                    return { suggestions };
                }
            }

            // General suggestions
            parsed.classes.forEach((classInfo, className) => {
                suggestions.push({
                    label: className,
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: className,
                    range: range,
                    detail: 'class',
                });
            });

            parsed.functions.forEach(func => {
                suggestions.push({
                    label: func.name,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: `${func.name}()`,
                    range: range,
                    detail: `${func.returnType || 'void'} ${func.name}()`,
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

            // C++ keywords
            const keywords = [
                'class', 'struct', 'public', 'private', 'protected', 'virtual', 'override',
                'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break',
                'continue', 'return', 'new', 'delete', 'this', 'nullptr', 'true', 'false',
                'const', 'static', 'inline', 'auto', 'void', 'int', 'float', 'double',
                'char', 'bool', 'string', 'vector', 'map', 'set', 'namespace', 'using',
                'template', 'typename', 'try', 'catch', 'throw'
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
