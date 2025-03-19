import { padLeft } from "./string"

export enum PLanguages {
	SPANISH = 'SPANISH',
	ENGLISH = 'ENGLISH',
}

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
 * Sets the global language for the `monthName`, `weekdayName` and `format` methods.
 * @param language Indicate the language.
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
 * Gets the month name of the date.
 * @param date Target date.
 * @param shortName If `true` it gets the month name shortly. By example: `'september'` to `'sep'`.
 * @param language Indicate the language. If it isn't provided, it will use the `GlobalLanguage`.
 * @returns String month name.
 */
export const monthName = (date: Date, shortName = false, language?: PLanguages): string => {
	if (isNaN(date.getTime())) throw new Error(`The date is invalid`)
	const monthName = MONTHS[language ?? globalLanguage]?.[date.getMonth()]
	if (!monthName) return ''
	return shortName ? monthName.substring(0, 3) : monthName
}

/**
 * Gets the weekday name of the date.
 * @param date Target date.
 * @param shortName If `true` it gets the weekday name shortly. By example: `'tuesday'` to `'tue'`.
 * @param language Indicate the language. If it isn't provided, it will use the `GlobalLanguage`.
 * @returns String weekday name.
 */
export const weekdayName = (date: Date, shortName = false, language?: PLanguages): string => {
	if (isNaN(date.getTime())) throw new Error(`The date is invalid`)
	const dayName = DAYS[language ?? globalLanguage]?.[date.getDay()]
	if (!dayName) return ''
	return shortName ? dayName.substring(0, 3) : dayName
}

/**
 * Gets the week number of the date.
 * @param date Target date.
 * @returns Number of week.
 */
export const getWeek = (date: Date): number => {
	const onejan = new Date(date.getFullYear(), 0, 1)
	return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
}

/**
 * Gets the formatted date.
 * @param date Target date.
 * @param mask Template of the format. Use this wildcards:
 * * `@y`: Year
 * * `@m`: Month (`'1'` for january through `'12'` for december).
 * * `@mm`: Month with leading zero (`'01'` for january through `'12'` for december).
 * * `@mmm`: Shortname for Month (`'Jan'` for january through `'Dec'` for december).
 * * `@mmmm`: Name for Month (`'January'` for january through `'December'` for december).
 * * `@d`: Day (`'1'` through `'31'`).
 * * `@dd`: Day with leading zero (`'01'` through `'31'`).
 * * `@ddd`: Short weekday name (`'Sun'` for sunday through `'Sat'` for saturday).
 * * `@dddd`: Weekday name (`'Sunday'` for sunday through `'Saturday'` for saturday).
 * * `@w`: Week number on the year.
 * * `@h`: 24-Hour format (`'0'` through `'23'`).
 * * `@hh`: 24-Hour format with leading zero (`'00'` through `'23'`).
 * * `@o`: 12-Hour format (`'1'` through `'12'`).
 * * `@oo`: 12-Hour format with leading zero (`'01'` through `'12'`).
 * * `@i`: Minute (`'0'` through `'59'`).
 * * `@ii`: Minute with leading zero (`'00'` through `'59'`).
 * * `@s`: Second one digit (`0` through `59`).
 * * `@ss`: Second with leading zero (`'00'` through `'59'`).
 * * `@l`: Millisecond one digit (`'0'` through `'999'`).
 * * `@ll`: Millisecond with leading zero (`'00'` through `'999'`).
 * * `@lll`: Millisecond with leading zero (`'000'` through `'999'`).
 * * `@e`: 12-Hour format symbol (`'a'` and `'p'`).
 * * `@ee`: 12-Hour format symbol (`'am'` and `'pm'`).
 * * `@eee`: 12-Hour format symbol (`'a.m.'` and `'p.m.'`).
 * * `@E`: 12-Hour format symbol (`'A'` and `'P'`).
 * * `@EE`: 12-Hour format symbol (`'AM'` and `'PM'`).
 * * `@EEE`: 12-Hour format symbol (`'A.M.'` and `'P.M.'`).
 * @param language Indicate the language. If it isn't provided, it will use the `GlobalLanguage`.
 * @returns Formatted date on string.
 */
export const format = (date: Date, mask = '@y-@mm-@dd @hh:@ii:@ss.@lll', language?: PLanguages): string => {
	if (!language) language = globalLanguage
	const hours = date.getHours()
	const hours12 = (hours % 12) || 12
	const pm = hours >= 12
	if (isNaN(date.getTime())) return ''
	return mask
		.replace(/@y/g, date.getFullYear().toString())
		.replace(/@mmmm/g, monthName(date, false, language))
		.replace(/@mmm/g, monthName(date, true, language))
		.replace(/@mm/g, padLeft(date.getMonth() + 1, 2, "0"))
		.replace(/@m/g, (date.getMonth() + 1).toString())
		.replace(/@dddd/g, weekdayName(date, false, language))
		.replace(/@ddd/g, weekdayName(date, true, language))
		.replace(/@dd/g, padLeft(date.getDate(), 2))
		.replace(/@d/g, date.getDate().toString())
		/* 24 horas */
		.replace(/@hh/g, padLeft(date.getHours(), 2))
		.replace(/@h/g, date.getHours().toString())
		/* 12 horas */
		.replace(/@oo/g, padLeft(hours12, 2))
		.replace(/@o/g, hours.toString())
		.replace(/@ii/g, padLeft(date.getMinutes(), 2))
		.replace(/@i/g, date.getMinutes().toString())
		.replace(/@ss/g, padLeft(date.getSeconds(), 2))
		.replace(/@s/g, date.getSeconds().toString())
		.replace(/@lll/g, padLeft(date.getMilliseconds(), 3))
		.replace(/@ll/g, padLeft(date.getMilliseconds(), 2))
		.replace(/@l/g, date.getMilliseconds().toString())
		.replace(/@w/g, getWeek(date).toString())
		.replace(/@eee/g, pm ? 'p.m.' : 'a.m.')
		.replace(/@ee/g, pm ? 'pm' : 'am')
		.replace(/@e/g, pm ? 'p' : 'a')
		.replace(/@EEE/g, pm ? 'P.M.' : 'A.M.')
		.replace(/@EE/g, pm ? 'PM' : 'AM')
		.replace(/@E/g, pm ? 'P' : 'A')
}