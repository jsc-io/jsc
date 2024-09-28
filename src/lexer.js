// lexer.js
class Lexer {
    constructor(input) {
      this.input = input;
      this.position = 0;
      this.tokens = [];
    }
  
    tokenize() {
      while (this.position < this.input.length) {
        const char = this.input[this.position];
  
        switch (char) {
          case '(': 
            this.tokens.push({ type: 'LPAREN', value: char });
            this.position++;
            break;
          case ')':
            this.tokens.push({ type: 'RPAREN', value: char });
            this.position++;
            break;
          case '{': 
            this.tokens.push({ type: 'LBRACE', value: char });
            this.position++;
            break;
          case '}': 
            this.tokens.push({ type: 'RBRACE', value: char });
            this.position++;
            break;
          case ';': 
            this.tokens.push({ type: 'SEMICOLON', value: char });
            this.position++;
            break;
          case ',': 
            this.tokens.push({ type: 'COMMA', value: char });
            this.position++;
            break;
          case '.': 
            this.tokens.push({ type: 'DOT', value: char });
            this.position++;
            break;
          case '"': 
          case "'": 
            this.tokens.push(this.readString(char));
            break;
          
          case ' ':
          case '\t':
          case '\n':
          case '\r':
            this.position++;
            break;
          default:
            if (this.isLetter(char)) {
              this.tokens.push(this.readIdentifier());
            } else if (this.isDigit(char)) {
              this.tokens.push(this.readNumber());
            } else {
              throw new Error(`Unexpected character: ${char}`);
            }
        }
      }
      return this.tokens;
    }
  
    
    readString(quoteType) {
      let start = this.position;
      this.position++; 
      let value = '';
  
      while (this.position < this.input.length && this.input[this.position] !== quoteType) {
        value += this.input[this.position];
        this.position++;
      }
  
      if (this.input[this.position] !== quoteType) {
        throw new Error('Unterminated string');
      }
  
      this.position++; 
      return { type: 'STRING', value };
    }
  
    
    readIdentifier() {
      let start = this.position;
      while (this.isLetterOrDigit(this.input[this.position])) {
        this.position++;
      }
      const value = this.input.slice(start, this.position);
      return { type: 'IDENTIFIER', value };
    }
  
    
    readNumber() {
      let start = this.position;
      while (this.isDigit(this.input[this.position]) || this.input[this.position] === '.') {
        this.position++;
      }
      const value = this.input.slice(start, this.position);
      return { type: 'NUMBER', value };
    }
  
    
    isLetter(char) {
      return /[a-zA-Z_]/.test(char); 
    }
  
    
    isDigit(char) {
      return /[0-9]/.test(char);
    }
  
    
    isLetterOrDigit(char) {
      return /[a-zA-Z0-9_]/.test(char); 
    }
  }
  
  module.exports = Lexer;
  