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

export const monthName = (monthNumber: number, shortName = false, language = PLanguages.SPANISH): string => {
	const monthName = MONTHS[language]?.[Math.abs(monthNumber - 1) % 12]
	if (!monthName) return ''
	return shortName ? monthName.substring(0, 3) : monthName
}

export const dayName = (dayNumber: number, shortName = false, language = PLanguages.SPANISH): string => {
	const dayName = DAYS[language]?.[Math.abs(dayNumber) % 7]
	if (!dayName) return ''
	return shortName ? dayName.substring(0, 3) : dayName
}

export const getWeek = (date: Date): number => {
	const onejan = new Date(date.getFullYear(), 0, 1)
	return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
}

export const format: {
	(date: Date, mask?: string, language?: PLanguages): string
	language?: PLanguages.SPANISH
} = (date: Date, mask = '@y-@mm-@dd @hh:@ii:@ss.@lll', language): string => {
	if (!language) language = format.language
	const hours = date.getHours()
	const hours12 = (hours % 12) || 12
	const pm = hours >= 12
	if (isNaN(date.getTime())) return ''
	return mask
		.replace(/@y/g, date.getFullYear().toString())
		.replace(/@mmmm/g, monthName(date.getMonth() + 1, false, language))
		.replace(/@mmm/g, monthName(date.getMonth() + 1, true, language))
		.replace(/@mm/g, padLeft(date.getMonth() + 1, 2, "0"))
		.replace(/@m/g, (date.getMonth() + 1).toString())
		.replace(/@dddd/g, dayName(date.getDay(), false, language))
		.replace(/@ddd/g, dayName(date.getDay(), true, language))
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
format.language = PLanguages.SPANISH