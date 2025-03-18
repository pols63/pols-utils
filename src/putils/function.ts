export const throttle = (func: (...args: unknown[]) => void, delay: number) => {
	let idTimeout: ReturnType<typeof setTimeout> | null
	return function (...args: unknown[]) {
		if (!idTimeout) {
			idTimeout = setTimeout(() => idTimeout = null, delay)
		} else {
			return
		}
		return func(...args)
	}
}

export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
	let idTimeout: ReturnType<typeof setTimeout> | null
	return function (...args: unknown[]) {
		if (idTimeout) clearTimeout(idTimeout)
		idTimeout = setTimeout(() => func(...args), delay)
	}
}