import { getValue } from '../src/putils/object'

console.log(getValue(null, ''))
console.log(getValue({}, ''))
console.log(getValue({
	nuevo: {
		hola: '5'
	}
}, ''))
console.log(getValue({
	nuevo: {
		hola: '5'
	}
}, 'nuevo'))
console.log(getValue({
	nuevo: {
		hola: [[
			{ jojo: 'true' }
		]]
	}
}, 'nuevo.hola.jojo'))