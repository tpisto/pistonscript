export class Feature {
  
  constructor(features, ...params) {
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
    console.log(this.constructor.name)
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

  toString() {
    return "Class name: " + this.constructor.name
  }
}

export class Main extends Feature {
}

export class Term extends Feature {
  
  afterChildsString() {
    return "\n"
  }  
}

export class Text extends Feature {
  afterChildsString() {
    return this.features + ' '
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
    this.params[0].forEach(p => {
      params += p.compile()
    })

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
      ret += this.params[0] + "("
    }
    return ret
  }

  afterChildsString() {
    return ")"
  }

}

export class Parameter extends Feature {
  
  afterChildsString() {
    let ret = ''
    // !IMPORTANT! Compile sub parameters...
    if(this.params.length > 0) {
      if(this.params[0] != null) {
        ret += ',' + this.params[0].features.compile()
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
    // Variable name
    if(this.params[1]) {
      ret += this.params[1] + ' = '
    }
    return ret
  }
}

