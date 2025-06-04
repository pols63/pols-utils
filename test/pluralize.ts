import { format, pluralize } from "../src/putils/number"

console.log(pluralize(1250, 'artículo', '? artículos', (v) => format(v)))
console.log(pluralize(1, 'Un artículo', '? artículos'))