import { PRecord } from "../constants"
import { getValue } from "./object"

/**
 * Exchanges the position of two elements in an array.
 * @typeParam T The type of elements in the array.
 * @param array The target array.
 * @param originIndex The index of the first element to swap.
 * @param destinationIndex The index of the second elemento to swap.
 * @returns The same target array.
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
 * Moves an element from one position to another within an array.
 * @typeParam T The type of elements in the array.
 * @param array The target array.
 * @param originIndex The index of the element to move.
 * @param destinationIndex The index where the element will be inserted.
 * @returns The same target array.
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
 * Represents a logical selector used to filter elements in an array. It supports two modes:
 * #### 1. Object comparison 
 * Useful when workin with arrays of objects. Each property in the selector is compared against the corresponding property in every element of the array. If all values match, the element is included in the result.
 *
 * Nested properties can be accessed using dot notation.
 * ```javascript
 * const myarray = [
 *     { prop1: 'oneA', prop2: 'twoA', prop3: 'threeA' },
 *     { prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' },
 *     { prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } },
 * ]
 * console.log(PUtilsArray.query(myarray, { prop2: 'twoB' })) // [{ prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' }]
 * console.log(PUtilsArray.query(myarray, { 'prop3.prop32': 'threeCB' })) // [{ prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } }]
 * ```
 * #### 2. Predicate function 
 * Alternatively, a function can be provided. It will be called for each element in the array, and the element will be included in the result if the function returns `true`.
 *
 * ```javascript
 * const myarray = [
 *     { prop1: 'oneA', prop2: 'twoA', prop3: 'threeA' },
 *     { prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' },
 *     { prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } },
 * ]
 * console.log(PUtilsArray.query(myarray, element => element.prop2 == 'twoB')) // [{ prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' }]
 * console.log(PUtilsArray.query(myarray, element => element.prop3?.prop32 == 'threeCB' )) // [{ prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } }]
 * ```
 */
export type PLogicalSelector<T> = (Partial<T> & Record<string, unknown>) | ((element: T, index: number) => boolean)

/**
 * Gets the first element in the array that matches the given logical selector.
 * @typeParam T The type of elements in the array.
 * @typeParam K The return type of the transformation function, if provided.
 * @param array The target array to search in.
 * @param logicalSelector The selector used to identify the matching element. This can be either a predicate function or an object for property-based matching.
 * @param transform A function to transform the selected element before returning it.
 * @returns The first matching element, optionally transformed.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.queryOne(pets, pet => pet.type === 'dog'))
 * // => { type: 'dog', name: 'Fido' }
 *
 * console.log(PUtilsArray.queryOne(pets, { type: 'dog' }))
 * // => { type: 'dog', name: 'Fido' }
 *
 * console.log(PUtilsArray.queryOne(pets, { type: 'cat' }, pet => pet.name))
 * // => 'Mr. Brown'
 * ```
 */
export const filterOne = <T, K = T>(array: T[], logicalSelector: PLogicalSelector<T>, transform?: (element: T | null, i: number) => K): K | undefined => {
	if (array == null || !array.length) return

	let result: T
	let index = -1
	for (const [i, element] of array.entries()) {
		let success = true
		if (typeof logicalSelector == 'object') {
			if (typeof element != 'object') continue
			for (const p in logicalSelector) {
				const valueOfElement = getValue((element as unknown) as PRecord, p)
				const queryProperty = logicalSelector[p]
				if (queryProperty == null && valueOfElement == null) continue
				if (queryProperty instanceof RegExp && typeof valueOfElement == 'string' && valueOfElement.match(queryProperty)) continue
				if (valueOfElement !== queryProperty) {
					success = false
					break
				}
			}
		} else {
			success = !!logicalSelector(element, i)
		}
		if (success) {
			result = element
			index = i
			break
		}
	}

	if (index == -1) return

	if (transform) {
		return transform(result, index)
	} else {
		return result as any
	}
}

