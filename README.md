# validator
> An es6 module javascript object validator focused on error handling

This module is a subset of json schema, focused on objects for form validation!

It has support for multiple languages! And great error feedback!

## Usage
```js
import {validate} from 'https://cdn.jsdelivr.net/gh/marcodpt/validator/index.js'

const schema = {
  type: "object",
  properties: {
    foo: {
      type: "integer",
      minimum: 7,
      maximum: 19,
      multipleOf: 1.5
    },
    bar: {
      type: "number",
      minimum: 7,
      maximum: 19,
      multipleOf: 1.5
    },
    baz: {
      type: "string",
      minLength: 3,
      maxLength: 10,
      pattern: 'a+'
    }
  },
  required: ['foo', 'bar', 'baz'],
  additionalProperties: false
}

var res = validate(schema, {
  foo: '15',
  bar: 13.5,
  baz: 'cccarr',
  qux: 'xxx'
})
console.log(res)
/*
   {
     foo: 15,
     bar: 13.5,
     baz: 'cccarr'
   }
*/

const onError = (key, msg) => console.log(`${key} ${msg}`)
var res = validate(schema, {
  foo: 2,
  baz: 'bb'
}, onError)
/*
  foo Must be at least: 7
  foo Must be multiple of: 1.5
  bar Is required!
  baz Must have at least 3 characters
  baz Must be of specified type!
*/

console.log(res)
//null
```

## API

The current available translations are:
 - `validate`: english
 - `validate_pt`: portuguese (português)

### validate (schema, data, onError)
 - object `schema`: A json schema of the data, it must be an object because
the current implementation only support objects.
 - object `data`: Your data model
 - function `onError` (key, message): Every error will be called
   - string `key`: The property that heappens the error
   - string `message`: The error message
 - returns:
   - object: In case validation pass with modified `data` that passed validation 
   - null: In case that the `data` do not pass validation

### loader (schema, data)
 - object `schema`: A json schema of the data, it must be an object because
the current implementation only support objects.
 - object `data`: Your data model
 - returns:
   An object to be used on your inputs with loaded data based on `format` info

## Tests
Check if work in your [broser](https://marcodpt.github.io/validator/)

## Contributing
This project was done very quickly with minimal compatibility with json-schema
just for my personal needs!

By no means this project is complete!

I will accept any contributions that:
 - get closer to json-schema spec
 - fix a bug
 - improve tests
 - add translations
 - improve the API

