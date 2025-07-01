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
			{ jojo: null }
		]]
	}
}, 'nuevo.hola.jojo.ert'))
console.log(getValue({
	nuevo: {
		hola: [[
			{ jojo: [{
				ert: [1,2,3]
			}] }
		]]
	}
}, 'nuevo.hola.jojo.ert'))