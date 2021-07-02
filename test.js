import {loader, validate, validate_pt} from './index.js'

const str = X => JSON.stringify(X, undefined, 2)
const genSchema = S => ({
  type: 'object',
  properties: {
    x: S
  }
})
const setErrors = E => (key, message) => {
  E[key] = (E[key] || []).concat(message)
  return E
}
const check = assert => (S, raw) => (Input, Result, Err, pt) => {
  const E = {}
  assert.equal(
    str((pt ? validate_pt : validate)(
      raw ? S : genSchema(S), raw ? Input : {x: Input}, setErrors(E)
    )), Err ? 'null' : raw ? str(Result) : str({x: Result})
  )
  assert.equal(str(E), str(Err ? raw ? Err : {x: [Err]} : {}))
}

QUnit.test("string", assert => {
  const x = check(assert)
  var c = x({
    type: 'string'
  })
  c(undefined, '')
  c(null, '')
  c({}, '{}')
  c([], '[]')
  c(true, 'true')
  c(false, 'false')
  c(0, '0')
  c(0.00, '0')
  c(+5, '5')
  c(-5, '-5')
  c(3.14, '3.14')
  c(-2.7, '-2.7')
  c('', '')
  c('14.54f', '14.54f')
  c('14.54 f', '14.54 f')
  c('dog', 'dog')
})

QUnit.test("integer", assert => {
  const x = check(assert)
  var c = x({
    type: 'integer'
  })
  c(undefined, null)
  c(null, null)
  c({}, null)
  c([], null)
  c(true, null)
  c(false, null)
  c(0, 0)
  c(0.00, 0)
  c(+5, 5)
  c(-5, -5)
  c(3.14, 3)
  c(-2.7, -2)
  c('', null)
  c('14.54f', null)
  c('14.54 f', null)
  c('dog', null)
})

QUnit.test("number", assert => {
  const x = check(assert)
  var c = x({
    type: 'number'
  })
  c(undefined, null)
  c(null, null)
  c({}, null)
  c([], null)
  c(true, null)
  c(false, null)
  c(0, 0)
  c(0.00, 0)
  c(+5, 5)
  c(-5, -5)
  c(3.14, 3.14)
  c(-2.7, -2.7)
  c('', null)
  c('14.54f', null)
  c('14.54 f', null)
  c('dog', null)
})

QUnit.test("required", assert => {
  const x = check(assert)
  var c = x({
    properties: {
      foo: {
        type: "number"
      },
      bar: {
        type: "string"
      }
    },
    required: ['foo']
  }, true)
  c({foo: 1}, {foo: 1, bar: ''})
  c({bar: "test"}, '', {foo: ['Is required!']})
  c({bar: "test"}, '', {foo: ['É obrigatório!']}, true)
  c({foo: "x"}, '', {foo: ['Is required!']})
  c({foo: "x"}, '', {foo: ['É obrigatório!']}, true)
  c({foo: "3.14", baz: 3, qux: "xxx"}, {foo: 3.14, bar: ''})

  var c = x({
    properties: {
      foo: {
        type: "number"
      },
      bar: {
        type: "string"
      }
    },
    required: ['bar']
  }, true)
  c({foo: 1}, {foo: 1, bar: ''})
  c({bar: "test"}, {foo: null, bar: "test"})
  c({foo: "x"}, {foo: null, bar: ''})
  c({foo: "3.14", baz: 3, qux: "xxx"}, {foo: 3.14, bar: ''})

  var c = x({
    properties: {
      foo: {
        type: "number"
      },
      bar: {
        type: "string"
      }
    },
    required: ['foo', 'bar']
  }, true)
  c({foo: 1}, {foo: 1, bar: ''})
  c({bar: "test"}, '', {foo: ['Is required!']})
  c({bar: "test"}, '', {foo: ['É obrigatório!']}, true)
  c({foo: "x"}, '', {foo: ['Is required!']})
  c({foo: "x"}, '', {foo: ['É obrigatório!']}, true)
  c({foo: "3.14", baz: 3, qux: "xxx"}, {foo: 3.14, bar: ''})
})

