// SEMANTIC ANALYZER
//
// Decorates the AST with semantic information and checks the semantic
// constraints. Decorations include:
//
//     * Creating semantic objects for actual variables, functions, and
//       types (The AST made from parsing only has variable declarations,
//       function declarations, and type declarations; real objects often
//       have to be made during analysis)
//     * Adding a type field to all expressions
//     * Figuring out what identifiers refer to (Each identifier token from
//       the AST will get a new property called "value" that will point to
//       the actual variable, function, or type)
//
// Semantic checks are found in this module. They are functions starting
// with "check". There are a lot of them, to be sure. A lot of them have to
// do with type checking. The semantics of type equivalence and assignability
// are complex and defined here as methods in each AST class for types.
//
// Invoke
//
//     analyze(astRootNode)
//
// to decorate the AST and perform semantic analysis. The function returns
// the root node for convenience in chaining calls.

import {
    Variable,
    Type,
    FunctionType,
    ArrayType,
    StructType,
   // OptionalType,
    Function,
    Token,
    error,
  } from "./core.js"
  import * as stdlib from "./stdlib.js"
  
  /**********************************************
   *  TYPE EQUIVALENCE AND COMPATIBILITY RULES  *
   *********************************************/
  
  Object.assign(Type.prototype, {
    // Equivalence: when are two types the same
    isEquivalentTo(target) {
      return this == target
    },
    // T1 assignable to T2 is when x:T1 can be assigned to y:T2. By default
    // this is only when two types are equivalent; however, for other kinds
    // of types there may be special rules. For example, in a language with
    // supertypes and subtypes, an object of a subtype would be assignable
    // to a variable constrained to a supertype.
    isAssignableTo(target) {
      return this.isEquivalentTo(target)
    },
  })
  
  Object.assign(ArrayType.prototype, {
    isEquivalentTo(target) {
      // [T] equivalent to [U] only when T is equivalent to U.
      return (
        target.constructor === ArrayType && this.elementType.isEquivalentTo(target.elementType)
      )
    },
    isAssignableTo(target) {
      // Arrays are INVARIANT in Carlos!
      return this.isEquivalentTo(target)
    },
  })
  
//   Object.assign(FunctionType.prototype, {
//     isEquivalentTo(target) {
//       return (
//         target.constructor === FunctionType &&
//         this.returnType.isEquivalentTo(target.returnType) &&
//         this.paramTypes.length === target.paramTypes.length &&
//         this.paramTypes.every((t, i) => target.paramTypes[i].isEquivalentTo(t))
//       )
//     },
//     isAssignableTo(target) {
//       // Functions are covariant on return types, contravariant on parameters.
//       return (
//         target.constructor === FunctionType &&
//         this.returnType.isAssignableTo(target.returnType) &&
//         this.paramTypes.length === target.paramTypes.length &&
//         this.paramTypes.every((t, i) => target.paramTypes[i].isAssignableTo(t))
//       )
//     },
//   })
  
