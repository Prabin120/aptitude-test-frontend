import * as monaco from 'monaco-editor';

interface ClassInfo {
    name: string;
    methods: string[];
    properties: string[];
}

interface ParsedCode {
    classes: Map<string, ClassInfo>;
    functions: string[];
    variables: string[];
}

export function parsePythonCode(code: string): ParsedCode {
    const result: ParsedCode = {
        classes: new Map(),
        functions: [],
        variables: []
    };

    const lines = code.split('\n');
    let currentClass: string | null = null;
    let currentIndent = 0;

    // Parse classes and their methods
    const classRegex = /^(\s*)class\s+(\w+)/;
    const methodRegex = /^(\s*)def\s+(\w+)\s*\(/;
    const functionRegex = /^def\s+(\w+)\s*\(/;
    const variableRegex = /^(\s*)(\w+)\s*=/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for class definition
        const classMatch = line.match(classRegex);
        if (classMatch) {
            const className = classMatch[2];
            currentClass = className;
            currentIndent = classMatch[1].length;
            result.classes.set(className, { name: className, methods: [], properties: [] });
            continue;
        }

        // Check for method definition (inside class)
        const methodMatch = line.match(methodRegex);
        if (methodMatch && currentClass) {
            const indent = methodMatch[1].length;
            if (indent > currentIndent) {
                const methodName = methodMatch[2];
                if (methodName !== '__init__') {
                    result.classes.get(currentClass)?.methods.push(methodName);
                }
            } else {
                currentClass = null;
            }
            continue;
        }

        // Check for function definition (global)
        const functionMatch = line.match(functionRegex);
        if (functionMatch && !currentClass) {
            result.functions.push(functionMatch[1]);
            continue;
        }

        // Check for variable assignment (global only)
        const variableMatch = line.match(variableRegex);
        if (variableMatch && !currentClass) {
            const varName = variableMatch[2];
            if (!varName.startsWith('_') && !result.variables.includes(varName)) {
                result.variables.push(varName);
            }
        }
    }

    return result;
}

function findVariableClass(code: string, variableName: string): string | null {
    // Try to find variable instantiation like: obj = ClassName()
    const instantiationRegex = new RegExp(`${variableName}\\s*=\\s*(\\w+)\\s*\\(`);
    const match = code.match(instantiationRegex);
    return match ? match[1] : null;
}

export function registerPythonCompletion(monaco: typeof import('monaco-editor')): monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider('python', {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
            const code = model.getValue();
            const parsed = parsePythonCode(code);

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

            // Check if we're after a dot (member access)
            const beforeDot = textUntilPosition.slice(0, -1).trim();
            const lastToken = beforeDot.split(/\s+/).pop() || '';

            if (textUntilPosition.endsWith('.')) {
                // Find what class this variable belongs to
                const varName = lastToken.replace(/\.$/, '');
                const className = findVariableClass(code, varName);

                if (className && parsed.classes.has(className)) {
                    const classInfo = parsed.classes.get(className)!;
                    const suggestions: monaco.languages.CompletionItem[] = [];

                    // Add methods
                    classInfo.methods.forEach(method => {
                        suggestions.push({
                            label: method,
                            kind: monaco.languages.CompletionItemKind.Method,
                            insertText: method,
                            range: range,
                            detail: `method of ${className}`,
                        });
                    });

                    // Add properties
                    classInfo.properties.forEach(prop => {
                        suggestions.push({
                            label: prop,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: prop,
                            range: range,
                            detail: `property of ${className}`,
                        });
                    });

                    return { suggestions };
                }
            }

            // General suggestions (not after dot)
            const suggestions: monaco.languages.CompletionItem[] = [];

            // Add all class names
            parsed.classes.forEach((classInfo, className) => {
                suggestions.push({
                    label: className,
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: className,
                    range: range,
                    detail: 'class',
                });
            });

            // Add all functions
            parsed.functions.forEach(func => {
                suggestions.push({
                    label: func,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: `${func}()`,
                    range: range,
                    detail: 'function',
                });
            });

            // Add all variables
            parsed.variables.forEach(variable => {
                suggestions.push({
                    label: variable,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: variable,
                    range: range,
                    detail: 'variable',
                });
            });

            // Add Python keywords
            const keywords = [
                'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
                'finally', 'with', 'import', 'from', 'as', 'return', 'yield', 'lambda',
                'pass', 'break', 'continue', 'raise', 'assert', 'del', 'global', 'nonlocal',
                'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'
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
