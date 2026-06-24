import { PLanguages } from "../constants"
import { padStart } from "./string.browser"

export const DAYS: Record<PLanguages, string[]> = {
	SPANISH: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
	ENGLISH: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
}

export const MONTHS: Record<PLanguages, string[]> = {
	SPANISH: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
	ENGLISH: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
}

let globalLanguage = PLanguages.ENGLISH

/**
 * Sets the default global language for date-related methods such as `monthName`, `weekdayName`, and `format`.
 * @param language The language to set as default.
 * @example
 * ```javascript
 * PUtilsDate.setGlobalLanguage(PLanguages.SPANISH)
 * const date = new Date('2025-03-19 00:00:00')
 * console.log(PUtilsDate.monthName(date)) // 'marzo'
 * console.log(PUtilsDate.monthName(date, false, PLanguages.ENGLISH)) // 'march'
 * ```
 */
export const setGlobalLanguage = (language: PLanguages) => {
	globalLanguage = language
}

/**
 * Returns the name of the month for a given date.
 * @param date The target date or the number of the month between 1 to 12.
 * @param shortName If `true`, returns the abbreviated month name (e.g., `'September'` becomes `'Sep'`).
 * @param language The language to use for the month name. If not provided, the global language is used.
 * @returns The full or abbreviated month name as a string.
 */
export const monthName = (date: Date | number, shortName = false, language?: PLanguages): string => {
	let monthNumber: number
	if (date instanceof Date) {
		if (isNaN(date.getTime())) throw new Error(`The target is invalid date`)
		monthNumber = date.getMonth()
	} else {
		if (!Number.isFinite(date) || Number.isNaN(date) || !Number.isSafeInteger(date)) throw new Error(`The target is invalid number. It must be a integer.`)
		monthNumber = (date - 1) % 12
	}

	const monthName = MONTHS[language ?? globalLanguage]?.[monthNumber]
	if (!monthName) return ''
	return shortName ? monthName.substring(0, 3) : monthName
}

/**
 * Returns the name of the weekday for a given date.
 * @param date The target date.
 * @param shortName If `true`, returns the abbreviated weekday name (e.g., `'tuesday'` becomes `'tue'`).
 * @param language The language to use for the weekday name. If not provided, the global language is used.
 * @returns The full or abbreviated weekday name as a string.
 */
export const weekdayName = (date: Date, shortName = false, language?: PLanguages): string => {
	if (isNaN(date.getTime())) throw new Error(`The date is invalid`)
	const dayName = DAYS[language ?? globalLanguage]?.[date.getDay()]
	if (!dayName) return ''
	return shortName ? dayName.substring(0, 3) : dayName
}

/**
 * Returns the week number for a given date using the US system.
 * In this format, the week count starts on Sunday and the first week of the year always begins on January 1st.
 * @param date The target date.
 * @returns The week number of the year (starting from 1), based on the US convention.
 */
export const getWeek = (date: Date): number => {
	const onejan = new Date(date.getFullYear(), 0, 1)
	return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
}