/**
 * Gets all elements in the array that match the given logical selector.
 * @typeParam T The type of elements in the array.
 * @typeParam K The return type of the transformation function, if provided.
 * @param array The target array to search in.
 * @param logicalSelector The selector used to identify the matching element. This can be either a predicate function or an object for property-based matching.
 * @param transform A function to transform the selected element before returning it.
 * @returns A new array with all matching elements, optionally transformed.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.query(pets, pet => pet.type == 'dog'))
 * // [
 * //     { type: 'dog', name: 'Fido' },
 * //     { type: 'dog', name: 'Chacalin' },
 * // ]
 * console.log(PUtilsArray.query(pets, { type: 'dog' }))
 * // [
 * //     { type: 'dog', name: 'Fido' },
 * //     { type: 'dog', name: 'Chacalin' },
 * // ]
 * console.log(PUtilsArray.query(pets, { type: 'dog' }, pet => pet.name.toUpperCase())
 * // [ 'FIDO', 'CHACALIN' ]
 * ```
 */
export const filter = <T, K = T>(array: T[], logicalSelector: PLogicalSelector<T>, transform?: (element: T | null, i: number) => K): K[] => {
	const filtered = array.filter((element, i) => {
		if (typeof logicalSelector === 'object') {
			if (typeof element !== 'object') return false
			return Object.entries(logicalSelector).every(([p, queryProperty]) => {
				const valueOfElement = getValue(element as PRecord, p)
				if (queryProperty == null && valueOfElement == null) return true
				if (queryProperty instanceof RegExp && typeof valueOfElement == 'string') {
					return valueOfElement.match(queryProperty)
				}
				return valueOfElement === queryProperty
			})
		} else {
			return !!logicalSelector(element, i)
		}
	})
	return transform ? filtered.map(transform) : (filtered as unknown as K[])
}

/**
 * Extracts (removes and returns) the first element in an array that matches the given logical selector.
 * @typeParam T The type of elements in the array.
 * @typeParam K The return type of the transformation function, if provided.
 * @param array The target array to search and mutate.
 * @param logicalSelector The selector used to identify the matching element. This can be either a predicate function or an object for property-based matching.
 * @param transform A function to transform the selected element before returning it.
 * @returns The first matching element, optionally transformed. Returns `undefined` if no match if found.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.extractOne(pets, pet => pet.type === 'dog'))
 * // => { type: 'dog', name: 'Fido' }
 *
 * console.log(pets)
 * // => [
 * //  { type: 'dog', name: 'Chacalin' },
 * //  { type: 'cat', name: 'Mr. Brown' },
 * //  { type: 'cat', name: 'Night' },
 * // ]
 * ```
 */
export const extractOne = <T, K = T>(array: T[], logicalSelector: PLogicalSelector<T>, transform?: (element: T | null, i: number) => K): K | undefined => {
	if (array == null || !array?.length) return

	let result: T
	let index = -1
	for (const [i, element] of array.entries()) {
		let success = true
		if (typeof logicalSelector == 'object') {
			if (typeof element != 'object') continue
			for (const p in logicalSelector) {
				if (getValue((element as unknown) as PRecord, p) !== logicalSelector[p]) {
					success = false
					break
				}
			}
		} else {
			success = !!logicalSelector(element, i)
		}
		if (success) {
			result = element
			index = i
			break
		}
	}

	if (index == -1) return

	array.splice(index, 1)
	if (transform) {
		return transform(result, index)
	} else {
		return result as any
	}
}

/**
 * Extracts (removes and returns) all elements in an array that match the given logical selector.
 * @typeParam T The type of elements in the array.
 * @typeParam K The return type of the transformation function, if provided.
 * @param array the target array to search and mutate.
 * @param logicalSelector The selector used to identify the matching element. This can be either a predicate function or an object for property-based matching.
 * @param transform A function to transform the selected element before returning it.
 * @returns A new array with all matching elements, optionally transformed. If no match is found, an empty array is returned.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.extractOne(pets, pet => pet.type === 'dog'))
 * // => [
 * //  { type: 'dog', name: 'Fido' },
 * //  { type: 'dog', name: 'Chacalin' },
 * // ]
 *
 * console.log(pets)
 * // => [
 * //  { type: 'cat', name: 'Mr. Brown' },
 * //  { type: 'cat', name: 'Night' },
 * // ]
 * ```
 */
