import * as monaco from 'monaco-editor';

interface ClassInfo {
    name: string;
    methods: Array<{ name: string; returnType?: string; params?: string; visibility?: string }>;
    properties: Array<{ name: string; type?: string; visibility?: string }>;
}

interface ParsedCode {
    classes: Map<string, ClassInfo>;
    functions: Array<{ name: string; returnType?: string }>;
    variables: Array<{ name: string; type?: string }>;
}

export function parseJavaCode(code: string): ParsedCode {
    const result: ParsedCode = {
        classes: new Map(),
        functions: [],
        variables: []
    };

    // Remove comments
    const cleanCode = code
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

    // Parse class definitions
    const classRegex = /(?:public|private)?\s*class\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+[\w,\s]+)?\s*\{([\s\S]*?)\n\}/g;
    let classMatch;

    while ((classMatch = classRegex.exec(cleanCode)) !== null) {
        const className = classMatch[1];
        const classBody = classMatch[2];

        const classInfo: ClassInfo = {
            name: className,
            methods: [],
            properties: []
        };

        // Parse methods
        const methodRegex = /(public|private|protected)?\s*(?:static)?\s*(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
        let methodMatch;

        while ((methodMatch = methodRegex.exec(classBody)) !== null) {
            const visibility = methodMatch[1] || 'public';
            const returnType = methodMatch[2];
            const methodName = methodMatch[3];
            const params = methodMatch[4];

            if (methodName !== className && !['if', 'for', 'while', 'switch'].includes(methodName)) {
                classInfo.methods.push({
                    name: methodName,
                    returnType,
                    params,
                    visibility
                });
            }
        }

        // Parse fields/properties
        const propertyRegex = /(public|private|protected)?\s*(?:static|final)?\s*(\w+)\s+(\w+)\s*(?:=|;)/g;
        let propertyMatch;

        while ((propertyMatch = propertyRegex.exec(classBody)) !== null) {
            const visibility = propertyMatch[1] || 'private';
            const type = propertyMatch[2];
            const propName = propertyMatch[3];

            if (!['class', 'void', 'return'].includes(propName)) {
                classInfo.properties.push({
                    name: propName,
                    type,
                    visibility
                });
            }
        }

        result.classes.set(className, classInfo);
    }

    // Parse standalone methods (in case of single-file programs)
    const functionRegex = /(?:public|private)?\s*static\s+(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
    let functionMatch;

    while ((functionMatch = functionRegex.exec(cleanCode)) !== null) {
        const returnType = functionMatch[1];
        const funcName = functionMatch[2];

        if (!['main', 'if', 'for', 'while'].includes(funcName)) {
            result.functions.push({
                name: funcName,
                returnType
            });
        }
    }

    return result;
}

function findJavaVariableClass(code: string, variableName: string): string | null {
    // Try to find: ClassName varName = new ClassName() or ClassName varName;
    const patterns = [
        new RegExp(`(\\w+)\\s+${variableName}\\s*=\\s*new\\s+\\w+`),
        new RegExp(`(\\w+)\\s+${variableName}\\s*[;=]`),
    ];

    for (const pattern of patterns) {
        const match = code.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function registerJavaCompletion(monaco: typeof import('monaco-editor')): monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider('java', {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
            const code = model.getValue();
            const parsed = parseJavaCode(code);

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
                const className = findJavaVariableClass(code, varName);

                if (className && parsed.classes.has(className)) {
                    const classInfo = parsed.classes.get(className)!;

                    // Add methods
                    classInfo.methods.forEach(method => {
                        if (method.visibility === 'public' || method.visibility === 'protected') {
                            suggestions.push({
                                label: method.name,
                                kind: monaco.languages.CompletionItemKind.Method,
                                insertText: `${method.name}()`,
                                range: range,
                                detail: `${method.visibility} ${method.returnType} ${method.name}(${method.params || ''})`,
                            });
                        }
                    });

                    // Add properties
                    classInfo.properties.forEach(prop => {
                        if (prop.visibility === 'public') {
                            suggestions.push({
                                label: prop.name,
                                kind: monaco.languages.CompletionItemKind.Property,
                                insertText: prop.name,
                                range: range,
                                detail: `${prop.visibility} ${prop.type} ${prop.name}`,
                            });
                        }
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
                    detail: `${func.returnType} ${func.name}()`,
                });
            });

            // Java keywords
            const keywords = [
                'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
                'static', 'final', 'abstract', 'synchronized', 'volatile', 'transient',
                'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break',
                'continue', 'return', 'new', 'this', 'super', 'null', 'true', 'false',
                'void', 'int', 'long', 'float', 'double', 'boolean', 'char', 'byte', 'short',
                'String', 'ArrayList', 'HashMap', 'List', 'Map', 'Set', 'try', 'catch',
                'finally', 'throw', 'throws', 'import', 'package'
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
