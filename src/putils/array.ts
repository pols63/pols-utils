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
 * It is used to compare every elements in the array. It can be used of two ways:
 * #### 1. Object comparison 
 * Is useful with object arrays. Each property of the logical selector will be compare with every element of the target array at same properties. If their values matches, return true.
 * ```javascript
 * const myarray = [
 *     { prop1: 'oneA', prop2: 'twoA', prop3: 'threeA' },
 *     { prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' },
 *     { prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } },
 * ]
 * console.log(PUtilsArray.query(myarray, { prop2: 'twoB' })) // [{ prop1: 'oneB', prop2: 'twoB', prop3: 'threeB' }]
 * console.log(PUtilsArray.query(myarray, { 'prop3.prop32': 'threeCB' })) // [{ prop1: 'oneC', prop2: 'twoC', prop3: { prop31: 'threeCA', prop32: 'threeCB' } }]
 * ```
 * #### 2. Evaluate function 
 * In this case, it must be a function to execute for each element in the array. It should return `true` if the element must be selected.
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
 * Gets the first element of an array that satisfies the given logical selector.
 * @param array Target array.
 * @param logicalSelector Logical selector.
 * @param transform A function that transforms the selected element, if provided.
 * @returns The selected element.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.queryOne(pets, pet => pet.type == 'dog')) // Same PUtilsArray.queryOne(pets, { type: 'dog' })
 * // { type: 'dog', name: 'Fido' },
 * ```
 */
export const queryOne = <T, K = T>(array: T[], logicalSelector: PLogicalSelector<T>, transform?: (element: T | null, i: number) => K): K | undefined => {
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
 * Get the elements of an array that pass the logical selector.
 * @param array Target array.
 * @param logicalSelector Logical selector.
 * @param transform A function that transforms the selected elements, if provided.
 * @returns A new array with the selected elements.
 * @example
 * ```javascript
 * const pets = [
 *     { type: 'dog', name: 'Fido' },
 *     { type: 'dog', name: 'Chacalin' },
 *     { type: 'cat', name: 'Mr. Brown' },
 *     { type: 'cat', name: 'Night' },
 * ]
 * console.log(PUtilsArray.query(pets, pet => pet.type == 'dog')) // Same PUtilsArray.query(pets, { type: 'dog' })
 * // [
 * //     { type: 'dog', name: 'Fido' },
 * //     { type: 'dog', name: 'Chacalin' },
 * // ]
 * console.log(PUtilsArray.query(pets, { type: 'dog' }, pet => pet.name.toUppercase()) // Same PUtilsArray.query(pets, { type: 'dog' })
 * // [
 * //     { type: 'dog', name: 'FIDO' },
 * //     { type: 'dog', name: 'CHACALIN' },
 * // ]
 * ```
 */
export const query = <T, K = T>(array: T[], logicalSelector: PLogicalSelector<T>, transform?: (element: T | null, i: number) => K): K[] => {
	const results: T[] = []
	for (const [i, element] of array.entries()) {
		let success = true
		if (typeof logicalSelector == 'object') {
			if (typeof element != 'object') continue
			for (const p in logicalSelector) {
				const valueOfElement = getValue((element as unknown) as PRecord, p)
				const queryProperty = logicalSelector[p]
				if (queryProperty == null && valueOfElement == null) continue
				if (queryProperty instanceof RegExp && typeof valueOfElement == 'string' && valueOfElement.match(queryProperty)) continue
				if (valueOfElement !== logicalSelector[p]) {
					success = false
					break
				}
			}
		} else {
			success = !!logicalSelector(element, i)
		}
		if (success) results.push(element)
	}
	
	if (transform) {
		return results.map(transform)
	} else {
		return results as any
	}
}

/**
 * Get the first element of an array that pass the logical selector, and delete the element from the original array.
 * @param array Target array.
 * @param logicalSelector Logical selector.
 * @param transform A function that transforms the selected element, if provided.
 * @returns The selected element.
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
 * Get the elements of an array that pass the logical selector.
 * @param array Target array.
 * @param logicalSelector Logical selector.
 * @param transform A function that transforms the selected elements, if provided.
 * @returns A new array with the selected elements.
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
 * Group elements of an array.
 * @param array Target array.
 * @param setterPropertyName Callback that get the key of each group.
 * @param transform Callback for transform of each element in tha array.
 * @returns A new object with the elements grouped.
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
 * Inserts an element into an array if the `check` callback returns `false` for every element. Otherwise, it removes the element(s) for wich `check` returns `true`. 
 * @param array Target array.
 * @param element Element for insert if `check` returns `false` for every element of the array.
 * @param check Callback that check every element in the array.
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
 * Split the array into chunks. Each chunk of the array will have a maximum length as specified by the parameter.
 * @param array Target array.
 * @param length Max length of the chunk.
 * @returns A chunks array.
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
 * @example
 * ```javascript
 * const mynumbers = [0, 1, 2, 2, 2, 5, 6, 7, 7, 7]
 * console.log(PUtilsArray.distinct(mynumbers)) // [0, 1, 2, 5, 6, 7]
 */
export const distinct = <T>(array: T[]) => Array.from(new Set(array))