const Lexer = require('../src/lexer');

const input = `
function hello() {
    console.log("Hello, world!");
}
hello();
`;

const lexer = new Lexer(input);
const tokens = lexer.tokenize();

console.log(tokens);
