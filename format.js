export default {
  string: {
    parser: value => value == null ? '' : typeof value == 'object' ?
      JSON.stringify(value, undefined, 2) : String(value)
  },
  integer: {
    parser: value => isNaN(value) ? null : parseInt(value),
    format: value => value.toLocaleString()
  },
  date: {
    loader: value => isNaN(value) ? value :
      !parseInt(value) ? '' :
        new Date(value * 1000).toISOString().substr(0, 10),
    parser: value => value ? parseInt(
      (new Date(value).getTime() / 1000).toFixed(0)
    ) : null,
    format: (value, type) => !value ? value : type == 'multipleOf' ?
      value.toLocaleString() :
      new Date(value).toLocaleDateString()
  },
  number: {
    parser: value => isNaN(value) ? null : parseFloat(value),
    format: value => value.toLocaleString()
  },
  array: {
    parser: value => value instanceof Array ? value : null,
    format: value => JSON.stringify(value, undefined, 2)
  }
}
