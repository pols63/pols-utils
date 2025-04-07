/**
 * Create a function, that executes another function given as a parameter, to avoids being called more than once within a given time. 
 * @param func Function to call.
 * @param preventTime Time of prevent.
 * @returns A function that executes `func`.
 * @example
 * ```javascript
 * let count = 1
 * const myfunc = () => {
 *     console.log('Call ' + count)
 *     count++
 * }
 * const myfuncThrottle = PUtilsFunction.throttle(myfunc, 1000)
 * 
 * myfuncThrottle() // Execute myfunc: 'Call 1'
 * myfuncThrottle() // Not execute myfunc until the preventTime has expired.
 * ```
 */
export const throttle = (func: (...args: any[]) => any, preventTime: number) => {
	let idTimeout: ReturnType<typeof setTimeout> | null
	return function (...args: unknown[]) {
		if (!idTimeout) {
			idTimeout = setTimeout(() => idTimeout = null, preventTime)
		} else {
			return
		}
		return func(...args)
	}
}

/**
 * Create a function that executes another function given as a parameter after a delayed time. If that function is called before the delay time has expired, the previous call is canceled.
 * @param func Function to call.
 * @param delay Delay time.
 * @returns A function that executes `func` after the delay time has expired.
 * @example
 * ```javascript
 * let count = 1
 * const myfunc = () => {
 *     console.log('Call ' + count)
 *     count++
 * }
 * const myfuncDebounce = PUtilsFunction.debounce(myfunc, 1000)
 * 
 * myfuncDebounce() // Execute myfunc after 1 second: 'Call 1'
 * 
 * \/* Another context *\/
 * myfuncDebounce() // Called one
 * myfuncDebounce() // It cancel the called one and after 1 seconde: 'Call 2'
 * ```
 */
export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
	let idTimeout: ReturnType<typeof setTimeout> | null
	return function (...args: unknown[]) {
		if (idTimeout) clearTimeout(idTimeout)
		idTimeout = setTimeout(() => func(...args), delay)
	}
}