//   Object.assign(OptionalType.prototype, {
//     isEquivalentTo(target) {
//       // T? equivalent to U? only when T is equivalent to U.
//       return (
//         target.constructor === OptionalType && this.baseType.isEquivalentTo(target.baseType)
//       )
//     },
//     isAssignableTo(target) {
//       // Optionals are INVARIANT in Carlos!
//       return this.isEquivalentTo(target)
//     },
//   })
  
  /**************************
   *  VALIDATION FUNCTIONS  *
   *************************/
  
  function check(condition, message, entity) {
    if (!condition) error(message, entity)
  }
  
  function checkType(e, types, expectation) {
    check(types.includes(e.type), `Expected ${expectation}`)
  }
  
  function checkNumeric(e) {
    checkType(e, [Type.INT, Type.FLOAT], "a number")
  }
  
  function checkNumericOrString(e) {
    checkType(e, [Type.INT, Type.FLOAT, Type.STRING], "a number or string")
  }
  
  function checkBoolean(e) {
    checkType(e, [Type.BOOLEAN], "a boolean")
  }
  
  function checkInteger(e) {
    checkType(e, [Type.INT], "an integer")
  }
  
  function checkIsAType(e) {
    check(e instanceof Type, "Type expected", e)
  }
  
  function checkIsAnOptional(e) {
    check(e.type.constructor === OptionalType, "Optional expected", e)
  }
  
  function checkArray(e) {
    check(e.type.constructor === ArrayType, "Array expected", e)
  }
  
  function checkHaveSameType(e1, e2) {
    check(e1.type.isEquivalentTo(e2.type), "Operands do not have the same type")
  }
  
  function checkAllHaveSameType(expressions) {
    check(
      expressions.slice(1).every(e => e.type.isEquivalentTo(expressions[0].type)),
      "Not all elements have the same type"
    )
  }
  
  function checkNotRecursive(struct) {
    check(
      !struct.fields.map(f => f.type).includes(struct),
      "Struct type must not be recursive"
    )
  }
  
  function checkAssignable(e, { toType: type }) {
    check(
      type === Type.ANY || e.type.isAssignableTo(type),
      `Cannot assign a ${e.type.typename} to a ${type.typename}`
    )
  }
  
  function checkNotReadOnly(e) {
    const readOnly = e instanceof Token ? e.value.readOnly : e.readOnly
    check(!readOnly, `Cannot assign to constant ${e?.lexeme ?? e.name}`, e)
  }
  
  function checkFieldsAllDistinct(fields) {
    check(
      new Set(fields.map(f => f.name.lexeme)).size === fields.length,
      "Fields must be distinct"
    )
  }
  
  function checkMemberDeclared(field, { in: struct }) {
    check(struct.type.fields.map(f => f.name.lexeme).includes(field), "No such field")
  }
  
  function checkInLoop(context) {
    check(context.inLoop, "Break can only appear in a loop")
  }
  
  function checkInFunction(context) {
    check(context.function, "Return can only appear in a function")
  }

  function checkReturnsCorrectType(context, returnValue) {
    console.log("context.function", context.function.type.returnType)
    console.log("return valkue = ", returnValue.type)
    check(context.function.type.returnType.isEquivalentTo(returnValue.type), "Return type does not match declared function type")
  }
  
  function checkCallable(e) {
    check(
      e.constructor === StructType || e.type.constructor == FunctionType,
      "Call of non-function or non-constructor"
    )
  }
  
  function checkReturnsNothing(f) {
    check(f.type.returnType === Type.VOID, "Something should be returned here")
  }
  
  function checkReturnsSomething(f) {
    check(f.type.returnType !== Type.VOID, "Cannot return a value here")
  }
  
  function checkReturnable({ expression: e, from: f }) {
    checkAssignable(e, { toType: f.type.returnType })
  }
  
  function checkArgumentsMatch(args, targetTypes) {
    check(
      targetTypes.length === args.length,
      `${targetTypes.length} argument(s) required but ${args.length} passed`
    )
    targetTypes.forEach((type, i) => checkAssignable(args[i], { toType: type }))
  }
  
  function checkFunctionCallArguments(args, calleeType) {
    checkArgumentsMatch(args, calleeType.paramTypes)
  }
  
  function checkConstructorArguments(args, structType) {
    const fieldTypes = structType.fields.map(f => f.type)
    checkArgumentsMatch(args, fieldTypes)
  }
  
  /***************************************
   *  ANALYSIS TAKES PLACE IN A CONTEXT  *
   **************************************/
  
  class Context {
    constructor({ parent = null, locals = new Map(), inLoop = false, function: f = null }) {
      Object.assign(this, { parent, locals, inLoop, function: f })
    }
    sees(name) {
      // Search "outward" through enclosing scopes
      return this.locals.has(name) || this.parent?.sees(name)
    }
    add(name, entity) {
      // TODO: Decide if we want to allow shadowing
      if (this.sees(name)) error(`Identifier ${name} already declared`)
      this.locals.set(name, entity)
    }
    lookup(name) {
      const entity = this.locals.get(name)
      if (entity) {
        return entity
      } else if (this.parent) {
        return this.parent.lookup(name)
      }
      error(`Identifier ${name} not declared`)
    }
    newChildContext(props) {
      return new Context({ ...this, parent: this, locals: new Map(), ...props })
    }
    analyze(node) {
      //  console.log("node = ", node)
      //console.log("old node = ", node)
      console.log("node name", node.constructor.name)
      let newNode = this[node.constructor.name](node)
     // console.log("new node = ", newNode)
      return newNode
    }
    Program(p) {
      this.analyze(p.statements)
    }
    VariableDeclaration(d) {
      this.analyze(d.initializer)
      //console.log(" in variable dec for ", d)
      //TODO: Decide if we want read only variables
      d.variable.value = new Variable(d.variable.lexeme)
    //  console.log("new variable value = ", d.variable.value)
      d.variable.value.type = d.initializer.type
      checkIsAType(d.variable.value.type)
      this.add(d.variable.lexeme, d.variable.value)
    }
    FunctionDeclaration(d) {
      this.analyze(d.type)

      d.value = new Function(
        d.id,
        d.params,
        d.type
      )
      checkIsAType(d.value.type)

      // When entering a function body, we must reset the inLoop setting,
      // because it is possible to declare a function inside a loop!
      const childContext = this.newChildContext({ inLoop: false, function: d.value })
      console.log(d.value.params)
      childContext.analyze(d.value.params)
      d.value.type = new FunctionType(
        d.value.params.map(p => p.type),
        d.value.type
      )
      // Add before analyzing the body to allow recursion
      this.add(d.id.lexeme, d.value)
      childContext.analyze(d.block)
    }
    FuncParam(p) {
      this.analyze(p.type)
      if (p.type instanceof Token) p.type = p.type.value
      checkIsAType(p.type)
      this.add(p.id.lexeme, p)
    }
    Type(t) {
      checkIsAType(t)
    }
    ArrayType(t) {
      this.analyze(t.elementType)
      if (t.elementType instanceof Token) t.elementType = t.elementType.value
    }
    OptionalType(t) {
      this.analyze(t.baseType)
      if (t.baseType instanceof Token) t.baseType = t.baseType.value
    }

    Assignment(s) {
      this.analyze(s.source)
      this.analyze(s.target)
      checkAssignable(s.source, { toType: s.target.type })
      checkNotReadOnly(s.target)
      return s
    }
    ReturnStatement(s) {
      checkInFunction(this)
      this.analyze(s.value)
      console.log("s.val = ", s.value)
      checkReturnsCorrectType(this, s.value)
      this.add({ expression: s.value, from: this.function })
    }
    PrintStatement(s) {
      this.analyze(s.argument)
    }
    If(s) {
      this.analyze(s.condition)
      checkBoolean(s.condition)
      this.newChildContext().analyze(s.block)
      if (s.elseifs.constructor === Array) {
        // It's a block of statements, make a new context
        this.newChildContext().analyze(s.elseifs)
      } else if (s.elseifs) {
        // It's a trailing if-statement, so same context
        this.newChildContext().analyze(s.elseStatement)
      }else if (s.elseStatement){
        this.analyze(s.elseStatement)
      }
    }
    ElseIf(s) {
      this.analyze(s.condition)
      checkBoolean(s.condition)
      this.newChildContext().analyze(s.block)
    }

    WhileStatement(s) {
      this.analyze(s.test)
      checkBoolean(s.test)
      this.newChildContext({ inLoop: true }).analyze(s.body)
    }
    Conditional(e) {
      this.analyze(e.test)
      checkBoolean(e.test)
      this.analyze(e.consequent)
      this.analyze(e.alternate)
      checkHaveSameType(e.consequent, e.alternate)
      e.type = e.consequent.type
    }
    BinaryExpression(e) {
      this.analyze(e.left)
      this.analyze(e.right)
      if (["&", "|", "^", "<<", ">>"].includes(e.op.lexeme)) {
        checkInteger(e.left)
        checkInteger(e.right)
        e.type = Type.INT
      } else if (["+"].includes(e.op.lexeme)) {
        checkNumericOrString(e.left)
        checkHaveSameType(e.left, e.right)
        e.type = e.left.type
      } else if (["-", "*", "/", "%", "**"].includes(e.op.lexeme)) {
        checkNumeric(e.left)
        checkHaveSameType(e.left, e.right)
        e.type = e.left.type
      } else if (["<", "<=", ">", ">="].includes(e.op.lexeme)) {
        checkNumericOrString(e.left)
        checkHaveSameType(e.left, e.right)
        e.type = Type.BOOLEAN
      } else if (["==", "!="].includes(e.op.lexeme)) {
        checkHaveSameType(e.left, e.right)
        e.type = Type.BOOLEAN
      } else if (["&&", "||"].includes(e.op.lexeme)) {
        checkBoolean(e.left)
        checkBoolean(e.right)
        e.type = Type.BOOLEAN
      } else if (["??"].includes(e.op.lexeme)) {
        checkIsAnOptional(e.left)
        checkAssignable(e.right, { toType: e.left.type.baseType })
        e.type = e.left.type
      }
    }
    UnaryExpression(e) {
      this.analyze(e.operand)
      if (e.op.lexeme === "#") {
        checkArray(e.operand)
        e.type = Type.INT
      } else if (e.op.lexeme === "-") {
        checkNumeric(e.operand)
        e.type = e.operand.type
      } else if (e.op.lexeme === "!") {
        checkBoolean(e.operand)
        e.type = Type.BOOLEAN
      } else {
        // Operator is "some"
        e.type = new OptionalType(e.operand.type?.value ?? e.operand.type)
      }
    }
    SubscriptExpression(e) {
      this.analyze(e.array)
      e.type = e.array.type.baseType
      this.analyze(e.index)
      checkInteger(e.index)
    }
    CringeArray(a) {
      this.analyze(a.values)
      checkAllHaveSameType(a.values)
      a.type = new ArrayType(a.values[0].type)
    }
    Call(c) {
      this.analyze(c.callee)
      const callee = c.callee?.value ?? c.callee
      checkCallable(callee)
      this.analyze(c.args)
      if (callee.constructor === StructType) {
        checkConstructorArguments(c.args, callee)
        c.type = callee
      } else {
        checkFunctionCallArguments(c.args, callee.type)
        c.type = callee.type.returnType
      }
    }
    Token(t) {
      // For ids being used, not defined
      if (t.category === "Id") {
        t.value = this.lookup(t.lexeme)
        t.type = t.value.type
      }
      if (t.category === "Int") [t.value, t.type] = [BigInt(t.lexeme), Type.INT]
      if (t.category === "Double") [t.value, t.type] = [Number(t.lexeme), Type.DOUBLE]
      if (t.category === "String") [t.value, t.type] = [t.lexeme, Type.STRING]
      if (t.category === "Bool") [t.value, t.type] = [t.lexeme === "true", Type.BOOLEAN]
    }
    Array(a) {
      a.forEach(item => this.analyze(item))
    }
  }
  
  export default function analyze(node) {
    const initialContext = new Context({})
    for (const [name, type] of Object.entries(stdlib.contents)) {
      initialContext.add(name, type)
    }
    initialContext.analyze(node)
    return node
  }