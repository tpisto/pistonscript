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

/**
* This is the description for my class.
*
* @class Program
* @constructor
*/
export class Program extends Node {
  constructor(p) {
    super()
    this.body = this.optionalList(p.body)
  }
}

/**
* Block statement works with curly brackets or indented.
*
* @class BlockStatement
* @constructor
*/
export class BlockStatement extends Node {
  constructor(p) {
    super()
    this.body = this.optionalList(this.extractOptional(p.body, 0))
  }
}

/**
* Variable could be declared using let, var, const
*
* @class VariableDeclaration
* @constructor
*/
export class VariableDeclaration extends Node {
}

/**
* Literal
*
* @class Literal
* @constructor
*/
export class Literal extends Node {
}

/**
* if ... then ... else ...
*
* @class IfStatement
* @constructor
*/
export class IfStatement extends Node {
}

/**
* Expression
*
* @class ExpressionStatement
* @constructor
*/
export class ExpressionStatement extends Node {
}

export class Expression extends Node {
  constructor(p) {
    super()
    if(p.rest.length > 0) {
      this.type =  "SequenceExpression"
      this.expressions = buildList(p.first, p.rest, 3)
    } else {
      console.log('JEEE')
      console.log(p)
      Object.assign(this, p.first);       
    }
  }
}

export class AssignmentExpression extends Node {
  constructor(p) {
    super(p)
    console.log('wERJWELKRWEJLKRWEJRJWELRJWELKR')
  }
}

export class CallExpression extends Node {
  constructor(p) {
    super(p)
    console.log('wERJWELKRWEJLKRWEJRJWELRJWELKR')
  }
}
