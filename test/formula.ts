import { sizeRepresentation } from '../src/putils/number'

// console.log(formula('1 + 2.2 + $uno + $dos', {
// 	uno: '5',
// 	dos: '$tres',
// 	tres: '$cuatro + $uno',
// 	cuatro: '$dos'
// }))

// console.log(format(123456))
// console.log(format(0))
// console.log(format(-98765))

// console.log(format(10e60, { decimals: 30, significativeNumber: false }))

console.log(sizeRepresentation(2300)) // 2.3K
console.log(sizeRepresentation(2300456)) // 2.3M