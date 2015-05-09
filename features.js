export class Feature {
  
  constructor(features, ...params) {

    console.log("Making: " + this.constructor.name)

    this.features = features
    this.params = params

    // Set parent
    if(this.features && this.features instanceof Array) {
      this.features.forEach((f) =>
        f.parent = this
      )
    } else {
      if(this.features && this.featuresNotString()) {
        this.features.parent = this
      }
    }
  }

  compile() {
    // console.log(this.constructor.name)
    let ret = this.beforeChildsString()

    // Has childs  
    if(this.features) {
      // Array of childs
      if(this.features instanceof Array) {
        this.features.forEach(featureClass => {
          ret += featureClass.compile()
        })
      }
      // Single child (oh well, should find a method to check if its parent type of Feature... didnt find yet from any documentation)
      else if(this.features && this.featuresNotString()) {
        ret += this.features.compile()        
      }
    }

    ret += this.afterChildsString()
    return ret
  }

  featuresNotString() {
    return typeof this.features != 'string' 
  }

  beforeChildsString() {
    return '';
  }
  afterChildsString() {
    return '';
  }
}

export class Main extends Feature {
}

export class MultipleStatements extends Feature {
}

export class Term extends Feature {
  
  afterChildsString() {
    return "\n"
  }  
}

export class Text extends Feature {
  afterChildsString() {
    return this.features
  }
}

export class Brackets extends Feature {
  beforeChildsString() {
    return '['
  }
  afterChildsString() {
    return ']'
  }
}

export class Braces extends Feature {
  beforeChildsString() {
    return '{'
  }
  afterChildsString() {
    return '}'
  }
}

export class Parentheses extends Feature {
  beforeChildsString() {
    if(!this.parent instanceof Parameter) {
      return '('
    } else {
      return ''
    }
  }
  afterChildsString() {
    if(!this.parent instanceof Parameter) {
      return ')'
    } else {
      return ''
    }
  }
}

export class Import extends Feature {

  beforeChildsString() {
    let params = '' 
    let ret = '' 
    let par1 = ''
    let par2 = ''
    if(this.params[1]) {
      par1 = '{ '
      par2 = ' }'
    }
    if(this.params[0].length > 0) {
      params = this.params[0].join(', ')
    }
    ret += `import ${par1}${params}${par2} from `
    return ret;
  }
}

export class Block extends Feature {
  
  beforeChildsString() {
    return ' { '
  }
  afterChildsString() {
    return ' } '
  }
}

export class FatArrow extends Feature {
  
  beforeChildsString() {

    // Get params
    let params = ''

    // This supports one or multiple parameters
    if (this.params[0] instanceof Parameter) {
      this.params[0].forEach(p => {
          params += p.compile()
      })
    } else {
      params = this.params[0]
    }

    if(this.features && this.features.constructor.name == 'Block')  {
      return `(${params}) =>`
    } else {
      return `(${params}) => { `
    }
  }
  afterChildsString() {
    if(this.features && this.features.constructor.name == 'Block')  {
      return ''
    } else {
      return ' } '
    }
  }
}

export class ThinArrow extends Feature {
}

export class ArithmeticExpression extends Feature {
  beforeChildsString() {
    return this.params[0] + ' '
  }
}

export class CompareExpression extends Feature {
  beforeChildsString() {
    return this.params[0] + ' '
  }
}

export class Keyword extends Feature {

  beforeChildsString() {
    let ret = ''
    // Keyword
    if(this.params[0]) {
      ret += this.params[0] + ' '
    }
    return ret
  }
}

export class FunctionCall extends Feature {

  beforeChildsString() {
    let ret = ''
    // Function
    if(this.params[0]) {
      ret += this.params[0].compile()
      // Do not add parentheses if inside parameters
      if(!(this.parent instanceof Parameter)) {
        ret += "("
      }
    }
    return ret
  }

  afterChildsString() {
    let ret = ''
    
    if(!(this.parent instanceof Parameter)) {
      ret += ")"
    }  
    return ret
  }
}

export class JsObject extends Feature {
  afterChildsString() {
    return "[" + this.params[0].compile() + "]"
  }
}

export class For extends Feature {

  beforeChildsString() {
    return 'for ('
  }

  afterChildsString() {
    if(this.params[0] == 'of') {
      // Compile block and the statement where to get the data from
      return " of " + this.params[2].compile() + ")\n" + this.params[1].compile()
    }
  }
}

export class If extends Feature {

  beforeChildsString() {
    return 'if ('
  }

  afterChildsString() {
    if(this.params[1] instanceof Block) {
      return this.params[0].compile() + ')' + this.params[1].compile()
    } 
    else {
      return this.params[0].compile() + ') {' + this.params[1].compile() + '}'
    }
  }
}

export class Parameter extends Feature {
  
  afterChildsString() {
    let ret = ''
    // !IMPORTANT! Compile sub parameters...
    if(this.params.length > 0) {
      if(this.params[0] != null) {
        ret += ',' + this.params[0].compile()
      }
    }
    return ret;
  }
}

export class SetVariable extends Feature {

  beforeChildsString() {    
    let ret = ''    
    
    // Let
    if(this.params[0]) {
      ret += this.params[0] + ' '  
    }

    // Variable name (do not create for parameter types)
    if (this.params[1] instanceof Parameter) {
      ret += "[" + this.params[1].compile() + "]"
      if(this.features) {
        ret += ' = '
      }
    }    
    else 
    {
      if (this.params[1] && this.features) {
          ret += this.params[1].compile() + ' = '
      } else {
          ret += this.params[1]
      }
    }
    return ret
  }
}
