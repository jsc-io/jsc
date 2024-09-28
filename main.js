const fs = require('fs');
const path = require('path');
const Lexer = require('./src/lexer');
const Parser = require('./src/parser');
const CodeGen = require('./src/codegen');


function printUsage() {
  console.log('Usage: node main.js <input_file.js> -o <output_file.c>');
  console.log('Example: node main.js input.js -o output.c');
}


function parseArguments() {
  const args = process.argv.slice(2);
  let inputFile = null;
  let outputFile = 'output.c'; 

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' && i + 1 < args.length) {
      outputFile = args[i + 1];
      i++;
    } else if (!inputFile) {
      inputFile = args[i];
    }
  }

  if (!inputFile) {
    printUsage();
    process.exit(1);
  }

  return { inputFile, outputFile };
}


function main() {
  const { inputFile, outputFile } = parseArguments();


  try {
    const inputCode = fs.readFileSync(inputFile, 'utf8');
    

    const lexer = new Lexer(inputCode);
    const tokens = lexer.tokenize();

    
    const parser = new Parser(tokens);
    const ast = parser.parse();

    
    const codegen = new CodeGen();
    const cCode = codegen.generate(ast);

    
    fs.writeFileSync(outputFile, cCode);
    console.log(`Successfully generated C code from file: ${path.resolve(outputFile)}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
