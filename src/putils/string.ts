import stream from 'stream'

/**
 * Sets upper the first letter of each word in a string.
 * @param value Target string.
 * @param toLowerFirst Set if to lower before to capitalize.
 * @returns A new string.
 * @example
 * ```javascript
 * console.log(PUtilsString.capitalize('Hi user!')) // 'Hi User!'
 * console.log(PUtilsString.capitalize('Hi JEAN!')) // 'Hi Jean!'
 * console.log(PUtilsString.capitalize('hi JEAN!', false)) // 'Hi JEAN!'
 * ```
 */
export const capitalize = (value: string, toLowerFirst: boolean = true) => {
	if (toLowerFirst) value = value.toLowerCase()
	value.replace(/(\s|^)./g, (letter: string) => letter.toUpperCase())
}

/**
 * Replace quotation mark by html tag.
 * @param value Target text.
 * @param tag Tag name.
 * @returns A new string.
 * @example
 * ```javascript
 * console.log(PUtilsString.highlight(\`Hi 'user'!\`)) // 'Hi <b>user</b>!'
 * ```
 */
export const highlight = (value: string, tag = 'b') => value.replace(new RegExp(`('|")(.+?)\\1`, 'g'), (a: string, b: string, c: string) => `<${tag}>${c}</${tag}>`)

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

export const padStart = (value: string | number, length: number, fillString = '0'): string => {
	return String(value ?? '').padStart(length, fillString)
}

export const padEnd = (value: string | number, length: number, fillString = '0'): string => {
	return String(value ?? '').padEnd(length, fillString)
}

export const toArrayBuffer = (value: string, enconding: BufferEncoding = 'utf-8') => {
	const buffer = Buffer.from(value, enconding)
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}