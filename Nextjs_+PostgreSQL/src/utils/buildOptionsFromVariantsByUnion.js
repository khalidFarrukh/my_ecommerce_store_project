export function buildOptionsFromVariantsByUnion(variants) {
  const optionUnion = {}

  variants.forEach(variant => {
    Object.entries(variant.options).forEach(([key, value]) => {
      if (!optionUnion[key]) {
        optionUnion[key] = new Set()
      }
      optionUnion[key].add(value)
    })
  })

  // convert Sets → arrays
  Object.keys(optionUnion).forEach(key => {
    optionUnion[key] = Array.from(optionUnion[key])
  })

  return optionUnion
}