export const extract = <T, K = T>(array: T[], logicalSelector: PLogicalSelector<T>, transform?: (element: T | null, i: number) => K): K[] => {
	let i = 0
	const results: T[] = []
	while (i < array.length) {
		const element = array[i]
		let success = true
		if (typeof logicalSelector == 'object') {
			if (typeof element != 'object') continue
			for (const p in logicalSelector) {
				if (getValue((element as unknown) as PRecord, p) !== logicalSelector[p]) {
					success = false
					break
				}
			}
		} else {
			success = !!logicalSelector(element, i)
		}
		if (success) {
			results.push(array.splice(i, 1)[0])
		} else {
			i++
		}
	}

	if (transform) {
		return results.map(transform)
	} else {
		return results as any
	}
}

/**
 * Groups elements of an array based on a key provided by a callback function.
 * @typeParam T The type of elements in the array.
 * @param array The target array.
 * @param setterPropertyName A callback function that gets the key of each group.
 * @param transform A function that transforms each element before grouping.
 * @returns A new object with the elements grouped by the key returned by the `setterPropertyName` function.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.groupBy(pets, pet => pet.type))
 * // {
 * //     dog: [
 * //         { type: 'dog', name: 'Fido' },
 * //         { type: 'dog', name: 'Chacalin' },
 * //     ],
 * //     cat: [
 * //         { type: 'cat', name: 'Mr. Brown' },
 * //         { type: 'cat', name: 'Night' },
 * //     ],
 * // }
 * ```
 */
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

/**
 * Inserts an element into an array if the `check` callback function returns `false` for every element. Otherwise, it removes the element(s) for wich `check` returns `true`. 
 * @param array The target array where the element will be toggled.
 * @param element The element to insert if `check` returns `false` for all elements.
 * @param check A callback function to check each element in the array.
 * @return The modified array with the element toggled (added or removed).
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * PUtilsArray.toggleElement(pets, { type: 'dog', name: 'Chacalin' }, pet => pet.name == 'Chacalin')
 * console.log(pets)
 * // [
 * //     { type: 'dog', name: 'Fido' },
 * //     { type: 'cat', name: 'Mr. Brown' },
 * //     { type: 'cat', name: 'Night' },
 * // ]
 * PUtilsArray.toggleElement(pets, { type: 'dog', name: 'Chacalin' }, pet => pet.name == 'Chacalin')
 * console.log(pets)
 * // [
 * //     { type: 'dog', name: 'Fido' },
 * //     { type: 'cat', name: 'Mr. Brown' },
 * //     { type: 'cat', name: 'Night' },
 * //     { type: 'dog', name: 'Chacalin' },
 * // ]
 * ```
 */
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
 * Split an array into smaller chunks. Each chunk will have a maximum length defined by the `length` parameter.
 * @typeParam T The type of elements in the array.
 * @param array The target array.
 * @param length The maximun length of each chunk.
 * @returns An array of chunks.
 * @example
 * ```javascript
 * const mynumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 * console.log(PUtilsArray.chunks(mynumbers, 3))
 * // [
 * //     [0, 1, 2],
 * //     [3, 4, 5],
 * //     [6, 7, 8],
 * //     [9],
 * // ]
 * ```
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
 * @typeParam T The type of elements in the array.
 * @param array Target array.
 * @param setterPropertyName Function that returns the key of the index.
 * @param formatElement Transformation elements.
 * @returns An object with the indexed elements of the original array.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.index(pets, pet => pet.type))
 * // {
 * //     dog: { type: 'dog', name: 'Fido' },
 * //     cat: { type: 'cat', name: 'Mr. Brown' },
 * // }
 * ```
 */
export const indexBy = <T, K = never>(array: T[], setterPropertyName: (element: T, index?: number) => string, formatElement?: (element: T, index?: number) => K) => {
	const result: Record<string, [K] extends [never] ? T : K> = {}
	for (const [i, element] of array?.entries() ?? []) {
		result[setterPropertyName(element, i)] = (formatElement?.(element, i) ?? element) as any
	}
	return result
}

/**
 * Gets a new array with only distinct elements. Only primitive values (string, number, boolean, etc) are compared.
 * @typeParam T The type of elements in the array.
 * @param array The target array.
 * @returns A new array containing only unique elements.
 * @example
 * ```javascript
 * const mynumbers = [0, 1, 2, 2, 2, 5, 6, 7, 7, 7]
 * console.log(PUtilsArray.distinct(mynumbers)) // [0, 1, 2, 5, 6, 7]
 */
export const distinct = <T>(array: T[]) => Array.from(new Set(array))