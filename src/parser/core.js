export const parseCode = (code) => {
    const lines = code.split('\n').map((text, index) => ({
        number: index,
        text: text.split('#')[0].trim(),
        indentation: text.match(/^\s*/)[0].length
    }));

    const steps = [];
    let variables = {};
    let output = [];
    let lastOutputState = [];
    const ifChainStack = [];

    steps.push({ line: -1, variables: {}, output: [] });

    const formatValueForPrint = (value) => {
        if (value === null || value === undefined) return String(value);
        if (typeof value !== 'object') {
            return typeof value === 'string' ? `'${value}'` : String(value);
        }
        if (!value.type) return JSON.stringify(value);

        if (value.type === 'list') {
            return `[${value.value.map(formatValueForPrint).join(', ')}]`;
        }
        if (value.type === 'tuple') {
            return `(${value.value.map(formatValueForPrint).join(', ')}${value.value.length === 1 ? ',' : ''})`;
        }
        if (value.type === 'dict') {
            const entries = Object.entries(value.value)
                .map(([k, v]) => `${formatValueForPrint(k)}: ${formatValueForPrint(v)}`)
                .join(', ');
            return `{${entries}}`;
        }
        return String(value);
    };

    const formatValueForStateDisplay = (value) => {
        if (typeof value === 'string') return `'${value}'`;
        if (value && value.type) {
            return formatValueForPrint(value);
        }
        return String(value);
    };
    
    // A new, specific formatter for the print() function
    const formatValueForPrintOutput = (value) => {
        // Top-level strings should NOT have quotes
        if (typeof value === 'string') return value;
        // For containers like lists, use the original logic that DOES add quotes to inner strings
        if (value && value.type) {
            return formatValueForPrint(value);
        }
        return String(value);
    };

    const parseArguments = (argsStr) => {
        if (!argsStr) return [];
        const args = [];
        let currentArg = '';
        let inString = false;
        let parenDepth = 0;
        let bracketDepth = 0;
        let braceDepth = 0;

        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];
            if (char === '"' || char === "'") inString = !inString;
            else if (!inString) {
                if (char === '(') parenDepth++;
                else if (char === ')') parenDepth--;
                else if (char === '[') bracketDepth++;
                else if (char === ']') bracketDepth--;
                else if (char === '{') braceDepth++;
                else if (char === '}') braceDepth--;
            }

            if (char === ',' && !inString && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
                args.push(resolveValue(currentArg.trim()));
                currentArg = '';
            } else {
                currentArg += char;
            }
        }
        args.push(resolveValue(currentArg.trim()));
        return args;
    };

    const resolveValue = (str) => {
        str = String(str).trim();
        if (str === 'True') return true; if (str === 'False') return false;
        if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) return str.slice(1, -1);

        const lenMatch = str.match(/^len\((\w+)\)$/);
        if (lenMatch) {
            const varName = lenMatch[1];
            if (variables.hasOwnProperty(varName)) {
                const collection = variables[varName];
                if (collection && collection.value && Array.isArray(collection.value)) {
                    return collection.value.length;
                }
                else if (typeof collection === 'string') {
                    return collection.length;
                }
            }
        }
        const absMatch = str.match(/^abs\((.*)\)$/);
        if (absMatch) {
            const value = resolveValue(absMatch[1]);
            if (typeof value === 'number') return Math.abs(value);
        }

        const roundMatch = str.match(/^round\((.*)\)$/);
        if (roundMatch) {
            const args = parseArguments(roundMatch[1]);
            if (args.length === 1 && typeof args[0] === 'number') {
                return Math.round(args[0]);
            }
            if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
                const factor = Math.pow(10, args[1]);
                return Math.round(args[0] * factor) / factor;
            }
        }

        const maxMinMatch = str.match(/^(max|min)\((.*)\)$/);
        if (maxMinMatch) {
            const [, func, argsStr] = maxMinMatch;
            const args = parseArguments(argsStr);
            let values = [];

            if (args.length === 1 && args[0] && (args[0].type === 'list' || args[0].type === 'tuple')) {
                values = args[0].value;
            } else {
                values = args;
            }
            
            if (values.every(v => typeof v === 'number')) {
                if (func === 'max') return Math.max(...values);
                if (func === 'min') return Math.min(...values);
            }
        }

        const typeConversionMatch = str.match(/^(int|str|float|bool)\((.*)\)$/);
        if (typeConversionMatch) {
            const [, func, argStr] = typeConversionMatch;
            const value = resolveValue(argStr);

            if (value !== undefined) {
                switch (func) {
                    case 'int':
                        const intVal = parseInt(value, 10);
                        return isNaN(intVal) ? 0 : intVal;
                    case 'float':
                        const floatVal = parseFloat(value);
                        return isNaN(floatVal) ? 0.0 : floatVal;
                    case 'str':
                        // When str() is called, it should behave like the new print output
                        return formatValueForPrintOutput(value);
                    case 'bool':
                        if (typeof value === 'number') return value !== 0;
                        if (typeof value === 'string') return value.length > 0;
                        if (value && value.type) return value.value.length > 0;
                        return Boolean(value);
                }
            }
        }

        const lastDotIndex = str.lastIndexOf('.');
        if (lastDotIndex > 0 && str.endsWith(')')) {
            const objectStr = str.substring(0, lastDotIndex);
            const methodCallStr = str.substring(lastDotIndex + 1);
            
            const methodCallMatch = methodCallStr.match(/^(\w+)\((.*)\)$/);
            if (methodCallMatch) {
                const variable = resolveValue(objectStr);

                if (variable !== undefined) {
                    const [, methodName, argsStr] = methodCallMatch;
                    const args = parseArguments(argsStr);
                    if (typeof variable === 'string') {
                        if (methodName === 'upper' && args.length === 0) return variable.toUpperCase();
                        if (methodName === 'lower' && args.length === 0) return variable.toLowerCase();
                        if (methodName === 'strip' && args.length === 0) return variable.trim();
                        if (methodName === 'split') {
                            const separator = args.length > 0 ? args[0] : ' ';
                            return { type: 'list', value: variable.split(separator) };
                        }
                        if (methodName === 'replace' && args.length === 2) {
                            return variable.replace(new RegExp(args[0], 'g'), args[1]);
                        }
                        if (methodName === 'startswith' && args.length === 1) return variable.startsWith(args[0]);
                        if (methodName === 'endswith' && args.length === 1) return variable.endsWith(args[0]);
                        if (methodName === 'find' && args.length === 1) return variable.indexOf(args[0]);
                        if (methodName === 'count' && args.length === 1) {
                            const regex = new RegExp(args[0], 'g');
                            return (variable.match(regex) || []).length;
                        }
                        if (methodName === 'isdigit' && args.length === 0) return /^\d+$/.test(variable);
                        if (methodName === 'capitalize' && args.length === 0) {
                            return variable.charAt(0).toUpperCase() + variable.slice(1).toLowerCase();
                        }
                        if (methodName === 'title' && args.length === 0) {
                            return variable.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                        }
                        if (methodName === 'isalpha' && args.length === 0) return /^[a-zA-Z]+$/.test(variable);
                        if (methodName === 'islower' && args.length === 0) return variable === variable.toLowerCase();
                        if (methodName === 'isupper' && args.length === 0) {
                            return variable.length > 0 && !/[a-z]/.test(variable);
                        }
                        if (methodName === 'isspace' && args.length === 0) return /^\s+$/.test(variable);
                        if (methodName === 'join' && args.length === 1 && args[0] && args[0].type === 'list') {
                            return args[0].value.join(variable);
                        }
                        if (methodName === 'isprintable' && args.length === 0) {
                            return /^[\x20-\x7E]*$/.test(variable);
                        }
                        if (methodName === 'isidentifier' && args.length === 0) {
                            return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable);
                        }
                        if (methodName === 'findall' && args.length === 1) {
                            const regex = new RegExp(args[0], 'g');
                            return { type: 'list', value: variable.match(regex) || [] };
                        }
                        if (methodName === 'isalnum' && args.length === 0) {
                            return /^[a-zA-Z0-9]+$/.test(variable);
                        }
                        if (methodName === 'isnumeric' && args.length === 0) return /^\d+$/.test(variable);
                    }
                    if (variable.type === 'dict') {
                        if (methodName === 'keys' && args.length === 0) {
                            const keysAsStrings = Object.keys(variable.value);
                            const resolvedKeys = keysAsStrings.map(k => {
                                const num = parseFloat(k);
                                return !isNaN(num) && String(num) === k ? num : k;
                            });
                            return { type: 'list', value: resolvedKeys };
                        }
                        if (methodName === 'values' && args.length === 0) {
                            return { type: 'list', value: Object.values(variable.value) };
                        }
                        if (methodName === 'items' && args.length === 0) {
                            const items = Object.entries(variable.value).map(([key, value]) => {
                                const numKey = parseFloat(key);
                                const resolvedKey = !isNaN(numKey) && String(numKey) === key ? numKey : key;
                                return { type: 'tuple', value: [resolvedKey, value] };
                            });
                            return { type: 'list', value: items };
                        }
                        if (methodName === 'get' && args.length >= 1) {
                            const key = args[0];
                            const defaultValue = args.length > 1 ? args[1] : null;
                            const result = variable.value[key];
                            return result !== undefined ? result : defaultValue;
                        }
                    }
                }
            }
        }
        
        const indexMatch = str.match(/(\w+)\[(.+)\]/);
        if (indexMatch) {
            const varName = indexMatch[1];
            const indexValStr = indexMatch[2];
            if (variables.hasOwnProperty(varName)) {
                const collection = variables[varName];
                const key = resolveValue(indexValStr);

                if (collection && collection.value) {
                    if (collection.type === 'dict') {
                        return collection.value[key];
                    }
                    if ((collection.type === 'list' || collection.type === 'tuple') && typeof key === 'number' && key >= 0 && key < collection.value.length) {
                        return collection.value[key];
                    }
                } else if (typeof collection === 'string' && typeof key === 'number' && key >= 0 && key < collection.length) {
                    return collection[key];
                }
            }
        }
        if (variables.hasOwnProperty(str)) return variables[str];
        if (!isNaN(parseFloat(str)) && isFinite(str)) return parseFloat(str);
        
        const listMatch = str.match(/^\[(.*)\]$/);
        if (listMatch) {
            const contents = listMatch[1];
            const items = [];
            let buffer = "", depth = 0;

            for (let i = 0; i < contents.length; i++) {
                const char = contents[i];
                if (char === ',' && depth === 0) {
                    items.push(buffer.trim());
                    buffer = "";
                } 
                else{
                    if (char === '[' || char === '{' || char === '(') depth++;
                    if (char === ']' || char === '}' || char === ')') depth--;
                    buffer += char;
                }
            }
            if (buffer) items.push(buffer.trim());
            return {type: 'list', value: items.map(item => resolveValue(item))};
        }

        const tupleMatch = str.match(/^\((.*)\)$/);
        if (tupleMatch) {
            const contents = tupleMatch[1];
            const items = [];
            let buffer = "", depth = 0;

            for (let i = 0; i < contents.length; i++) {
                const char = contents[i];
                if (char === ',' && depth === 0) {
                    items.push(buffer.trim());
                    buffer = "";
                } 
                else{
                    if (char === '[' || char === '{' || char === '(') depth++;
                    if (char === ']' || char === '}' || char === ')') depth--;
                    buffer += char;
                }
            }
            if (buffer) items.push(buffer.trim());

            return{type: 'tuple', value: items.map(item => resolveValue(item))};
        }

        const dictMatch = str.match(/^\{([\s\S]*)\}$/);
        if (dictMatch) {
            const contents = dictMatch[1];
            const dict = {};
            if (contents.trim() !== '') {
                const entries = [];
                let buffer = "", depth = 0;

                for (let i = 0; i < contents.length; i++) {
                    const char = contents[i];
                    if (char === ',' && depth === 0) {
                        entries.push(buffer);
                        buffer = "";
                    }
                    else {
                        if (char === '{' || char === '[' || char === '(') depth++;
                        if (char === '}' || char === ']' || char === ')') depth--;
                        buffer += char;
                    }
                }
                if (buffer) entries.push(buffer);

                for (const pair of entries) {
                    const parts = pair.split(':');
                    if (parts.length === 2) {
                        const key = resolveValue(parts[0].trim());
                        const val = resolveValue(parts[1].trim());
                        dict[key] = val;
                    }
                }
            }
            return { type: 'dict', value: dict };
        }
        return evaluateBinaryExpression(str);
    };

    const evaluateBinaryExpression = (expression) => {
        const exprMatch = String(expression).trim().match(/(.+?)\s*(==|!=|>=|<=|>|<|\*\*|<<|>>|&|\||\^|\/\/|[+\-*/%])\s*(.+)/);
        if (!exprMatch) return undefined;
        const [, p1, op, p2] = exprMatch;
        const v1 = resolveValue(p1); const v2 = resolveValue(p2);
        if (v1 === undefined || v2 === undefined) return undefined;
        
        switch (op) {
            case '==': return v1 == v2; // Using == for loose equality similar to Python's behavior
            case '!=': return v1 != v2;
            case '>': return v1 > v2;
            case '<': return v1 < v2;
            case '>=': return v1 >= v2;
            case '<=': return v1 <= v2;
        }
        
        if (op === '+') { 
            if ((v1 && v1.type === 'list') || (v2 && v2.type === 'list')) return undefined;
            if ((v1 && v1.type === 'tuple') || (v2 && v2.type === 'tuple')) return undefined;
            return (typeof v1 === 'string' || typeof v2 === 'string') ? String(v1) + String(v2) : v1 + v2; 
        }
        if (typeof v1 === 'number' && typeof v2 === 'number') {
            if (op === '-') return v1 - v2;
            if (op === '*') return v1 * v2;
            if (op === '/') return v1 / v2;
            if (op === '%') return v1 % v2;
            if (op === '//') return Math.trunc(v1 / v2);
            if (op === '**') return Math.pow(v1, v2);
            if (op === '&') return v1 & v2;
            if (op === '|') return v1 | v2;
            if (op === '^') return v1 ^ v2;
            if (op === '<<') return v1 << v2;
            if (op === '>>') return v1 >> v2;            
        }
        return undefined;
    };

    
    const evaluateCondition = (fullCondition) => {
        const evaluateSimpleCondition = (condition) => {
            condition = condition.trim();
            let negate = false;
            if (condition.startsWith('not ')) {
                negate = true;
                condition = condition.substring(4).trim();
            }

            // Try to evaluate as a binary expression first
            let result = evaluateBinaryExpression(condition);
            
            // If it's not a binary expression, treat it as a single value (e.g., "if my_variable:")
            if (result === undefined) {
                result = resolveValue(condition);
            }
            
            return negate ? !result : !!result; // Ensure a boolean is returned
        };

        const orParts = fullCondition.split(' or ');
        for (const orPart of orParts) {
            const andParts = orPart.split(' and ');
            let andResult = true;
            for (const andPart of andParts) {
                if (!evaluateSimpleCondition(andPart)) {
                    andResult = false;
                    break;
                }
            }
            if (andResult) return true;
        }
        return false;
    };
    
    const findEndOfBlock = (startIndex, startIndentation) => {
        let j = startIndex;
        while (j < lines.length && lines[j].indentation > startIndentation) j++;
        return j;
    };

    const parseBlock = (startIndex, endIndex) => {
        let i = startIndex;
        let ifChainState = { succeeded: false, indentation: -1 };
        while (i < endIndex) {
            const currentLine = lines[i];
            if (!currentLine.text) { i++; continue; }

            if (currentLine.text === 'break') {
                steps.push({ line: currentLine.number, variables: structuredClone(variables), output: structuredClone(lastOutputState) });
                return { signal: 'break' };
            }
            if (currentLine.text === 'continue') {
                steps.push({ line: currentLine.number, variables: structuredClone(variables), output: structuredClone(lastOutputState) });
                return { signal: 'continue' };
            }

            steps.push({ line: currentLine.number, variables: structuredClone(variables), output: structuredClone(lastOutputState) });
            while (ifChainStack.length > 0 && currentLine.indentation < ifChainStack[ifChainStack.length - 1].indentation) { ifChainStack.pop(); }
            const forRangeMatch = currentLine.text.match(/^for\s+(\w+)\s+in\s+range\((.*)\):$/);
            const forEachMatch = currentLine.text.match(/^for\s+(\w+)\s+in\s+(.+):$/);
            const whileMatch = currentLine.text.match(/^while\s+(.+?):$/);
            const ifMatch = currentLine.text.match(/^if\s+(.+?):$/);
            const elifMatch = currentLine.text.match(/^elif\s+(.+?):$/);
            const elseMatch = currentLine.text === 'else:';
            const printMatch = currentLine.text.match(/^print\((.*)\)$/);
            const assignMatch = currentLine.text.match(/^(.*?)\s*=\s*(.+)$/);
            const methodCallMatch = currentLine.text.match(/(\w+)\.(\w+)\((.*)\)/);

            if (forRangeMatch) {
                const [, loopVar, rangeArgsStr] = forRangeMatch;
                const rangeArgs = parseArguments(rangeArgsStr);
                let start = 0, end = 0, step = 1;
                if (rangeArgs.length === 1) end = rangeArgs[0];
                else if (rangeArgs.length === 2) [start, end] = rangeArgs;
                else if (rangeArgs.length === 3) [start, end, step] = rangeArgs;
                const blockStart = i + 1; const blockEnd = findEndOfBlock(blockStart, currentLine.indentation);
                for (let loopVal = start; (step > 0 ? loopVal < end : loopVal > end); loopVal += step) {
                    variables[loopVar] = loopVal;
                    const blockResult = parseBlock(blockStart, blockEnd);
                    if (blockResult.signal === 'break') break;
                    if (blockResult.signal === 'continue') continue;
                }
                i = blockEnd;
            }
            else if (forEachMatch) {
                const [, loopVar, listVarName] = forEachMatch;
                const list = resolveValue(listVarName);
                if (list && list.value && Array.isArray(list.value)) {
                    const blockStart = i + 1; const blockEnd = findEndOfBlock(blockStart, currentLine.indentation);
                    for (const item of list.value) {
                        variables[loopVar] = item;
                        const blockResult = parseBlock(blockStart, blockEnd);
                        if (blockResult.signal === 'break') break;
                        if (blockResult.signal === 'continue') continue;
                    }
                    i = blockEnd;
                } else { i++; }
            }
            else if (whileMatch) {
                const condition = whileMatch[1];
                const blockStart = i + 1; const blockEnd = findEndOfBlock(blockStart, currentLine.indentation);
                let iterationCount = 0; const maxIterations = 1000;
                while (evaluateCondition(condition) && iterationCount < maxIterations) {
                    const blockResult = parseBlock(blockStart, blockEnd);
                    if (blockResult.signal === 'break') break;
                    if (blockResult.signal === 'continue') continue;
                    iterationCount++;
                }
                i = blockEnd;
            }
            else if (ifMatch) {
                ifChainState = { succeeded: false, indentation: currentLine.indentation };
                const result = evaluateCondition(ifMatch[1]);
                if (result) ifChainState.succeeded = true;
                const blockStart = i + 1; const blockEnd = findEndOfBlock(blockStart, currentLine.indentation);
                if (result) {
                    const blockResult = parseBlock(blockStart, blockEnd);
                    if (blockResult.signal) return blockResult;
                }
                i = blockEnd;
            }
            else if (elifMatch && ifChainState && currentLine.indentation === ifChainState.indentation) {
                let result = false;
                if (!ifChainState.succeeded) {
                    result = evaluateCondition(elifMatch[1]);
                    if (result) ifChainState.succeeded = true;
                }
                const blockStart = i + 1; const blockEnd = findEndOfBlock(blockStart, currentLine.indentation);
                if (result) {
                     const blockResult = parseBlock(blockStart, blockEnd);
                     if (blockResult.signal) return blockResult;
                }
                i = blockEnd;
            }
            else if (elseMatch && ifChainState && currentLine.indentation === ifChainState.indentation) {
                const blockStart = i + 1; const blockEnd = findEndOfBlock(blockStart, currentLine.indentation);
                if (!ifChainState.succeeded) {
                    const blockResult = parseBlock(blockStart, blockEnd);
                    if (blockResult.signal) return blockResult;
                }
                i = blockEnd;
            }
            else if (printMatch) {
                const args = parseArguments(printMatch[1]);
                const outputParts = args.map(arg => formatValueForPrintOutput(arg));
                const outputString = outputParts.join(' ');
                output.push(outputString);
                lastOutputState = [...output];
                i++;
            }
            else if (methodCallMatch && !assignMatch) {
                const [, varName, methodName, argsStr] = methodCallMatch;
                const args = parseArguments(argsStr);

                if (variables.hasOwnProperty(varName)) {
                    const collection = variables[varName];
                    if (collection.type === 'list') {
                        if (methodName === 'append' && args.length === 1) {
                            collection.value.push(args[0]); // Direct mutation
                        }
                        if (methodName === 'insert' && args.length === 2 && typeof args[0] === 'number') {
                            collection.value.splice(args[0], 0, args[1]); // Direct mutation
                        }
                        if (methodName === 'sort' && args.length === 0) {
                            collection.value.sort((a, b) => { // Direct mutation
                                if (typeof a === 'number' && typeof b === 'number') return a - b;
                                return String(a).localeCompare(String(b));
                            });
                        }
                        if (methodName === 'reverse' && args.length === 0) {
                            collection.value.reverse(); // Direct mutation
                        }
                        if (methodName === 'remove' && args.length === 1) {
                            const index = collection.value.findIndex(item => item === args[0]);
                            if (index > -1) {
                                collection.value.splice(index, 1); // Direct mutation
                            }
                        }
                        if (methodName === 'clear' && args.length === 0) {
                            collection.value.length = 0; // The most efficient way to clear
                        }
                    }
                    else if (collection.type === 'dict') {
                        if (methodName === 'setdefault' && args.length === 2) {
                            const [key, value] = args;
                            if (!collection.value.hasOwnProperty(key)) {
                                collection.value[key] = value;
                            }
                        }
                        if (methodName === 'update' && args.length === 1 && args[0].type === 'dict') {
                            Object.assign(collection.value, args[0].value);
                        }
                        if (methodName === 'clear' && args.length === 0) {
                            variables[varName] = { ...collection, value: {} };
                        }
                    }
                }
                i++;
            }
            else if (assignMatch) {
                const [, varNameStr, valueStr] = assignMatch;
                const target = varNameStr.trim();
                const popAssignMatch = valueStr.trim().match(/(\w+)\.pop\((.*)\)/);

                if (popAssignMatch) {
                    const [, popVarName, popArgsStr] = popAssignMatch;
                    const popArgs = parseArguments(popArgsStr);

                    if (variables.hasOwnProperty(popVarName)) {
                        const collection = variables[popVarName];
                        
                        if (collection.type === 'list' && collection.value.length > 0 && popArgs.length === 0) {
                            const poppedValue = collection.value.pop(); // Direct mutation
                            variables[target] = poppedValue;
                        }
                        else if (collection.type === 'dict' && popArgs.length > 0) {
                            const key = popArgs[0];
                            if (collection.value.hasOwnProperty(key)) {
                                const poppedValue = collection.value[key];
                                delete collection.value[key]; // Direct mutation
                                variables[target] = poppedValue;
                            }
                        }
                    }
                }

                else {
                    const value = resolveValue(valueStr);
                    if (value !== undefined) {
                        const indexMatch = target.match(/(\w+)\[(.+)\]/);

                        if (indexMatch) {
                            const varName = indexMatch[1];
                            const key = resolveValue(indexMatch[2]);
                            if (variables.hasOwnProperty(varName)) {
                                const collection = variables[varName];
                                if (collection.type === 'list' && typeof key === 'number') {
                                    const newList = { ...collection, value: [...collection.value] };
                                    if (key >= 0 && key < newList.value.length) {
                                        newList.value[key] = value;
                                        variables[varName] = newList;
                                    }
                                } 
                                else if (collection.type === 'dict') {
                                    const newDict = { ...collection, value: {...collection.value} };
                                    newDict.value[key] = value;
                                    variables[varName] = newDict;
                                }
                            }
                        } 
                        else {
                            variables[target] = value;
                        }
                    }
                }
                i++;
            } 
            else { i++; }
        }
        return { signal: null };
    };
    
    parseBlock(0, lines.length);
    steps.push({ line: -1, variables: structuredClone(variables), output: structuredClone(output) });
    return { steps };
};