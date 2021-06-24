export default {
  required: value => value != null,
  minimum: (fixed, value) => typeof value != 'number' || value >= fixed,
  maximum: (fixed, value) => typeof value != 'number' || value <= fixed,
  multipleOf: (fixed, value) =>
    typeof value != 'number' ||
    Math.abs(value - fixed * Math.round(value / fixed)) / fixed <= 0.000001,
  minLength: (fixed, value) =>
    typeof value != 'string' ||
    value.length >= fixed,
  maxLength: (fixed, value) => 
    typeof value != 'string' ||
    value.length <= fixed,
  pattern: (fixed, value) =>
    typeof value != 'string' ||
    new RegExp(fixed).test(value),
  enum: (fixed, value) => fixed.indexOf(value) != -1
}
