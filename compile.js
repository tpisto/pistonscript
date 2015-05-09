import * as ps from 'ast'

let p = require('./node_modules/coffee-script-redux/lib/preprocessor.js')
let fs = require('fs')
let PEG = require('pegjs')
let escodegen = require('lib/escodegen/escodegen')

class PistoScript {
  
  constructor() {
    this.parserFile = fs.readFileSync('myparser.pegjs').toString()
    this.parser = PEG.buildParser(this.parserFile)
  }
  
  parse(file) {
    this.preProcessedFile = p.Preprocessor.process(file)
    this.parsed = this.parser.parse(this.preProcessedFile)
    this.ast = this.parsed
    return this.ast
  }
}

let testFile = fs.readFileSync('mysimple.ps')
let compiler = new PistoScript()
let parsedFile = compiler.parse(testFile)

let compiledScript = parsedFile.compile()

// console.log(parsedFile)
// console.log(compiledScript)

console.log(escodegen.generate(parsedFile))

fs.writeFileSync('testout.js', compiledScript);

