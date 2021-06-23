import format from './format.js'
import lang from './lang.js'
import assert from './assert.js'

const validate = lng => (schema, data, onError) => {
  const L = lang[lng] || lang.en

  const identity = X => X
  const P = schema.properties || {}

  var valid = true
  const R = Object.keys(P).reduce((R, p) => {
    const f = P[p].format || P[p].type
    const F = format[f] || format.string
    const parser = F.parser || identity
    const formatter = F.format || identity
    const loader = F.loader || identity
    R[p] = parser(data[p])
    Object.keys(assert).forEach(key => {
      if (
        key == 'required' &&
        (schema.required || []).indexOf(key) != -1 &&
        !assert.required(R[p])
      ) {
        onError && onError(p, L.required())
        valid = false
      } else if (
        P[p][key] !== undefined && R[p] != null &&
        !assert[key](P[p][key], R[p])
      ) {
        onError && onError(p, L[key](formatter(loader(P[p][key]), key)))
        valid = false
      }
    })
    return R
  }, {})

  return valid ? R : null
}

const v = validate()
const v_pt = validate('pt')

export {
  v as validate,
  v_pt as validate_pt
}
