import { PRecord } from "./constants"

export const getValue = (target: PRecord, path: string, stringToObject = true): unknown => {
	const arr = path.split(/\./)
	let reference: unknown = target
	if (!reference) return
	if (reference instanceof Array) reference = reference[0]
	for (let i = 0; i < arr.length; i++) {
		reference = (reference as PRecord)[arr[i]]
		if (reference instanceof Array && i < arr.length - 1) {
			reference = reference[0]
		} else if (typeof reference == 'string' && i < arr.length - 1 && stringToObject) {
			/* Si la referencia es una cadena y aún hay más propiedades para recorrer, se intenta convertir la cadena en objeto */
			try {
				reference = JSON.parse(reference)
			} catch { /**/ }
		}
		if (!reference) return reference
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