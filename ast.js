export class Node {
  
  constructor(p) {
    console.log(this.constructor.name + "\n")
    Object.assign(this, p);
    this.type = this.constructor.name
  }

  compile() {
    return this;
  }
}

export class Program extends Node {
  constructor(p) {
    super({})
    
    let bodyArr = []
    bodyArr.push(p.first)
    bodyArr.concat(p.rest)
    this.body = bodyArr
  }  
}

export class BlockStatement extends Node {
  constructor(p) {
    super({})
    
    if(p != null) {
      this.body = p.first.concat(p.rest)
    }
    else {
      this.body = []
    }
  }  
}

export class Literal extends Node {
}

