import { PUtils } from '../src/index'

console.log(PUtils.JSON.stringify(PUtils.JSON.clone({
	a: [{
		b: 3
	}, {
		c: 4
	}]
})))