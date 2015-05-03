export class Feature {
  
  constructor(features, ...params) {
    this.features = features
    this.params = params
  }

  compile() {
    let ret = this.beforeChildsString()

    // Has childs  
    if(this.features) {
      // Array of childs
      if(this.features.constructor.name == 'Array') {
        this.features.forEach(featureClass => {
          ret += featureClass.compile()
        })
      }
      // Single child (oh well, should find a method to check if its parent type of Feature... didnt find yet from any documentation)
      else if(this.features.constructor && this.features.constructor.name && this.features.constructor.name != 'String') {
        ret += this.features.compile()        
      }
    }

    ret += this.afterChildsString()
    return ret
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
    if(this.features && this.features.constructor.name == 'Block')  {
      return `(${this.params[0]}) =>`
    } else {
      return `(${this.params[0]}) => { `
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
      ret += this.params[0] + '('
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
      ret += ',' + this.params[0].features.compile()
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