QUnit.test("minimum", assert => {
  const x = check(assert)
  var c = x({
    type: 'integer',
    minimum: 1.1
  })
  const v = (1.1).toLocaleString()
  c(2.6, 2)
  c('1.1', '', 'Must be at least: '+v)
  c(1.1, '', 'Deve ser no mínimo: '+v, true)
  c(0.6, '', 'Must be at least: '+v)
  c('0.6', '', 'Deve ser no mínimo: '+v, true)
  c('x', null)

  var c = x({
    type: 'string',
    minimum: 1.1
  })
  c(2.6, '2.6')
  c('1.1', '1.1')
  c(1.1, '1.1')
  c(0.6, '0.6')
  c('0.6', '0.6')
  c('x', 'x')

  var c = x({
    type: 'number',
    minimum: 1.1
  })
  c(2.6, 2.6)
  c(1.1, 1.1)
  c('1.1', 1.1)
  c('0.6', '', 'Must be at least: '+v)
  c(0.6, '', 'Deve ser no mínimo: '+v, true)
  c('x', null)

  var c = x({
    type: 'integer',
    minimum: -2
  })
  c('-1', -1)
  c(0, 0)
  c('-2', -2)
  c(-2.0, -2)
  c('-2.0001', -2)
  c(-2.0001, -2)
  c(-3, '', 'Must be at least: -2')
  c('-3', '', 'Deve ser no mínimo: -2', true)
  c('x', null)


  var c = x({
    type: 'number',
    minimum: -2
  })
  c(-1, -1)
  c('0', 0)
  c(-2, -2)
  c('-2.0', -2)
  c(-2.0001, '', 'Must be at least: -2')
  c('-2.0001', '', 'Deve ser no mínimo: -2', true)
  c('-3', '', 'Must be at least: -2')
  c(-3, '', 'Deve ser no mínimo: -2', true)
  c('x', null)
})

QUnit.test("maximum", assert => {
  const x = check(assert)
  var c = x({
    type: "integer",
    maximum: 3.0
  })
  c("2.6", 2)
  c(3.0, 3)
  c("3.5", 3)
  c(4.1, '', 'Must be at most: 3')
  c("4.1", '', 'Deve ser no máximo: 3', true)
  c("x", null)

  var c = x({
    type: "string",
    maximum: 3.0
  })
  c("2.6", '2.6')
  c(3.0, '3')
  c("3.5", '3.5')
  c(4.1, '4.1')
  c("4.1", '4.1')
  c("x", 'x')

  var c = x({
    type: 'number',
    maximum: 3.0
  })
  c(2.6, 2.6)
  c("3.0", 3.0)
  c("3.5", '', 'Must be at most: 3')
  c(3.5, '', 'Deve ser no máximo: 3', true)
  c(4.1, '', 'Must be at most: 3')
  c("4.1", '', 'Deve ser no máximo: 3', true)
  c("x", null)

  var c = x({
    type: 'integer',
    maximum: 300
  })
  c(299.97, 299)
  c("300", 300)
  c(300.00, 300)
  c(300.5, 300)

  var c = x({
    type: 'number',
    maximum: 300
  })
  c("299.97", 299.97)
  c(300, 300)
  c("300.00", 300)
  c(300.5, '', 'Must be at most: 300')
  c(300.5, '', 'Deve ser no máximo: 300', true)
})

