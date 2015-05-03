import * as ps from 'features'

let p = require('./node_modules/coffee-script-redux/lib/preprocessor.js')
let fs = require('fs')
let PEG = require('pegjs')

class PistoScript {
  
  constructor() {
    this.parserFile = fs.readFileSync('myparser.pegjs').toString()
    this.parser = PEG.buildParser(this.parserFile)
  }
  
  parse(file) {
    this.preProcessedFile = p.Preprocessor.process(file)
    this.parsed = this.parser.parse(this.preProcessedFile)
    this.features = this.parsed
    return this.features
  }
}

let testFile = fs.readFileSync('mysimple.ps')
let compiler = new PistoScript()
let parsedFile = compiler.parse(testFile)

let compiledScript = parsedFile.compile()

console.log(parsedFile)
console.log(compiledScript)

fs.writeFileSync('testout.js', compiledScript);