/**
 * Formats a given date according to a custom mask and language.
 * @function
 * @param date The date to format.
 * @param mask A format string that supports the following wildcards:
 * - `@y`      - Full year (e.g., `2025`)
 * - `@m`      - Month number (1–12)
 * - `@mm`     - Month number with leading zero (01–12)
 * - `@mmm`    - Abbreviated month name (e.g., `Jan`)
 * - `@mmmm`   - Full month name (e.g., `January`)
 * - `@d`      - Day of the month (1–31)
 * - `@dd`     - Day with leading zero (01–31)
 * - `@ddd`    - Abbreviated weekday name (e.g., `Sun`)
 * - `@dddd`   - Full weekday name (e.g., `Sunday`)
 * - `@w`      - Week number (US system; starts at January 1st)
 * - `@h`      - Hour in 24-hour format (0–23)
 * - `@hh`     - Hour in 24-hour format with leading zero (00–23)
 * - `@o`      - Hour in 12-hour format (1–12)
 * - `@oo`     - Hour in 12-hour format with leading zero (01–12)
 * - `@i`      - Minutes (0–59)
 * - `@ii`     - Minutes with leading zero (00–59)
 * - `@s`      - Seconds (0–59)
 * - `@ss`     - Seconds with leading zero (00–59)
 * - `@l`      - Milliseconds (0–999)
 * - `@ll`     - Milliseconds with at least 2 digits (e.g., `09`, `95`, `120`)
 * - `@lll`    - Milliseconds with 3 digits (e.g., `009`, `095`, `120`)
 * - `@e`      - Lowercase meridiem (a/p)
 * - `@ee`     - Lowercase meridiem (am/pm)
 * - `@eee`    - Lowercase meridiem with dots (a.m./p.m.)
 * - `@E`      - Uppercase meridiem (A/P)
 * - `@EE`     - Uppercase meridiem (AM/PM)
 * - `@EEE`    - Uppercase meridiem with dots (A.M./P.M.)
 * 
 * If no mask is provided, the `PUtilsDate.format.defaultMask` is used.
 * @param language Optional. Specifies the language for month and weekday names. If not provided, the global language is used.
 * @returns A formatted date string based on the provided mask and language.
 */
const formatMap: Record<string, (date: Date, language: PLanguages, hours12: number, pm: boolean) => string> = {
	'@y': (date) => date.getFullYear().toString(),
	'@mmmm': (date, language) => monthName(date, false, language),
	'@mmm': (date, language) => monthName(date, true, language),
	'@mm': (date) => padStart(date.getMonth() + 1, 2, "0"),
	'@m': (date) => (date.getMonth() + 1).toString(),
	'@dddd': (date, language) => weekdayName(date, false, language),
	'@ddd': (date, language) => weekdayName(date, true, language),
	'@dd': (date) => padStart(date.getDate(), 2),
	'@d': (date) => date.getDate().toString(),
	'@hh': (date) => padStart(date.getHours(), 2),
	'@h': (date) => date.getHours().toString(),
	'@oo': (date, language, hours12) => padStart(hours12, 2),
	'@o': (date, language, hours12) => hours12.toString(),
	'@ii': (date) => padStart(date.getMinutes(), 2),
	'@i': (date) => date.getMinutes().toString(),
	'@ss': (date) => padStart(date.getSeconds(), 2),
	'@s': (date) => date.getSeconds().toString(),
	'@lll': (date) => padStart(date.getMilliseconds(), 3),
	'@ll': (date) => padStart(date.getMilliseconds(), 2),
	'@l': (date) => date.getMilliseconds().toString(),
	'@w': (date) => getWeek(date).toString(),
	'@eee': (date, language, hours12, pm) => pm ? 'p.m.' : 'a.m.',
	'@ee': (date, language, hours12, pm) => pm ? 'pm' : 'am',
	'@e': (date, language, hours12, pm) => pm ? 'p' : 'a',
	'@EEE': (date, language, hours12, pm) => pm ? 'P.M.' : 'A.M.',
	'@EE': (date, language, hours12, pm) => pm ? 'PM' : 'AM',
	'@E': (date, language, hours12, pm) => pm ? 'P' : 'A',
}

export const format: ((date: Date, mask?: string, language?: PLanguages) => string) & {
	/**
	 * A default mask to use if `mask` not provided.
	 */
	defaultMask?: string;
} = (date: Date, mask?: string, language?: PLanguages): string => {
	if (!language) language = globalLanguage
	if (isNaN(date.getTime())) return ''

	const hours = date.getHours()
	const hours12 = (hours % 12) || 12
	const pm = hours >= 12

	const regex = /@(?:mmmm|dddd|mmm|ddd|eee|EEE|lll|mm|dd|hh|oo|ii|ss|ll|ee|EE|y|m|d|h|o|i|s|l|w|e|E)/g
	return (mask ?? format.defaultMask ?? '').replace(regex, (match) => formatMap[match](date, language, hours12, pm))
}
format.defaultMask = '@y-@mm-@dd @hh:@ii:@ss.@lll'