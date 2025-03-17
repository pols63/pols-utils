import stream from 'stream'
export * as PUtilsFS from './files'
export * as PUtilsDate from './date'
export * as PUtilsArray from './array'
import * as PUtilsString from './string'
export { PUtilsString }

export { PBase64 } from './pbase64'

export { PRecord } from './constants'

export type PToMatch = {
	ne?: number,
	eq?: number,
	lt?: number,
	lte?: number,
	gt?: number,
	gte?: number,
	in?: number[],
}

/**
 * Collection of utils methods.
 */
export const PUtils = {
	Number: {
		toBytesRepresentation(size: number) {
			const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

			let i = 0

			while (size >= 1024 && i < units.length - 1) {
				size /= 1024.0
				i += 1
			}

			return PUtils.Number.format(size, { decimals: 2, significativeNumber: true }) + ' ' + units[i]
		},
		round(value: number, decimals = 0) {
			const pow = Math.pow(10, decimals)
			return Math.round(value * pow) / pow
		},
		noScientistNotation(value: number) {
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
				number = PUtilsString.padLeft(number, exponentialNumber + 1)
				const index = number.length - exponentialNumber
				number = number.substring(0, index) + '.' + number.substring(index)
			} else {
				number += PUtilsString.padRight('', exponentialNumber)
			}
			return `${sign}${number}`
		},
		format(value: number, { decimals = 0, decimalSeparator = '.', millarSeparator = ',', significativeNumber = false }: {
			decimals?: number
			decimalSeparator?: string
			millarSeparator?: string
			significativeNumber?: boolean
		} = {}) {
			const temp = PUtils.Number.round(value, decimals).toFixed(decimals)
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
		},
		write(value: number, decimals: number) {
			const text = PUtils.Number.format(value, { decimals })

			/* Separa la parte decimal */
			const arr1 = text.split('.')
			const parts = {
				integer: PUtilsString.padLeft(arr1[0], Math.ceil(arr1[0].length / 3) * 3),
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
			}).join(' ').trim() + (decimals ? ` CON ${parts.decimal}/${PUtilsString.padRight('1', decimals + 1)}` : '')
		},
		/* Compara el número con los valores pasados en params en función al nombre del parámetro */
		compare(value: number, params: PToMatch | string[] | string) {
			if (isNaN(value)) return false
			if (typeof params == 'string') params = params.split(';')

			if (params instanceof Array) {
				const newParams: PToMatch = {}
				const expression = /^([<>]=?|=)(-?[0-9]*\.?[0-9]+)$/
				for (const [i, param] of params.entries()) {
					if (typeof param !== 'string') throw new Error(`El elemento ${i} no es de tipo 'string'`)
					const parts = param.match(expression)
					const part2 = PUtils.Number.forceNumber(parts?.[2])
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

			const properties: string[] = Object.keys(params)
			for (const property of properties) {
				const param = params[property as keyof PToMatch]
				switch (property) {
					case 'lt':
					case 'lte':
					case 'gt':
					case 'gte':
					case 'eq':
					case 'ne':
						if (typeof param !== 'number') throw new Error(`El parámetro '${property}' debe ser de tipo 'number'.`)
						break
					case 'in':
						if (PUtils.getType(param) !== 'Array') throw new Error(`El parámetro '${property}' debe ser de tipo 'Array'.`)
						break
					default:
						throw new Error(`No se reconoce la propiedad '${property}'.`)
				}

				/* Valida si la comparación falla */
				switch (property) {
					case 'lt':
						if (value >= (param as number)) return false
						break
					case 'lte':
						if (value > (param as number)) return false
						break
					case 'gt':
						if (value <= (param as number)) return false
						break
					case 'gte':
						if (value < (param as number)) return false
						break
					case 'eq':
						if (value != param) return false
						break
					case 'ne':
						if (value == param) return false
						break
					case 'in':
						if (!(param as number[]).includes(value)) return false
						break
				}
			}
			return true
		},
		asElapsedTime(value: number, mask: string) {
			if (typeof mask !== 'string') throw new Error(`'mask' debe ser de tipo 'string'.`)
			if (isNaN(value)) return ''

			let rest = Math.abs(value)
			const parts: {
				years: number,
				months: number,
				weeks: number,
				days: number,
				hours: number,
				minutes: number,
				seconds: number,
				miliseconds: number,
			} = {
				years: 0,
				months: 0,
				weeks: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				miliseconds: 0,
			}
			if (mask.match(/@y/)) {
				parts.years = Math.floor(rest / 366 / 24 / 60 / 60 / 1000)
				rest = rest % (366 * 24 * 60 * 60 * 1000)
			}
			if (mask.match(/@m/)) {
				parts.months = Math.floor(rest / 30.5 / 24 / 60 / 60 / 1000)
				rest = rest % (30.5 * 24 * 60 * 60 * 1000)
			}
			if (mask.match(/@w/)) {
				parts.weeks = Math.floor(rest / 7 / 24 / 60 / 60 / 1000)
				rest = rest % (7 * 24 * 60 * 60 * 1000)
			}
			if (mask.match(/@d/)) {
				parts.days = Math.floor(rest / 24 / 60 / 60 / 1000)
				rest = rest % (24 * 60 * 60 * 1000)
			}
			if (mask.match(/@h/)) {
				parts.hours = Math.floor(rest / 60 / 60 / 1000)
				rest = rest % (60 * 60 * 1000)
			}
			if (mask.match(/@i/)) {
				parts.minutes = Math.floor(rest / 60 / 1000)
				rest = rest % (60 * 1000)
			}
			if (mask.match(/@s/)) {
				parts.seconds = Math.floor(rest / 1000)
				rest = rest % 1000
			}
			if (mask.match(/@l/)) {
				parts.miliseconds = rest
			}

			if (value < 0) mask = mask.replace(/^/g, '-')

			return mask
				.replace(/@yy/g, PUtilsString.padLeft(parts.years, 2))
				.replace(/@y/g, parts.years.toString())
				.replace(/@mm/g, PUtilsString.padLeft(parts.months, 2))
				.replace(/@m/g, parts.months.toString())
				.replace(/@ww/g, PUtilsString.padLeft(parts.weeks, 2))
				.replace(/@w/g, parts.weeks.toString())
				.replace(/@dd/g, PUtilsString.padLeft(parts.days, 2))
				.replace(/@d/g, parts.days.toString())
				.replace(/@hh/g, PUtilsString.padLeft(parts.hours, 2))
				.replace(/@h/g, parts.hours.toString())
				.replace(/@ii/g, PUtilsString.padLeft(parts.minutes, 2))
				.replace(/@i/g, parts.minutes.toString())
				.replace(/@ss/g, PUtilsString.padLeft(parts.seconds, 2))
				.replace(/@s/g, parts.seconds.toString())
				.replace(/@ll/g, PUtilsString.padLeft(parts.miliseconds, 2))
				.replace(/@l/g, parts.miliseconds.toString())
		},
		isInteger(value: number) {
			return Math.ceil(value) == value
		},
		isPositive(value: number) {
			return value >= 0
		},
		isNegative(value: number) {
			return value < 0
		},
		isGreaterThan(value: number, reference: number) {
			return value > reference
		},
		singularPlural(value: number, singular: string, plural: string) {
			return value == 1 ? singular : plural.replace('?', value.toString())
		},
		forceNumber: (value?: unknown) => {
			const transformed = Number(value)
			return isNaN(transformed) ? 0 : transformed
		},
	},
	ReadableStream: {
		isReadableSream(value: unknown): value is stream.Readable {
			return (
				typeof value === 'object'
				&& value !== null
				&& 'getReader' in value && typeof value.getReader == 'function'
				&& 'on' in value && typeof value.on == 'function'
				&& 'locked' in value && typeof value.locked == 'function'
			)
		},
		toString(readableStream: stream.Readable, encoding?: 'base64'): Promise<string> {
			const chunks: Uint8Array[] = []

			return new Promise((resolve, reject) => {
				readableStream.on('data', chunk => {
					chunks.push(chunk)
				})

				readableStream.on('end', () => {
					const text = Buffer.concat(chunks).toString()
					if (encoding == 'base64') {
						resolve(Buffer.from(text).toString('base64'))
					} else {
						resolve(text)
					}
				})

				readableStream.on('error', reject)
			})
		},
		toArrayBuffer(readableStream: stream.Readable): Promise<ArrayBuffer> {
			const chunks: Buffer[] = []

			return new Promise((resolve, reject) => {
				readableStream.on('data', chunk => {
					chunks.push(chunk)
				})

				readableStream.on('end', () => {
					const buffer = Buffer.concat(chunks)
					resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
				})

				readableStream.on('error', reject)
			})
		},
	},
	ArrayBuffer: {
		toString(data: ArrayBuffer, encode = 'utf-8') {
			return new TextDecoder(encode).decode(new Uint8Array(data))
		}
	},
	Function: {
		throttle: (func: (...args: unknown[]) => void, delay: number) => {
			let idTimeout: ReturnType<typeof setTimeout> | null
			return function (...args: unknown[]) {
				if (!idTimeout) {
					idTimeout = setTimeout(() => idTimeout = null, delay)
				} else {
					return
				}
				return func(...args)
			}
		},
		debounce: (func: (...args: unknown[]) => void, delay: number) => {
			let idTimeout: ReturnType<typeof setTimeout> | null
			return function (...args: unknown[]) {
				if (idTimeout) clearTimeout(idTimeout)
				idTimeout = setTimeout(() => func(...args), delay)
			}
		},
	},
	getType: (obj: unknown) => {
		const type = toString.call(obj).match(/\s([a-zA-Z0-9]+)/)?.[1].replace(/HTML[a-zA-Z]*Element/, "HTMLElement")
		return (['Object', 'Array'].includes(type ?? '') ? (obj as PRecord).constructor.name : type) ?? null
	},
	formula: (toEval: string, parameters: PRecord) => {
		if (parameters) {
			parameters = (() => {
				const neoParameters: PRecord = {}
				for (const propertyName in parameters) {
					let value = parameters[propertyName]
					switch (typeof value) {
						case 'string':
							value = value.trim()
							if (!value) {
								neoParameters[propertyName] = 0
							} else {
								const num = Number(value)
								neoParameters[propertyName] = isNaN(num) ? value : num
							}
							break
						case 'number':
							neoParameters[propertyName] = value
							break
						default:
							neoParameters[propertyName] = 0
							break
					}
				}
				return neoParameters
			})()
		}
		if (typeof toEval !== 'string') throw new Error(`El primer parámetro debe ser de tipo 'string'`)
		const keywords = {
			avg: (...values: number[]) => values.reduce((ac, value) => ac + value, 0) / values.length,
			pow: Math.pow,
			e: () => Math.E,
			pi: () => Math.PI,
		}

		const patronDeReferencias = /\$\b[a-zA-Z]+?[a-zA-Z0-9]*\b/g

		/* Función que se utilizará de forma recursiva */
		const replaceRefereces = (references: string[] | null) => {
			if (references == null) return
			for (const reference of references) {
				const propertyName = reference.substring(1)
				toEval = toEval.replace(new RegExp(`\\${reference}`, 'g'), parameters?.[propertyName]?.toString().trim() || '0')
			}
			references = toEval.match(patronDeReferencias)
			if (references) replaceRefereces(references)
		}

		/* Busca las referencias */
		const references = toEval.match(patronDeReferencias)

		/* Sustituye las referencias con los parámetros */
		if (references) replaceRefereces(references)

		/* Busca todos los tokens */
		const tokens = new Set(toEval.match(/\b[a-z]+?[a-z0-9]*\b\(/ig) ?? [])

		if (tokens.size) {
			for (let token of Array.from(tokens)) {
				token = token.substring(0, token.length - 1).toLowerCase()
				if (!(token in keywords)) throw new Error(`No existe la función '${token}'`)
				toEval = toEval.replace(new RegExp(token, 'ig'), `keywords.${token}`)
			}
		}

		const result = new Function(toEval)()
		return (isNaN(result) && typeof result !== 'string') ? null : result
	}
}