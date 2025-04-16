import { PLanguages } from "../constants"
import { padEnd } from "./string.browser"

/**
 * Converts a number to a formatted string representation.
 * @param value The numeric value to format.
 * @param config Configuration object.
 * @returns A formatted string representing the number.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.format(123456789.1234)) // 123,456,789
 * console.log(PUtilsNumber.format(123456789.1234, { decimals: 2 })) // 123,456,789.12
 * console.log(PUtilsNumber.format(123456789.1234, { decimals: 5 })) // 123,456,789.12340
 * console.log(PUtilsNumber.format(123456789.1234, { decimals: 5, significativeNumber: true })) // 123,456,789.1234
 * console.log(PUtilsNumber.format(123456789.1234, { decimals: 5, significativeNumber: true, decimalSeparator: ',', millarSeparator: ' ' })) // 123 456 789,1234
 * ```
 */
export const format = (value: number, { decimals = 0, decimalSeparator = '.', thousandSeparator = ',', significativeNumber = false }: {
	/**
	 * Default `0`. Number of decimal places to include.
	 */
	decimals?: number
	/**
	 * Default `'.'`. Character to use as the decimal separator.
	 */
	decimalSeparator?: string
	/**
	 * Default `','`. Character to use as the thousand separator.
	 */
	thousandSeparator?: string
	/**
	 * Default `false`. If `true`, trailing zeros in the decimal part will be omitted.
	 */
	significativeNumber?: boolean
} = {}) => {
	if (!isFinite(value) || isNaN(value)) return value.toString()

	const stringValue = value.toString().split('e')

	const numberPart = round(Number(stringValue[0]), decimals).toFixed(decimals)

	const parts = numberPart.match(/^(.*?)(e(.*?))?$/)

	const matches = parts[0].match(/(-?)([0-9]*)\.?([0-9]*)/)
	if (matches) {
		const signal = matches[1]
		const integer = matches[2]
		const decimal = matches[3]
		let finalInteger = ''
		let count = 0
		for (let i = integer.length - 1; i >= 0; i--) {
			finalInteger = `${integer[i]}${count % 3 === 0 && count > 0 ? thousandSeparator : ''}${finalInteger}`
			count++
		}
		const result = `${signal}${finalInteger}${decimals ? `${decimalSeparator}${decimal}` : ''}`
		if (significativeNumber) {
			return result.replace(/(\.)([0-9]*?)0+$/, (_a, _b, c) => c ? `.${c}` : '') + (stringValue[1] ?? '')
		} else {
			return result + (stringValue[1] ?? '')
		}
	} else {
		return stringValue[1] ?? ''
	}
}

/**
 * Converts a numeric value to a human-readable string representing a size in bytes. The value is divided by 1024 iteratively until it fits into a suitable unit (K, M, G, etc.).
 * @param size The numeric value in bytes to format.
 * @param config Configuration object.
 * @returns A string representation of the size with the appropriate unit.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.sizeRepresentation(2300)) // "2.25 K"
 * console.log(PUtilsNumber.sizeRepresentation(2300456)) // "2.19 M"
 * console.log(PUtilsNumber.sizeRepresentation(1048576)) // "1.00 M"
 * console.log(PUtilsNumber.sizeRepresentation(1099511627776)) // "1.00 T"
 * ```
 */
export const sizeRepresentation = (size: number, { decimalSeparator = '.', thousandSeparator = ',' }: {
	/**
	 * Default `'.'`. Character to use as the decimal separator.
	 */
	decimalSeparator?: string
	/**
	 * Default `','`. Character to use as the thousand separator.
	 */
	thousandSeparator?: string
} = {}) => {
	const units = ['', 'K', 'M', 'G', 'T', 'P', 'E']

	let i = 0

	while (size >= 1024 && i < units.length - 1) {
		size /= 1024.0
		i += 1
	}

	return format(size, { decimals: 2, significativeNumber: true, decimalSeparator, thousandSeparator }) + ' ' + units[i]
}

/**
 * Rounds a number to a specified number of decimal places using standard rounding rules (round half up).
 * @param value The number to round.
 * @param decimals The number of decimal places to round to.
 * @returns The rounded number.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.round(3.14159))           // 3
 * console.log(PUtilsNumber.round(3.14159, 2))        // 3.14
 * console.log(PUtilsNumber.round(3.1459, 2))         // 3.15
 * console.log(PUtilsNumber.round(123.456789, 4))     // 123.4568
 * ```
 */
export const round = (value: number, decimals = 0) => {
	const pow = Math.pow(10, decimals)
	return Math.round(value * pow) / pow
}

