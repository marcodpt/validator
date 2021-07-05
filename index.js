import format from './format.js'
import lang from './lang.js'
import assert from './assert.js'

const getF = P => format[P.format] || format[P.type] || format.string

const val = lng => (schema, data, onError) => {
  const L = lang[lng] || lang.en

  const identity = X => X
  const P = schema.properties || {}

  var valid = true
  const R = Object.keys(P).reduce((R, p) => {
    const F = getF(P[p])
    const parser = F.parser || identity
    const formatter = F.format || identity
    const loader = F.loader || identity
    R[p] = parser(data[p])
    Object.keys(assert).forEach(key => {
      if (
        key == 'required' &&
        (schema.required || []).indexOf(p) != -1 &&
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

const loader = (schema, data) => {
  data = data || {}
  const P = schema.properties || {}
  Object.keys(P).forEach(key => {
    const Q = P[key]
    const F = getF(Q)
    if (data[key] == null) {
      data[key] = Q.default != null ? Q.default : null
    }
    data[key] = data[key] != null && F.loader ?
      F.loader(data[key]) : data[key]
  })
  if (schema.additionalProperties === false) {
    Object.keys(data).forEach(key => {
      if (P[key] == null) {
        delete data[key]
      }
    })
  }
  return data
}

const validate = val()
const validate_pt = val('pt')

export {
  loader,
  validate,
  validate_pt
}