QUnit.test("multipleOf", assert => {
  const x = check(assert)
  var c = x({
    type: 'integer',
    multipleOf: 2
  })
  c(10, 10)
  c('7', '', 'Must be multiple of: 2')
  c(7, '', 'Deve ser múltiplo de: 2', true)
  c(-3, '', 'Must be multiple of: 2')
  c('-3', '', 'Deve ser múltiplo de: 2', true)
  c(-4, -4)
  c('foo', null)

  var c = x({
    type: 'string',
    multipleOf: 2
  })
  c(10, '10')
  c('7', '7')
  c(7, '7')
  c(-3, '-3')
  c('-3', '-3')
  c(-4, '-4')
  c('foo', 'foo')

  var c = x({
    type: 'integer',
    multipleOf: 1.5
  })
  var v = (1.5).toLocaleString()
  c(0, 0)
  c('4.5', '', 'Must be multiple of: '+v)
  c(4.5, '', 'Deve ser múltiplo de: '+v, true)
  c(35, '', 'Must be multiple of: '+v)
  c('35', '', 'Deve ser múltiplo de: '+v, true)

  var c = x({
    type: 'number',
    multipleOf: 1.5
  })
  c(0, 0)
  c('4.5', 4.5)
  c(4.5, 4.5)
  c(35, '', 'Must be multiple of: '+v)
  c('35', '', 'Deve ser múltiplo de: '+v, true)

  var c = x({
    type: 'number',
    multipleOf: 0.0001
  })
  var v = (0.0001).toLocaleString()
  c(0.0075, 0.0075)
  c('0.00751', '', 'Must be multiple of: '+v)
  c(0.00751, '', 'Deve ser múltiplo de: '+v, true)

  var c = x({
    type: 'number',
    multipleOf: 0.123456789
  })
  var v = (0.123456789).toLocaleString()
  c(1e308, '', 'Must be multiple of: '+v)
  c('1e308', '', 'Deve ser múltiplo de: '+v, true)
})

QUnit.test("minLength", assert => {
  const x = check(assert)

  var c = x({
    type: "string",
    minLength: 2
  })
  c('foo', 'foo')
  c('fo', 'fo')
  c('f', '', 'Must have at least 2 characters')
  c('f', '', 'Deve ter no mínimo 2 caracteres', true)
  c('', '', 'Must have at least 2 characters')
  c('', '', 'Deve ter no mínimo 2 caracteres', true)
  c(1, '', 'Must have at least 2 characters')
  c(1, '', 'Deve ter no mínimo 2 caracteres', true)
  c(12, '12')
  c(12, '12')

  var c = x({
    type: "number",
    minLength: 2
  })
  c('foo', null)
  c('fo', null)
  c('f', null)
  c('', null)
  c(1, 1)
  c(12, 12)

  var c = x({
    type: "string",
    minLength: 1
  })
  c('foo', 'foo')
  c('fo', 'fo')
  c('f', 'f')
  c('', '', 'Must have at least 1 character')
  c('', '', 'Deve ter no mínimo 1 caractere', true)
  c(1, '1')
  c(12, '12')

  var c = x({
    type: "integer",
    minLength: 1
  })
  c('foo', null)
  c('fo', null)
  c('f', null)
  c('', null)
  c(1, 1)
  c(12, 12)
})

QUnit.test("maxLength", assert => {
  const x = check(assert)

  var c = x({
    type: "string",
    maxLength: 2
  })
  c('f', 'f')
  c('fo', 'fo')
  c('foo', '', 'Must have at most 2 characters')
  c('foo', '', 'Deve ter no máximo 2 caracteres', true)
  c('', '')
  c(1, '1')
  c(122, '', 'Must have at most 2 characters')
  c(122, '', 'Deve ter no máximo 2 caracteres', true)

  var c = x({
    type: "integer",
    maxLength: 2
  })
  c('f', null)
  c('fo', null)
  c('foo', null)
  c('', null)
  c(1, 1)
  c(122, 122)

  var c = x({
    type: "string",
    maxLength: 1
  })
  c('foo', 'foo', 'Must have at most 1 character')
  c('foo', 'foo', 'Deve ter no máximo 1 caractere', true)
  c('fo', 'fo', 'Must have at most 1 character')
  c('fo', 'fo', 'Deve ter no máximo 1 caractere', true)
  c('f', 'f')
  c('', '')
  c(1, '1')
  c(12, '', 'Must have at most 1 character')
  c(12, '', 'Deve ter no máximo 1 caractere', true)

  var c = x({
    type: "number",
    maxength: 1
  })
  c('foo', null)
  c('fo', null)
  c('f', null)
  c('', null)
  c(1, 1)
  c(12, 12)
})