const units = {
	[PLanguages.ENGLISH]: ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'],
	[PLanguages.SPANISH]: ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'],
}
const tens = {
	[PLanguages.ENGLISH]: ['', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'],
	[PLanguages.SPANISH]: ['', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'],
}

/**
 * Converts a numeric value to its written representation.
 * @param value The number value to convert.
 * @param decimals The number of decimal places to include in the output.
 * @returns A string representing the number in words.
 * @example
 * ```javascript
 * console.log(write(123)) // 'CIENTO VEINTITRÉS'
 * console.log(write(123.45, 2)) // 'CIENTO VEINTITRÉS CON 45/100'
 * console.log(write(123.4567, 3)) // 'CIENTO VEINTITRÉS CON 457/1000'
 * console.log(write(123.999, 0)) // 'CIENTO VEINTICUATRO'
 * ```
 */
export const write = (value: number, { decimals = 0, language = PLanguages.ENGLISH }: {
	decimals?: number
	language?: PLanguages
} = {}) => {
	const text = format(value, { decimals })

	/* Separa la parte decimal */
	const arr1 = text.split('.')
	const parts = {
		integer: padStart(arr1[0], Math.ceil(arr1[0].length / 3) * 3),
		decimal: arr1[1]
	}

	/* Se divide cada tres caracteres la parte entera */
	const groups = parts.integer.match(/.{1,3}/g) ?? []

	const results: string[] = []
	for (const group of groups) {
		const hundred = Number(group[0])
		const ten = Number(group[1])
		const unity = Number(group[2])

		const hundredString = ['', (ten || unity) ? 'CIENTO' : 'CIEN', 'DOCIENTOS', 'TRECIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEICIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'][hundred]

		const tenString = ['', unity ? '' : 'DIEZ', unity ? 'VEINTI' : 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'][ten]

		let unityString
		if (unity && ten === 1) {
			unityString = tens[language][unity]
		} else {
			unityString = units[language][unity]
		}

		results.push(`${hundredString}${(hundred && (ten || unity)) ? ' ' : ''}${tenString}${(ten > 2 && unity) ? ' Y ' : ''}${unityString}`)
	}

	const separators = ['', 'MIL', 'MILLÓN', 'BILLÓN', 'TRILLÓN', 'CUATRILLÓN', 'QUINTILLÓN', 'SEXTILLÓN', 'SEPTILLÓN', 'OCTILLÓN', 'NONILLÓN']
	return results.map((r, i) => {
		const indexSeparator = results.length - i - 1
		let separator = separators[indexSeparator]
		const num = Number(groups[i])
		if (indexSeparator === 1 && num === 1) {
			r = separator === 'MIL' ? '' : 'UN'
		} else if (indexSeparator > 1 && num > 1) {
			separator = separator.replace('ÓN', 'ONES')
		}
		return `${r} ${separator}`
	}).join(' ').trim() + (decimals ? ` CON ${parts.decimal}/${padEnd('1', decimals + 1)}` : '')
}

export type PToMatch = {
	ne?: number,
	eq?: number,
	lt?: number,
	lte?: number,
	gt?: number,
	gte?: number,
	in?: number[],
}

/* Compara el número con los valores pasados en params en función al nombre del parámetro */
export const compare = (value: number, params: PToMatch | string[] | string) => {
	if (isNaN(value)) return false
	if (typeof params == 'string') params = params.split(';')

	if (params instanceof Array) {
		const newParams: PToMatch = {}
		const expression = /^([<>]=?|=)(-?[0-9]*\.?[0-9]+)$/
		for (const [i, param] of params.entries()) {
			if (typeof param !== 'string') throw new Error(`El elemento ${i} no es de tipo 'string'`)
			const parts = param.match(expression)
			const part2 = parse(parts?.[2])
			switch (parts?.[1]) {
				case '!=':
					newParams.ne = part2
					break
				case '=':
					newParams.eq = part2
					break
				case '<':
					newParams.lt = part2
					break
				case '<=':
					newParams.lte = part2
					break
				case '>':
					newParams.gt = part2
					break
				case '>=':
					newParams.gte = part2
					break
			}
		}
		params = newParams
	}

	for (const property in params) {
		const param = params[property]

		/* Valida si la comparación falla */
		switch (property) {
			case 'lt':
				if (value >= param) return false
				break
			case 'lte':
				if (value > param) return false
				break
			case 'gt':
				if (value <= param) return false
				break
			case 'gte':
				if (value < param) return false
				break
			case 'eq':
				if (value != param) return false
				break
			case 'ne':
				if (value == param) return false
				break
			case 'in':
				if (param.includes(value)) return false
				break
		}
	}
	return true
}

export const isInteger = (value: number) => Math.ceil(value) == value

export const isPositive = (value: number) => value >= 0

export const isNegative = (value: number) => value < 0

export const pluralize = (value: number, singular: string, plural: string) => `${value} ${value == 1 ? singular : plural}`

export const parse = (value?: unknown, defaultValue = 0) => {
	const transformed = Number(value)
	return isNaN(transformed) ? defaultValue : transformed
}

export const padStart = (value: string | number, length: number, fillString = '0') => {
	return String(value).padStart(length, fillString)
}