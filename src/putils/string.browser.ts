/**
 * Capitalizes the first letter of each word in a string.
 * @param value The target string.
 * @param toLowerFirst If `true`, converts the string to lowercase before capitalizing.
 * @returns A new string with the first letter of each word capitalized.
 * @example
 * ```javascript
 * console.log(PUtilsString.capitalize('Hi user!')) // 'Hi User!'
 * console.log(PUtilsString.capitalize('Hi JEAN!')) // 'Hi Jean!'
 * console.log(PUtilsString.capitalize('hi JEAN!', false)) // 'Hi JEAN!'
 * ```
 */
export const capitalize = (value: string, toLowerFirst: boolean = true) => {
	if (toLowerFirst) value = value.toLowerCase()
	return value.replace(/(\s|^)./g, (letter: string) => letter.toUpperCase())
}

/**
 * Replace quotation mark (`'` or `"`) with an HTML tag.
 * @param value The target string.
 * @param tag The name of the HTML tag to use for highlighting.
 * @returns A new string with the specified tag applied to quoted text.
 * @example
 * ```javascript
 * console.log(PUtilsString.highlight(\`Hi 'user'!\`)) // 'Hi <b>user</b>!'
 * console.log(PUtilsString.highlight(\`Hi "user"!\`)) // 'Hi <b>user</b>!'
 * console.log(PUtilsString.highlight(\`Hi 'user"!\`)) // `Hi 'user"!`
 * ```
 */
export const highlight = (value: string, tag = 'b') => value.replace(new RegExp(`('|")(.+?)\\1`, 'g'), (a: string, b: string, c: string) => `<${tag}>${c}</${tag}>`)

/**
 * Removes all accent marks from a string.
 * @param value The target text.
 * @returns The same string value without accent marks.
 */
export const withoutAccentMark = (value?: string) => {
	const accentMarks: Record<string, string> = { Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
	return value?.replace(/á|é|í|ó|ú|Á|É|Í|Ó|Ú/g, (v) => accentMarks[v])
}

/**
 * Evaluates whether a text matches another text. The comparison is case-insensitive, ignores accent marks, and allows partial word matching.
 * @param value The target text.
 * @param queryText The text to search for.
 * @returns `true` if the target text matches the query text, otherwise `false`.
 * @example
 * ```javascript
 * console.log(PUtilsString.textMatch('This is a target text', 'target')) // true
 * console.log(PUtilsString.textMatch('This is a target text', 'tar')) // true
 * console.log(PUtilsString.textMatch('This is a target text', 'TAR')) // true
 * console.log(PUtilsString.textMatch('This is a target text', 'th tex')) // true
 * console.log(PUtilsString.textMatch('This is a target text', 'asd')) // false
 * console.log(PUtilsString.textMatch('This is a target text', 'th i ta tex')) // true
 * ```
 */
export const textMatch = (value: string, queryText: string) => {
	const accentMarks: Record<string, string> = { á: '(a|á)', é: '(e|é)', í: '(i|í)', ó: '(o|ó)', ú: '(u|ú)', a: '(a|á)', e: '(e|é)', i: '(i|í)', o: '(o|ó)', u: '(u|ú)' }
	queryText = queryText.trim().toLowerCase()
		.replace(/\.|\?|\+|\*|\(|\)|\{|\}|\[|\]/g, ' ')
		.replace(/á|é|í|ó|ú|a|e|i|o|u/g, (v) => accentMarks[v])
		.replace(/\s+/g, ' ')
		.replace(/\s/g, '.*?')
	return !!value.match(new RegExp(queryText, 'gi'))
}

/**
 * Compares two string values while ignoring accent marks.
 * @param value1 The first string.
 * @param value2 The second string.
 * @returns `true` if the values match when accent marks are ignored, otherwise `false`.
 * @example
 * ```javascript
 * console.log(PUtilsString.compareWithoutAccentMarks('target', 'target')) // true
 * console.log(PUtilsString.compareWithoutAccentMarks('tárget', 'target')) // true
 * ```
 */
export const compareWithoutAccentMarks = (value1: string, value2: string) => {
	return withoutAccentMark(value1) === withoutAccentMark(value2)
}

/**
 * Extracts the first `length` characters from a string or number.
 * @param value The target string or value.
 * @param count The number of characters to extract.
 * @returns A string containing the first `length` characters of the target value.
 * @example
 * ```javascript
 * console.log(PUtilsString.subStart('this is a string', 6)) // 'this i'
 * console.log(PUtilsString.subStart(123456, 4)) // '1234'
 * ```
 */
export const subStart = (value: string | number, count: number): string => {
	const text = typeof value == 'number' ? value.toString() : value
	return text.substring(0, count)
}

/**
 * Extracts the last `length` characters from a string or number.
 * @param value The target string or value.
 * @param count The number of characters to extract.
 * @returns A string containing the last `length` characters of the target value.
 * @example
 * ```javascript
 * console.log(PUtilsString.subEnd('this is a string', 6)) // 'string'
 * console.log(PUtilsString.subEnd(123456, 4)) // '3456'
 * ```
 */
export const subEnd = (value: string | number, length: number): string => {
	const text = typeof value == 'number' ? value.toString() : value
	return text.substring(text.length - length)
}

/**
 * Pads a string or number with another string (repeated if necessary) until the resulting string reaches the specified length.
 * @param value  The target string or number.
 * @param length The minimun length of the resulting string.
 * @param fillString The string used for padding. Defaults to `'0'`.
 * @returns The padded string.
 * @example
 * ```javascript
 * console.log(PUtilsString.padStart('123', 6)) // '000123'
 * console.log(PUtilsString.padStart('123', 6, '_')) // '___123'
 * ```
 */
export const padStart = (value: string | number, length: number, fillString = '0'): string => {
	return String(value ?? '').padStart(length, fillString)
}

/**
 * Pads a string or number with another string (repeated if necessary) until the resulting string reaches the specified length.
 * @param value  The target string or number.
 * @param length The minimun length of the resulting string.
 * @param fillString The string used for padding. Defaults to `'0'`.
 * @returns The padded string.
 * @example
 * ```javascript
 * console.log(PUtilsString.padEnd('123', 6)) // '123000'
 * console.log(PUtilsString.padEnd('123', 6, '_')) // '123___'
 * ```
 */
export const padEnd = (value: string | number, length: number, fillString = '0'): string => {
	return String(value ?? '').padEnd(length, fillString)
}

/**
 * Converts a string into an `ArrayBuffer`.
 * @param value The target string.
 * @param enconding The encoding format. Defaults to `'utf-8'`.
 * @returns An `ArrayBuffer` representation of the string.
 */
export const toArrayBuffer = (value: string, enconding: BufferEncoding = 'utf-8') => {
	const buffer = Buffer.from(value, enconding)
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}