QUnit.test("pattern", assert => {
  const x = check(assert)

  var c = x({
    type: 'string',
    pattern: '^a*$'
  })
  c('aaa', 'aaa')
  c('', '')
  c('abc', '', 'Must be of specified type!')
  c('abc', '', 'Deve ser do tipo especificado!', true)
  c(1, '', 'Must be of specified type!')
  c('1', '', 'Deve ser do tipo especificado!', true)

  var c = x({
    type: 'integer',
    pattern: '^a*$'
  })
  c('aaa', null)
  c('', null)
  c('abc', null)
  c(1, 1)

  var c = x({
    type: 'string',
    pattern: '1+'
  })
  c('', '', 'Must be of specified type!')
  c('', '', 'Deve ser do tipo especificado!', true)
  c('xx11yy', 'xx11yy')
  c(3.14, '3.14')

  var c = x({
    type: 'number',
    pattern: '1+'
  })
  c('', null)
  c('xx11yy', null)
  c(3.14, 3.14)
})

QUnit.test("date", assert => {
  const x = check(assert)
  const c = x({
    type: 'integer',
    format: 'date',
    minimum: 1619454783,
    maximum: 1623610905
  })
  const a = new Date('2021-04-26T10:00:00.000Z').toLocaleDateString()
  const b = new Date('2021-06-13T10:00:00.000Z').toLocaleDateString()
  c(0, null)
  c('', null)
  c('2021-04-08', '', 'Must be at least: '+a)
  c('2021-06-17', '', 'Must be at most: '+b)
  c('2021-06-01', 1622505600)
  c('2021-06-02', 1622592000)
})

QUnit.test("enum", assert => {
  const x = check(assert)
  var c = x({
    type: 'integer',
    enum: [2, 3, 5, 7, '11', 'dog']
  })
  c('2', 2)
  c(7.9, 7)
  c(3.1, 3)
  c(+5, 5)
  c('11', '', 'It must be one of the possible options!')
  c(11, '', 'Deve ser uma das opções possíveis!', true)
  c('dog', null)

  var c = x({
    type: 'number',
    enum: [2, 3, 5, 7, '11', 'dog']
  })
  c('2', 2)
  c(7.9, '', 'It must be one of the possible options!')
  c('7.9', '', 'Deve ser uma das opções possíveis!', true)
  c('3.1', 3, 'It must be one of the possible options!')
  c(3.1, 3, 'Deve ser uma das opções possíveis!', true)
  c(+5, 5)
  c(11, '', 'It must be one of the possible options!')
  c('11', '', 'Deve ser uma das opções possíveis!', true)
  c('dog', null)

  var c = x({
    type: 'string',
    enum: [2, 3, 5, 7, '11', 'dog']
  })
  c('2', '', 'It must be one of the possible options!')
  c(2, '', 'Deve ser uma das opções possíveis!', true)
  c(7.9, '', 'It must be one of the possible options!')
  c('7.9', '', 'Deve ser uma das opções possíveis!', true)
  c('3.1', '', 'It must be one of the possible options!')
  c(3.1, '', 'Deve ser uma das opções possíveis!', true)
  c(+5, '', 'It must be one of the possible options!')
  c('+5', '', 'Deve ser uma das opções possíveis!', true)
  c(11, '11')
  c('dog', 'dog')
})

