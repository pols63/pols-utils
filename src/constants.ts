export type PRecord<T = unknown> = Record<string | number | symbol, T>

export enum PLanguages {
	SPANISH = 'SPANISH',
	ENSHIGL = 'ENGLISH',
}

export const DAYS: Record<PLanguages, string[]> = {
	SPANISH: ['lunes', 'martes', 'mierrcoles', 'jueves', 'viernes', 'sabado', 'domingo'],
	ENGLISH: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
}

export const MONTHS: Record<PLanguages, string[]> = {
	SPANISH: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
	ENGLISH: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
}