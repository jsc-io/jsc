class Parser {
    constructor(tokens) {
      this.tokens = tokens;
      this.position = 0;
    }
  
    parse() {
      const ast = {
        type: 'Program',
        body: []
      };
  
      while (this.position < this.tokens.length) {
        const statement = this.parseStatement();
        if (statement) {
          ast.body.push(statement);
        }
      }
  
      return ast;
    }
  
    parseStatement() {
      const token = this.peek();
  
      switch (token.type) {
        case 'IDENTIFIER':
          return this.parseFunctionCallOrExpression();
        case 'LBRACE':
          return this.parseBlock();
        case 'SEMICOLON':
          this.consume('SEMICOLON'); 
          return { type: 'EmptyStatement' };
        default:
          throw new Error(`Unexpected token: ${token.value}`);
      }
    }
  
    parseFunctionCallOrExpression() {
      const identifier = this.consume('IDENTIFIER');
  
      if (this.peek().type === 'LPAREN') {
        return this.parseFunctionCall(identifier);
      } else if (this.peek().type === 'DOT') {
        return this.parseMethodCall(identifier);
      } else {
        return { type: 'Identifier', name: identifier.value }; 
      }
    }
  
    parseMethodCall(object) {
      this.consume('DOT');
      const method = this.consume('IDENTIFIER');
      this.consume('LPAREN');
      const args = this.parseArguments();
      this.consume('RPAREN');
  
      return {
        type: 'MethodCall',
        object: object.value,
        method: method.value,
        arguments: args
      };
    }
  
    parseFunctionCall(identifier) {
      this.consume('LPAREN');
      const args = this.parseArguments();
      this.consume('RPAREN');
  
      return {
        type: 'FunctionCall',
        name: identifier.value,
        arguments: args
      };
    }
  
    parseArguments() {
      const args = [];
  
      while (this.peek().type !== 'RPAREN') {
        if (this.peek().type === 'COMMA') {
          this.consume('COMMA');
        } else {
          args.push(this.parseExpression());
        }
      }
  
      return args;
    }
  
    parseExpression() {
      const token = this.peek();
  
      if (token.type === 'IDENTIFIER') {
        return { type: 'Identifier', name: this.consume('IDENTIFIER').value }; 
      } else if (token.type === 'NUMBER') {
        return { type: 'NumberLiteral', value: this.consume('NUMBER').value }; 
      } else if (token.type === 'STRING') {
        return { type: 'StringLiteral', value: this.consume('STRING').value }; 
      } else {
        throw new Error(`Unexpected token in expression: ${token.value}`);
      }
    }
  
    parseBlock() {
      this.consume('LBRACE');
      const body = [];
  
      while (this.peek().type !== 'RBRACE' && this.position < this.tokens.length) {
        const statement = this.parseStatement();
        if (statement) {
          body.push(statement);
        }
      }
  
      this.consume('RBRACE');
      return { type: 'Block', body };
    }
  
    consume(expectedType) {
      const token = this.tokens[this.position];
  
      if (token.type !== expectedType) {
        throw new Error(`Expected ${expectedType}, got ${token.type}`);
      }
  
      this.position++;
      return token;
    }
  
    peek() {
      return this.tokens[this.position];
    }
  }
  
  module.exports = Parser;
  