QUnit.test("mix", assert => {
  const x = check(assert)
  var c = x({
    properties: {
      foo: {
        type: "integer",
        minLength: 3,
        maxLength: 10,
        pattern: 'a+',
        minimum: 7,
        maximum: 19,
        multipleOf: 1.5
      },
      bar: {
        type: "number",
        minLength: 3,
        maxLength: 10,
        pattern: 'a+',
        minimum: 7,
        maximum: 19,
        multipleOf: 1.5
      },
      baz: {
        type: "string",
        minLength: 3,
        maxLength: 10,
        pattern: 'a+',
        minimum: 7,
        maximum: 19,
        multipleOf: 1.5
      }
    },
    required: ['foo', 'bar', 'baz']
  }, true)
  const v = (1.5).toLocaleString()

  c({
    foo: 2,
    baz: 'bb'
  }, '', {
    foo: [
      'Must be at least: 7',
      'Must be multiple of: '+v
    ],
    bar: ['Is required!'],
    baz: [
      'Must have at least 3 characters',
      'Must be of specified type!'
    ]
  })
  c({
    foo: 2,
    baz: 'bb'
  }, '', {
    foo: [
      'Deve ser no mínimo: 7',
      'Deve ser múltiplo de: '+v
    ],
    bar: ['É obrigatório!'],
    baz: [
      'Deve ter no mínimo 3 caracteres',
      'Deve ser do tipo especificado!'
    ]
  }, true)
  c({
    foo: 13.5,
    bar: 44.5,
    baz: 'bbccccarrrrr'
  }, '', {
    foo: [
      'Must be multiple of: '+v
    ],
    bar: [
      'Must be at most: 19',
      'Must be multiple of: '+v
    ],
    baz: [
      'Must have at most 10 characters',
    ]
  })
  c({
    foo: 13.5,
    bar: 44.5,
    baz: 'bbccccarrrrr'
  }, '', {
    foo: [
      'Deve ser múltiplo de: '+v
    ],
    bar: [
      'Deve ser no máximo: 19',
      'Deve ser múltiplo de: '+v
    ],
    baz: [
      'Deve ter no máximo 10 caracteres'
    ]
  }, true)
  c({
    foo: 15,
    bar: 13.5,
    baz: 'cccarr',
    qux: 'xxx'
  }, {
    foo: 15,
    bar: 13.5,
    baz: 'cccarr'
  })
})

QUnit.test("loader", assert => {
  const P = {
    int: {
      type: "integer"
    },
    num: {
      type: "number",
      default: 3.14
    },
    str: {
      type: "string",
      default: "John"
    },
    dat: {
      type: "integer",
      format: "date",
      default: 1622592000
    }
  }

  assert.equal(str(loader({
    properties: P
  })), str({
    int: null,
    num: 3.14,
    str: "John",
    dat: '2021-06-02T00:00:00.000Z'
  }))

  assert.equal(str(loader({
    properties: P
  }, {
    x: "X",
    int: 7,
    dat: 1622505600
  })), str({
    x: "X",
    int: 7,
    dat: '2021-06-01T00:00:00.000Z',
    num: 3.14,
    str: "John"
  }))

  assert.equal(str(loader({
    properties: P,
    additionalProperties: false
  }, {
    x: "X",
    int: 7,
    dat: 1622505600
  })), str({
    int: 7,
    dat: '2021-06-01T00:00:00.000Z',
    num: 3.14,
    str: "John"
  }))

  assert.equal(str(loader({
    properties: P,
    additionalProperties: false
  }, {
    x: "X",
    int: "15",
    num: "17.5",
    str: "Hello",
    dat: 1622505600
  })), str({
    int: "15",
    num: "17.5",
    str: "Hello",
    dat: '2021-06-01T00:00:00.000Z'
  }))

  assert.equal(str(loader({
    properties: P,
    additionalProperties: true
  }, {
    x: "X",
    int: "15",
    num: "17.5",
    str: "Hello",
    dat: 1622505600
  })), str({
    x: "X",
    int: "15",
    num: "17.5",
    str: "Hello",
    dat: '2021-06-01T00:00:00.000Z'
  }))
})
