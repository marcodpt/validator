export default {
  string: {
    parser: value => value == null ? '' : String(value)
  },
  integer: {
    parser: value => isNaN(value) ? null : parseInt(value),
    format: value => value.toLocaleString()
  },
  date: {
    loader: value => new Date(value * 1000).toISOString(),
    parser: value => value ? parseInt(
      (new Date(value).getTime() / 1000).toFixed(0)
    ) : null,
    format: (value, type) => type == 'multipleOf' ?
      value.toLocaleString() :
      value.toLocaleDateString()
  },
  number: {
    parser: value => isNaN(value) ? null : parseFloat(value),
    format: value => value.toLocaleString()
  }
}
