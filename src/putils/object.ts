import { PRecord } from "../constants"
import { format } from "./date"

const getNotArray = (arr: unknown[]) => {
	let searching = true
	let reference: unknown = arr
	while (searching) {
		reference = reference[0]
		if (!(reference instanceof Array)) return reference
	}
}

export const getValue = (target: unknown, path: string, stringToObject = true): unknown | undefined => {
	if (!path) return
	const parts = path.split(/\./)
	if (!parts.length) return

	let reference: unknown = target
	if (reference == null) return
	// if (reference instanceof Array) reference = reference[0]

	for (const [i, part] of parts.entries()) {
		if (reference instanceof Array) {
			reference = getNotArray(reference)
		} else if (typeof reference == 'string') {
			try {
				reference = JSON.parse(reference)
			} catch { /**/ }
		}
		if (reference == null) return

		reference = (reference as any)[part]
	}
	return reference
}

export const setValue = (target: PRecord, path: string, value: unknown): void => {
	const arr = path.split(/\./)
	let reference: unknown = target
	if (!reference) return
	for (let i = 0; i < arr.length - 1; i++) {
		if ((reference as PRecord)[arr[i]] === undefined && i < arr.length - 1) {
			(reference as PRecord)[arr[i]] = {}
		}
		reference = (reference as PRecord)[arr[i]]
		if (reference instanceof Array) reference = reference[0]
		if (!reference) return
	}
	if (value !== undefined) {
		(reference as PRecord)[arr[arr.length - 1]] = value
	} else {
		delete (reference as PRecord)[arr[arr.length - 1]]
	}
}

export const toUrlParameters = (obj: PRecord) => {
	return Object.keys(obj).map(key => {
		const value = obj[key]
		let valueToEncode: string | number | boolean = ''
		if (typeof value == 'object') {
			valueToEncode = JSON.stringify(value)
		} else if (typeof value == 'string' || typeof value == 'boolean' || typeof value == 'number') {
			valueToEncode = value
		}
		return `${encodeURIComponent(key)}=${obj[key] == null ? '' : encodeURIComponent(valueToEncode)}`
	}).join("&")
}

export const urlParametersToObject = (value: string): PRecord => {
	const query = value.match(/^\??(.*)$/)?.[1]
	if (!query) return {}
	const parts = query.split('&')
	const result: PRecord = {}
	for (const part of parts) {
		const subparts = part.split('=')
		result[subparts[0]] = subparts[1] ?? null
	}
	return result
}

export const stringify = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string) => {
	return JSON.stringify(value, function (key, value) {
		if (replacer) {
			return replacer.bind(this)(key, value)
		} else {
			return this[key] instanceof Date ? format(this[key], '@y-@mm-@dd @hh:@ii:@ss.@lll') : value
		}
	}, space)
}