const Lexer = require('../lexer');
const Parser = require('../parser');


const sourceCode = `
function hello() {
    console.log('Hello, world!');
}
hello();
`;


const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();
console.log('Tokens:', tokens);


const parser = new Parser(tokens);
const ast = parser.parse();
console.log('AST:', JSON.stringify(ast, null, 2));

