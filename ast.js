export class Node {
  
  constructor(p) {
    console.log(this.constructor.name + "\n")

    // Make parameters into own properties
    if(p!=null) { 
      Object.assign(this, p); 
    }

    this.type = this.constructor.name
  }

  extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  extractList(list, index) {
    var result = new Array(list.length), i;

    for (i = 0; i < list.length; i++) {
      result[i] = list[i][index];
    }

    return result;
  }

  buildList(first, rest, index) {
    return [first].concat(extractList(rest, index));
  }

  optionalList(value) {
    return value !== null ? value : [];
  }

  compile() {
    return this;
  }
}

export class Program extends Node {
  constructor(p) {
    super()
    this.body = this.optionalList(p.body)
  }
}

export class BlockStatement extends Node {
  constructor(p) {
    super()
    this.body = this.optionalList(this.extractOptional(p.body, 0))
  }
}

export class VariableDeclaration extends Node {
}

export class Literal extends Node {
}

