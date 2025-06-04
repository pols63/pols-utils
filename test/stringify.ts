import { stringify } from '../src/putils/object'

console.log(stringify({
	uno: 'uno',
	otro: new Date
}, function(key, value) {
	return value
}))