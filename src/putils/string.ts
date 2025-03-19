import stream from 'stream'

/**
 * Sets upper to first letter at string
 * @param value Target string.
 * @returns A new string with the first letter at upper.
 * @example
 * ```javascript
 * console
 * ```
 */
export const ucWords = (value: string) => value.replace(/(\s|^)./g, (letter: string) => letter.toUpperCase())

export const highlight = (value: string, tag = 'b') => value.replace(new RegExp(`('|")(.+?)\\1`, 'g'), (a: string, b: string, c: string) => `<${tag}>${c}</${tag}>`)

export const capitalize = (value: string) => value.toLowerCase().replace(/(\s|^)[a-záéíóúñ]/g, (c) => c.toUpperCase())

export const withoutAccentMark = (value?: string) => {
	const accentMarks: Record<string, string> = { Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
	return value?.replace(/á|é|í|ó|ú|Á|É|Í|Ó|Ú/g, (v) => accentMarks[v])
}

export const smartMatch = (subject: string, match: string) => {
	const accentMarks: Record<string, string> = { á: '(a|á)', é: '(e|é)', í: '(i|í)', ó: '(o|ó)', ú: '(u|ú)', a: '(a|á)', e: '(e|é)', i: '(i|í)', o: '(o|ó)', u: '(u|ú)' }
	match = match.trim().toLowerCase()
		.replace(/\.|\?|\+|\*|\(|\)|\{|\}|\[|\]/g, ' ')
		.replace(/á|é|í|ó|ú|a|e|i|o|u/g, (v) => accentMarks[v])
		.replace(/\s+/g, ' ')
		.replace(/\s/g, '.*?')
	return subject.match(new RegExp(match, 'gi'))
}

export const compareWithoutAccentMark = (value1: string, value2: string) => {
	return withoutAccentMark(value1) === withoutAccentMark(value2)
}

export const toReadableStream = (value: string, coding: 'utf8' | 'base64' = 'utf8') => {
	const readableStream = new stream.Readable
	switch (coding) {
		case 'utf8':
			readableStream.push(value)
			break
		case 'base64':
			readableStream.push(Buffer.from(value, 'base64'))
			break
	}
	readableStream.push(null)
	return readableStream
}

export const left = (value: string | number, length: number): string => {
	const text = typeof value == 'number' ? value.toString() : value
	return text.substring(0, length)
}

export const right = (value: string | number, length: number): string => {
	const text = typeof value == 'number' ? value.toString() : value
	return text.substring(text.length - length)
}

export const padLeft = (value: string | number, length: number, text = '0'): string => {
	if (length < 0) throw new Error(`'length' debe ser positivo`)
	if (Math.ceil(length) != length) throw new Error(`'length' debe ser un número entero`)
	const target = typeof value == 'number' ? value.toString() : value
	if (target.length > length || text == '') return target
	const chain = Array(length + 1).join(text)
	return right(`${chain}${target}`, length)
}

export const padRight = (value: string | number, length: number, text = '0'): string => {
	if (length < 0) throw new Error(`'length' debe ser positivo`)
	if (Math.ceil(length) != length) throw new Error(`'length' debe ser un número entero`)
	const target = typeof value == 'number' ? value.toString() : value
	if (target.length > length || text == '') return target
	const chain = Array(length + 1).join(text)
	return left(`${target}${chain}`, length)
}