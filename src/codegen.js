class CodeGen {
    generate(node) {
      const standardHeaders = `#include <stdio.h>\n#include <stdlib.h>\n\n`;
  
      switch (node.type) {
        case 'Program':
          return (
            standardHeaders +
            node.body
              .filter(stmt => stmt.type !== 'FunctionCall') 
              .map(this.generate.bind(this))
              .join('\n') +
            `\nint main() {\n${this.generateMainCalls(node)}\n  return 0;\n}`
          );
  
        case 'FunctionDeclaration':
            case 'FunctionDeclaration':
                let returnType = this.inferFunctionReturnType(node);
                return `${returnType} ${node.name}() ${this.generate(node.body)}`;
           
        case 'Block':
          return `{\n${node.body.map(this.generate.bind(this)).join('\n')}\n}`;
  
        case 'FunctionCall':
          return `${node.name}(${node.arguments
            .map(this.generate.bind(this))
            .join(', ')});`;
  
        case 'MethodCall':
          return this.generateMethodCall(node);
  
        case 'VariableDeclaration':
          return `int ${node.name} = ${this.generate(node.initializer)};`;
  
        case 'AssignmentExpression':
          return `${this.generate(node.left)} = ${this.generate(node.right)};`;
  
        case 'BinaryExpression':
          return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
  
        case 'IfStatement':
          return `if (${this.generate(node.test)}) ${this.generate(node.consequent)}${
            node.alternate ? ` else ${this.generate(node.alternate)}` : ''
          }`;
  
        case 'WhileStatement':
          return `while (${this.generate(node.test)}) ${this.generate(node.body)}`;
  
        case 'ForStatement':
          return `for (${this.generate(node.init)} ${this.generate(
            node.test
          )}; ${this.generate(node.update)}) ${this.generate(node.body)}`;
  
        case 'ReturnStatement':
          return `return ${node.argument ? this.generate(node.argument) : ''};`;
  
        case 'Identifier':
          return node.name;
  
        case 'StringLiteral':
          return `"${node.value}"`;
  
        case 'NumericLiteral':
          return node.value;
  
        case 'EmptyStatement':
          return ''; 
  
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    }
  

    inferFunctionReturnType(node) {
        
        if (node.body && Array.isArray(node.body)) { 
          if (node.body.some(stmt => stmt.type === 'ReturnStatement')) {
            let returnStmt = node.body.find(stmt => stmt.type === 'ReturnStatement');
            
            if (returnStmt.argument) {
              switch (returnStmt.argument.type) {
                case 'NumericLiteral':
                  return returnStmt.argument.value.includes('.') ? 'double' : 'int';
                case 'Identifier':
                  return 'int';
                default:
                  return 'void';
              }
            }
          }
        }
        return 'void';
      }
    
  
    generateMainCalls(node) {
      const functionCalls = node.body
        .filter(stmt => stmt.type === 'FunctionCall') 
        .map(this.generate.bind(this));
      return functionCalls.join('\n');
    }
  
    generateMethodCall(node) {
      switch (node.object) {
        case 'console':
          if (node.method === 'log') {
            return `printf(${node.arguments
              .map((arg) => this.generate(arg))
              .join(', ')});`;
          }
          throw new Error(`Unknown console method: ${node.method}`);
        default:
          throw new Error(`Unknown object for method call: ${node.object}`);
      }
    }
  }
  
  module.exports = CodeGen;
  