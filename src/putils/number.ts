import { padEnd } from "./string"

export const format = (value: number, { decimals = 0, decimalSeparator = '.', millarSeparator = ',', significativeNumber = false }: {
	decimals?: number
	decimalSeparator?: string
	millarSeparator?: string
	significativeNumber?: boolean
} = {}) => {
	const temp = round(value, decimals).toFixed(decimals)
	const matches = temp.match(/(-?)([0-9]*)\.?([0-9]*)/)
	if (matches) {
		const signal = matches[1]
		const integer = matches[2]
		const decimal = matches[3]
		let finalInteger = ''
		let count = 0
		for (let i = integer.length - 1; i >= 0; i--) {
			finalInteger = `${integer[i]}${count % 3 === 0 && count > 0 ? millarSeparator : ''}${finalInteger}`
			count++
		}
		const result = `${signal}${finalInteger}${decimals ? `${typeof decimalSeparator === 'string' ? decimalSeparator : '.'}${decimal}` : ''}`
		if (significativeNumber === true) {
			return result.replace(/(\.)([0-9]*?)0+$/, (_a, _b, c) => c ? `.${c}` : '')
		} else {
			return result
		}
	} else {
		return ''
	}
}

export const bytesRepresentation = (size: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

	let i = 0

	while (size >= 1024 && i < units.length - 1) {
		size /= 1024.0
		i += 1
	}

	return format(size, { decimals: 2, significativeNumber: true }) + ' ' + units[i]
}

export const round = (value: number, decimals = 0) => {
	const pow = Math.pow(10, decimals)
	return Math.round(value * pow) / pow
}

export const noScientistNotation = (value: number) => {
	const numberString = value.toString()
	/* Descomposición del número completo */
	const matches = numberString.match(/(-?)([0-9]*\.?[0-9]+)e([-+]?)([0-9]+)/)
	if (!matches) return numberString
	const sign = matches[1]
	let number = matches[2]
	const exponentialSign = matches[3]
	let exponentialNumber = Number(matches[4])
	/* Descomposición del número base */
	const matches2 = number.match(/\./)
	if (matches2) {
		exponentialNumber += (number.length - (matches2.index ?? 0) - 1) * (exponentialSign === '-' ? 1 : -1)
		number = number.replace('.', '')
	}
	/* Construye el número a presentar */
	if (exponentialSign === '-') {
		number = padStart(number, exponentialNumber + 1)
		const index = number.length - exponentialNumber
		number = number.substring(0, index) + '.' + number.substring(index)
	} else {
		number += padEnd('', exponentialNumber)
	}
	return `${sign}${number}`
}

export const write = (value: number, decimals: number) => {
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
			unityString = ['', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'][unity]
		} else {
			unityString = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'][unity]
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