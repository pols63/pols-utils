import { PLanguages } from "../constants"
import { padStart } from "./string.browser"

export const DAYS: Record<PLanguages, string[]> = {
	SPANISH: ['lunes', 'martes', 'mierrcoles', 'jueves', 'viernes', 'sabado', 'domingo'],
	ENGLISH: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
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
 * @param date The target date.
 * @param shortName If `true`, returns the abbreviated month name (e.g., `'September'` becomes `'Sep'`).
 * @param language The language to use for the month name. If not provided, the global language is used.
 * @returns The full or abbreviated month name as a string.
 */
export const monthName = (date: Date, shortName = false, language?: PLanguages): string => {
	if (isNaN(date.getTime())) throw new Error(`The date is invalid`)
	const monthName = MONTHS[language ?? globalLanguage]?.[date.getMonth()]
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
export const format: ((date: Date, mask?: string, language?: PLanguages) => string) & {
	/**
	 * A default mask to use if `mask` not provided.
	 */
	defaultMask?: string;
} = (date: Date, mask?: string, language?: PLanguages): string => {
	if (!language) language = globalLanguage
	const hours = date.getHours()
	const hours12 = (hours % 12) || 12
	const pm = hours >= 12
	if (isNaN(date.getTime())) return ''
	return (mask ?? format.defaultMask ?? '')
		.replace(/@y/g, date.getFullYear().toString())
		.replace(/@mmmm/g, monthName(date, false, language))
		.replace(/@mmm/g, monthName(date, true, language))
		.replace(/@mm/g, padStart(date.getMonth() + 1, 2, "0"))
		.replace(/@m/g, (date.getMonth() + 1).toString())
		.replace(/@dddd/g, weekdayName(date, false, language))
		.replace(/@ddd/g, weekdayName(date, true, language))
		.replace(/@dd/g, padStart(date.getDate(), 2))
		.replace(/@d/g, date.getDate().toString())
		/* 24 horas */
		.replace(/@hh/g, padStart(date.getHours(), 2))
		.replace(/@h/g, date.getHours().toString())
		/* 12 horas */
		.replace(/@oo/g, padStart(hours12, 2))
		.replace(/@o/g, hours.toString())
		.replace(/@ii/g, padStart(date.getMinutes(), 2))
		.replace(/@i/g, date.getMinutes().toString())
		.replace(/@ss/g, padStart(date.getSeconds(), 2))
		.replace(/@s/g, date.getSeconds().toString())
		.replace(/@lll/g, padStart(date.getMilliseconds(), 3))
		.replace(/@ll/g, padStart(date.getMilliseconds(), 2))
		.replace(/@l/g, date.getMilliseconds().toString())
		.replace(/@w/g, getWeek(date).toString())
		.replace(/@eee/g, pm ? 'p.m.' : 'a.m.')
		.replace(/@ee/g, pm ? 'pm' : 'am')
		.replace(/@e/g, pm ? 'p' : 'a')
		.replace(/@EEE/g, pm ? 'P.M.' : 'A.M.')
		.replace(/@EE/g, pm ? 'PM' : 'AM')
		.replace(/@E/g, pm ? 'P' : 'A')
}
format.defaultMask = '@y-@mm-@dd @hh:@ii:@ss.@lll'