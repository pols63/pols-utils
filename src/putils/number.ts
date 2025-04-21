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

const sizeSufix = ['', 'K', 'M', 'G', 'T', 'P', 'E']

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
	let i = 0

	while (size >= 1024 && i < sizeSufix.length - 1) {
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
	[PLanguages.ENGLISH]: ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'],
	[PLanguages.SPANISH]: ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'],
}
const tenTwenty = {
	[PLanguages.ENGLISH]: ['', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'],
	[PLanguages.SPANISH]: ['', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'],
}

const tens = {
	[PLanguages.ENGLISH]: ['TWENTY', 'THIRTY', 'FOURTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'],
	[PLanguages.SPANISH]: ['TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'],
}

const separators = {
	[PLanguages.ENGLISH]: ['THOUSAND', 'MILLION', 'BILLION', 'TRILLION', 'QUADRILLION', 'QUINTILLION', 'SEXTILLION', 'SEPTILLION', 'OCTILLION', 'NONILLION'],
	[PLanguages.SPANISH]: ['MIL', 'MILLÓN', 'BILLÓN', 'TRILLÓN', 'CUATRILLÓN', 'QUINTILLÓN', 'SEXTILLÓN', 'SEPTILLÓN', 'OCTILLÓN', 'NONILLÓN'],
}

const hundreds = ['DOCIENTOS', 'TRECIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEICIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

/**
 * Converts a numeric value to its written representation.
 * @param value The number value to convert.
 * @param decimals The number of decimal places to include in the output.
 * @returns A string representing the number in words.
 * @example
 * ```javascript
 * console.log(write(123)) // 'ONE HUNDRED TWENTI THREE'
 * console.log(write(123.45, 2)) // 'ONE HUNDRED TWENTI THREE AND 45/100'
 * console.log(write(123.4567, 3)) // 'ONE HUNDRED TWENTI THREE AND 457/1000'
 * console.log(write(123.999, 0)) // 'ONE HUNDRED TWENTI FOUR'
 * ```
 */
export const write = (value: number, { decimals = 0, language = PLanguages.ENGLISH }: {
	decimals?: number
	language?: PLanguages
} = {}) => {
	const text = format(value, { decimals })

	/* Separa la parte decimal */
	const [integerText, decimalText] = text.split('.')
	const integerParts = integerText.split(',').map(v => padStart(v, 3))

	const results: string[] = []
	for (const [i, group] of integerParts.entries()) {
		const numb = Number(group)
		const hundred = Number(group[0])
		const ten = Number(group[1])
		const unit = Number(group[2])

		let hundredString = ''
		if (hundred) {
			if (language == PLanguages.SPANISH) {
				if (hundred == 1) {
					hundredString = (ten || unit) ? 'CIENTO' : 'CIEN'
				} else {
					hundredString = hundreds[hundred - 2]
				}
			} else {
				hundredString = `${units[language][hundred]} HUNDRED`
			}
		}

		let tenString = ''
		if (ten) {
			if (language == PLanguages.SPANISH) {
				if (ten == 1) {
					tenString = unit ? '' : 'DIEZ'
				} else if (ten == 2) {
					tenString = unit ? 'VEINTI' : 'VEINTE'
				} else {
					tenString = tens[language][ten - 3]
				}
			} else {
				if (ten == 1) {
					tenString = unit ? '' : 'TEN'
				} else {
					tenString = tens[language][ten - 2]
				}
			}
		}

		let unitString: string
		if (unit && ten === 1) {
			unitString = tenTwenty[language][unit]
		} else {
			unitString = units[language][unit]
		}

		/* Palabras separadoras de miles */
		const lastGroup = i == integerParts.length - 1
		let separator = lastGroup ? '' : separators[language][integerParts.length - 2 - i]
		if (numb > 1 && language == PLanguages.SPANISH) {
			if (separator != 'MIL') separator = separator.replace('ÓN', 'ONES')
		}

		const words: string[] = []
		if (hundredString) words.push(hundredString)
		if (tenString) words.push(tenString)

		if (tenString && language == PLanguages.SPANISH && unit && ten > 2) words.push('Y')

		if (numb == 1 && language == PLanguages.SPANISH && !lastGroup) {
			words.push(separator)
		} else if (unit || (!unit && !words.length && !results.length)) {
			words.push(unitString)
			if (separator) words.push(separator)
		}

		if (words.length) results.push(words.join(' '))
	}

	return results.join(' ').trim() + (decimals ? ` ${language == PLanguages.ENGLISH ? 'AND' : 'CON'} ${decimalText}/${padEnd('1', decimals + 1)}` : '')
}

export type PCompareString = `<${number}` | `<=${number}` | `>${number}` | `>=${number}` | `=${number}` | `!${number}`

export type PCompareConditions = PCompareString | PCompareString[] | {
	ne?: number,
	eq?: number,
	lt?: number,
	lte?: number,
	gt?: number,
	gte?: number,
	in?: number[],
	between?: [number, number],
}

/**
 * Compares a number against one or more conditional expressions.
 * @param value The number to evaluate.
 * @param conditions Conditions to apply:
 * * A a string like `'>10'`, `'<=50'` or `'!=0'`.
 * * An array of string like [`'>10'`, `'<=50'`].
 * * An object specifying one or more keys from the following:
 *   * `ne`: not equal to
 *   * `eq`: equal to
 *   * `lt`: less than
 *   * `lte`: less than or equal to
 *   * `gt`: greater than
 *   * `gte`: greater than or equal to
 *   * `in`: value must be included in the provided array
 *   * `between`: value must be between two numbers
 * @returns `true` if all conditions in `params` evaluate to true for the given `value`; otherwise, `false`.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.compare(45, '>10')) // true
 * console.log(PUtilsNumber.compare(45, '>50')) // false
 * console.log(PUtilsNumber.compare(45, ['>10', '<50'])) // true
 * console.log(PUtilsNumber.compare(45, '!10')) // true
 * console.log(PUtilsNumber.compare(45, '=45')) // true
 * console.log(PUtilsNumber.compare(45, { gt: 10, lte: 50 }))          // true
 * console.log(PUtilsNumber.compare(45, { in: [30, 40, 45, 50] }))     // true
 * ``` 
 */
export const compare = (value: number, conditions: PCompareConditions | string[] | string) => {
	if (isNaN(value)) return false
	if (typeof conditions == 'string') conditions = conditions.split(';')

	if (conditions instanceof Array) {
		const newParams: PCompareConditions = {}
		const expression = /^([!<>=]{1,2})(-?[0-9]*\.?[0-9]+)$/
		for (const [i, param] of conditions.entries()) {
			const parts = param.replace(/\s/, '').match(expression)
			if (!parts) throw new Error(`Unknown expression: ${param}`)
			const part2 = parse(parts?.[2])
			switch (parts[1]) {
				case '!':
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
				default:
					throw new Error(`Unknown expression: ${parts[1]}`)
			}
		}
		conditions = newParams
	}

	for (const property in conditions) {
		const param = conditions[property]

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
			case 'between':
				if (value < conditions[property][0] || value > conditions[property][1]) return false
				break
		}
	}
	return true
}

/**
 * Checks if `value` is an integer number.
 * @param value The number to evaluate.
 * @returns `true` if `value` is an integer number.
 */
export const isInteger = (value: number) => Math.ceil(value) === value

/**
 * Returns the appropriate singular or plural form based on the given number.
 * @param value The number to evaluate.
 * @param singularThe string to return if `value` is exactly `1`.
 * @param plural The string to return for all other values (including `0` and decimals).
 * @returns The singular or plural string, depending of `value`.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.pluralize(45, 'item', 'items')) // 'items'
 * console.log(PUtilsNumber.pluralize(1, 'item', 'items')) // 'item'
 * console.log(PUtilsNumber.pluralize(0, 'item', 'items')) // 'items'
 * console.log(PUtilsNumber.pluralize(0.5, 'item', 'items')) // 'items'
 * ```
 */
export const pluralize = (value: number, singular: string, plural: string) => `${value} ${value == 1 ? singular : plural}`

/**
 * Converts a value to a number.
 * @param value The value to convert.
 * @param defaultValue The value to return if the conversion fails.
 * @returns The parsed number or `defaultValue` if the conversion is unsuccessful.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.parse('13')) // 13
 * console.log(PUtilsNumber.parse('0.13')) // 0.13
 * console.log(PUtilsNumber.parse('qwerty')) // 0
 * console.log(PUtilsNumber.parse(null)) // 0
 * console.log(PUtilsNumber.parse(true)) // 0
 * console.log(PUtilsNumber.parse(false)) // 0
 * ```
 */
export const parse = (value?: unknown, defaultValue: number = 0) => {
	const transformed = Number(value)
	return isNaN(transformed) ? defaultValue : transformed
}

/**
 * Pads a string or number with another string (repeated if necessary) until the resulting string reaches the specified length.
 * @param value  The target string or number.
 * @param length The minimun length of the resulting string.
 * @param fillString The string used for padding. Defaults to `'0'`.
 * @returns The padded string.
 * @example
 * ```javascript
 * console.log(PUtilsNumber.padStart('123', 6)) // '000123'
 * console.log(PUtilsNumber.padStart('123', 6, '_')) // '___123'
 * ```
 */
export const padStart = (value: string | number, length: number, fillString = '0') => {
	return String(value).padStart(length, fillString)
}