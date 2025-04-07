/**
 * Creates a throttled version of a function that ensures it is not called more than once within the specified time interval.
 * @param func The function to throttle.
 * @param preventTime The time interval, in millisecond, during which subsequent calls are ignored.
 * @returns A throttled function that invokes `func` at most once per `preventTime` interval.
 * @example
 * ```javascript
 * let count = 1
 * const myfunc = () => {
 *     console.log('Call ' + count)
 *     count++
 * }
 * const myfuncThrottle = PUtilsFunction.throttle(myfunc, 1000)
 * 
 * myfuncThrottle() // Executes: 'Call 1'
 * myfuncThrottle() // Ignored: called to soon.
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
 * Creates a debounced version of the given function. The returned function delays the execution of `func` until after a specified delay time has passed since the last time it was called. If the returned function is called again before the delay has expired, the previous call is
 * canceled and the timer resets.
 * @param func The function to debounce.
 * @param delay The delay time in milliseconds.
 * @returns A debounced version of `func` that executes only after the delay time has passed without further calls.
 * @example
 * ```javascript
 * let count = 1
 * const myfunc = () => {
 *     console.log('Call ' + count)
 *     count++
 * }
 * const myfuncDebounce = PUtilsFunction.debounce(myfunc, 1000)
 * 
 * // First context
 * myfuncDebounce() // Execute myfunc after 1 second: 'Call 1'
 * 
 * // Another context
 * myfuncDebounce() // Call 1 (canceled)
 * myfuncDebounce() // Reset time. It cancel the called one and after 1 seconde: 'Call 2'
 * ```
 */
export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
	let idTimeout: ReturnType<typeof setTimeout> | null
	return function (...args: unknown[]) {
		if (idTimeout) clearTimeout(idTimeout)
		idTimeout = setTimeout(() => func(...args), delay)
	}
}