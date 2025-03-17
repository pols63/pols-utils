import { PRecord } from "./constants"
import { getValue } from "./object"

export const swapItems = (array: unknown[], oldIndex: number, newIndex: number) => {
	if (oldIndex < 0 || oldIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(oldIndex) != oldIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (newIndex < 0 || newIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(newIndex) != newIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (oldIndex == newIndex) throw new Error(`'oldIndex' y 'newIndex' no deben tener el mismo valor`)

	const el1 = array[oldIndex]
	const el2 = array[newIndex]
	array.splice(newIndex, 1, el1)
	if (el2) {
		array.splice(oldIndex, 1, el2)
	} else {
		array.splice(oldIndex, 1)
	}
}

export const moveItem = (array: unknown[], oldIndex: number, newIndex: number) => {
	if (oldIndex < 0 || oldIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(oldIndex) != oldIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (newIndex < 0 || newIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(newIndex) != newIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (oldIndex == newIndex) throw new Error(`'oldIndex' y 'newIndex' no deben tener el mismo valor`)

	const el1 = array[oldIndex]
	array.splice(oldIndex, 1)
	array.splice(newIndex, 0, el1)
}

export type PIterationFunction<T> = (element: T, index: number) => boolean

export const queryOne = <T>(array: T[], query: (Partial<T> & Record<string, unknown>) | PIterationFunction<T>, resultReturn?: (element: T | null, i: number) => T) => {
	let result: T | null = null
	let index: number = -1
	for (const [i, element] of array.entries()) {
		let success = true
		if (typeof query == 'object') {
			if (typeof element != 'object') continue
			for (const p in query) {
				const valueOfElement = getValue((element as unknown) as PRecord, p)
				const queryProperty = query[p]
				if (queryProperty == null && valueOfElement == null) continue
				if (queryProperty instanceof RegExp && typeof valueOfElement == 'string' && valueOfElement.match(queryProperty)) continue
				if (valueOfElement !== queryProperty) {
					success = false
					break
				}
			}
		} else {
			success = !!query(element, i)
		}
		if (success) {
			result = element
			index = i
			break
		}
	}
	if (resultReturn) {
		return resultReturn(result, index)
	} else {
		return result
	}
}

export const query = <T>(array: T[], query: Partial<T> | PIterationFunction<T>) => {
	const results: T[] = []
	for (const [i, element] of array.entries()) {
		let success = true
		if (typeof query == 'object') {
			if (typeof element != 'object') continue
			for (const p in query) {
				const valueOfElement = getValue((element as unknown) as PRecord, p)
				const queryProperty = query[p]
				if (queryProperty == null && valueOfElement == null) continue
				if (queryProperty instanceof RegExp && typeof valueOfElement == 'string' && valueOfElement.match(queryProperty)) continue
				if (valueOfElement !== query[p]) {
					success = false
					break
				}
			}
		} else {
			success = !!query(element, i)
		}
		if (success) results.push(element)
	}
	return results
}

export const extractOne = <T>(array: T[], query: Partial<T> | PIterationFunction<T>) => {
	if (array == null) return null
	for (const [i, element] of array.entries()) {
		let success = true
		if (typeof query == 'object') {
			if (typeof element != 'object') continue
			for (const p in query) {
				if (getValue((element as unknown) as PRecord, p) !== query[p]) {
					success = false
					break
				}
			}
		} else {
			success = !!query(element, i)
		}
		if (success) return array.splice(i, 1)[0]
	}
	return null
}

export const extract = <T>(array: T[], query: Partial<T> | PIterationFunction<T>) => {
	let i = 0
	const results: T[] = []
	while (i < array.length) {
		const element = array[i]
		let success = true
		if (typeof query == 'object') {
			if (typeof element != 'object') continue
			for (const p in query) {
				if (getValue((element as unknown) as PRecord, p) !== query[p]) {
					success = false
					break
				}
			}
		} else {
			success = !!query(element, i)
		}
		if (success) {
			results.push(array.splice(i, 1)[0])
		} else {
			i++
		}
	}
	return results
}

export const groupBy = <T = never, K = never>(array: K[], setterPropertyName: (element: K, index?: number) => string | number | symbol, transform?: (element: K) => T) => {
	const results: PRecord<([T] extends [never] ? K : T)[]> = {}
	for (const [i, element] of array.entries()) {
		const propertyName = setterPropertyName(element, i)
		let reference = results[propertyName]
		if (!reference) {
			reference = []
			results[propertyName] = reference
		}
		reference.push((transform ? transform(element) : element) as any)
	}
	return results
}

export const toggleElement = <T>(array: T[], element: T, check: (element: T, index?: number) => boolean) => {
	let index: number | null = null
	/* Busca el elemento en el arreglo y captura su índice */
	for (const [i, currentElement] of array.entries()) {
		if (check(currentElement, i)) {
			index = i
			break
		}
	}

	if (index != null) {
		array.splice(index, 1)
	} else {
		array.push(element)
	}
}

export const chunks = <T>(array: T[], length: number): T[][] => {
	const chunks: T[][] = []
	const currentLength = array.length
	let i = 0
	while (i < currentLength) {
		chunks.push(array.slice(i, i += length))
	}
	return chunks
}

export const index = <T, K = never>(array: T[], setterPropertyName: (element: T, index?: number) => string | number | symbol, formatElement?: (element: T, index?: number) => K) => {
	const result: PRecord<[K] extends [never] ? T : K> = {}
	for (const [i, element] of array?.entries() ?? []) {
		result[setterPropertyName(element, i)] = (formatElement?.(element, i) ?? element) as any
	}
	return result
}

export const distinct = <T>(array: T[]) => Array.from(new Set(array))