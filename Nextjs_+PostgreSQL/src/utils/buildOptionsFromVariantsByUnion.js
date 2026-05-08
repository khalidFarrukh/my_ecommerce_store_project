// export function buildOptionsFromVariantsByUnion(variants) {
//   const optionUnion = {}

//   variants.forEach(variant => {
//     Object.entries(variant.options).forEach(([key, value]) => {
//       if (!optionUnion[key]) {
//         optionUnion[key] = new Set()
//       }
//       optionUnion[key].add(value)
//     })
//   })

//   // convert Sets → arrays
//   Object.keys(optionUnion).forEach(key => {
//     optionUnion[key] = Array.from(optionUnion[key])
//   })

//   return optionUnion
// }

export function buildOptionsFromVariantsByUnion(variants = []) {
  const optionUnion = new Map()

  for (const variant of variants) {
    for (const { name, value } of variant.options || []) {
      if (!optionUnion.has(name)) {
        optionUnion.set(name, new Set())
      }
      optionUnion.get(name).add(value)
    }
  }

  const result = {}

  for (const [key, set] of optionUnion.entries()) {
    result[key] = Array.from(set)
  }

  return result
}