import { PRecord } from "../constants"
import { getValue } from "./object"

/**
 * Exchange the position of two elements. 
 * @param array Target array.
 * @param originIndex First element index.
 * @param destinationIndex Second element index.
 * @returns Target array.
 * @example
 * ```javascript
 * const myarray = [0, 1, 2, 3, 4]
 * PUtilsArray.swap(myarray, 1, 4)
 * console.log(myarray) // 0, 4, 2, 3, 1
 * ```
 */
export const swap = (array: unknown[], originIndex: number, destinationIndex: number) => {
	if (originIndex < 0 || originIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(originIndex) != originIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (destinationIndex < 0 || destinationIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(destinationIndex) != destinationIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (originIndex == destinationIndex) throw new Error(`'oldIndex' y 'newIndex' no deben tener el mismo valor`)

	const el1 = array[originIndex]
	const el2 = array[destinationIndex]
	array.splice(destinationIndex, 1, el1)
	if (el2) {
		array.splice(originIndex, 1, el2)
	} else {
		array.splice(originIndex, 1)
	}
	return array
}

/**
 * Relocate one element of an array.
 * @param array Target array.
 * @param originIndex First element index.
 * @param destinationIndex Second element index.
 * @returns Target array.
 * @example
 * ```javascript
 * const myarray = [0, 1, 2, 3, 4]
 * PUtilsArray.moveItem(myarray, 1, 3)
 * console.log(myarray) // 0, 2, 3, 1, 4
 * ```
 */
export const moveItem = (array: unknown[], originIndex: number, destinationIndex: number) => {
	if (originIndex < 0 || originIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(originIndex) != originIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (destinationIndex < 0 || destinationIndex >= array.length) throw new Error(`'oldIndex' está fuera de los límites permitidos`)
	if (Math.ceil(destinationIndex) != destinationIndex) throw new Error(`'oldIndex' debe ser un número entero`)
	if (originIndex == destinationIndex) throw new Error(`'oldIndex' y 'newIndex' no deben tener el mismo valor`)

	const el1 = array[originIndex]
	array.splice(originIndex, 1)
	array.splice(destinationIndex, 0, el1)
	return array
}

/**
 * It is used to compare every elements of an array. It can be used of two ways:
 * #### Object comparison 
 * Is useful with object arrays. Each property of the logical selector will be compare with every element of the target array. If values match, return true.
 * ```javascript
 * const myarray = [
 *     { prop1: 'oneA', prop2: 'twoA', prop3: 'threeA' },
 *     { prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' },
 *     { prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } },
 * ]
 * console.log(PUtilsArray.query(myarray, { prop2: 'twoB' })) // [{ prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' }]
 * console.log(PUtilsArray.query(myarray, { 'prop3.prop32': 'threeCB' })) // [{ prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } }]
 * ```
 */
export type PLogicalSelector<T> = (Partial<T> & Record<string, unknown>) | ((element: T, index: number) => boolean)

export const queryOne = <T>(array: T[], query: PLogicalSelector<T>, resultReturn?: (element: T | null, i: number) => T) => {
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

export const query = <T>(array: T[], query: PLogicalSelector<T>) => {
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

export const extractOne = <T>(array: T[], query: PLogicalSelector<T>) => {
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

/**
 * Delete elements on an array.
 * @param array Target array.
 * @param query Logical condition.
 * ```javascript
 * const myarray = [
 *     { prop1: 'oneA', prop2: 'twoA', prop3: 'threeA' },
 *     { prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' },
 *     { prop1: 'oneC', prop2: 'twoC', prop3: 'threeC' },
 * ]
 * console.log(PUtilsArray.extract(myarray, { prop2: 'twoB' })) // { prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' }
 * console.log(myarray) // { prop1: 'oneA', prop2: 'twoA', prop3: 'threeA' }, { prop1: 'oneC', prop2: 'twoC', prop3: 'threeC' }
 * ```
 * @returns An array with the deleted elements.
 */
export const extract = <T>(array: T[], query: PLogicalSelector<T>) => {
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

/**
 * Split the array into chunks. Each chunk of the array will have a maximum length as specified by the parameter.
 * @param array Target array.
 * @param length Max length of the chunk.
 * @returns A chunks array.
 */
export const chunks = <T>(array: T[], length: number): T[][] => {
	const chunks: T[][] = []
	const currentLength = array.length
	let i = 0
	while (i < currentLength) {
		chunks.push(array.slice(i, i += length))
	}
	return chunks
}

/**
 * Indexes an array.
 * @param array Target array.
 * @param setterPropertyName Function that returns the key of the index.
 * @param formatElement Transformation elements.
 * @returns An object with the indexed elements of the original array.
 */
export const index = <T, K = never>(array: T[], setterPropertyName: (element: T, index?: number) => string, formatElement?: (element: T, index?: number) => K) => {
	const result: Record<string, [K] extends [never] ? T : K> = {}
	for (const [i, element] of array?.entries() ?? []) {
		result[setterPropertyName(element, i)] = (formatElement?.(element, i) ?? element) as any
	}
	return result
}

/**
 * Get a new array with distinct elements. Only compare elements of primitive types.
 * @param array Target array.
 * @returns A new array with distinct elements.
 */
export const distinct = <T>(array: T[]) => Array.from(new Set(array))