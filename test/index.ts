import { PLanguages } from '../src/constants'
import { write } from '../src/putils/number'

const test = (expected: any, fn: any) => {
	const value = fn()
	const result = expected === value
	console.log(
		result ? '✔' : '❌',
		`${expected} ${result ? '==' : '!='} ${fn.toString()}`,
		'|',
		value
	)
}

test('ONE', () => write(1))
test('SEVEN', () => write(7))
test('TEN', () => write(10))
test('FIFTEEN', () => write(15))
test('SIXTY TWO', () => write(62))
test('ONE HUNDRED', () => write(100))
test('ONE HUNDRED SIXTY TWO', () => write(162))
test('FOUR HUNDRED FIVE', () => write(405))
test('NINE HUNDRED NINETY NINE', () => write(999))
test('ONE THOUSAND', () => write(1000))
test('ONE THOUSAND TWENTY SIX', () => write(1026))
test('ONE THOUSAND TWO HUNDRED EIGHT', () => write(1208))
test('TWO THOUSAND TWO HUNDRED EIGHT', () => write(2208))
test('TWO MILLION TWO HUNDRED EIGHT', () => write(2000208))

test('UNO', () => write(1, { language: PLanguages.SPANISH }))
test('SIETE', () => write(7, { language: PLanguages.SPANISH }))
test('DIEZ', () => write(10, { language: PLanguages.SPANISH }))
test('QUINCE', () => write(15, { language: PLanguages.SPANISH }))
test('VEINTI TRES', () => write(23, { language: PLanguages.SPANISH }))
test('SESENTA Y DOS', () => write(62, { language: PLanguages.SPANISH }))
test('CIEN', () => write(100, { language: PLanguages.SPANISH }))
test('CIENTO SESENTA Y DOS', () => write(162, { language: PLanguages.SPANISH }))
test('CUATROCIENTOS CINCO', () => write(405, { language: PLanguages.SPANISH }))
test('NOVECIENTOS NOVENTA Y NUEVE', () => write(999, { language: PLanguages.SPANISH }))
test('MIL', () => write(1000, { language: PLanguages.SPANISH }))
test('MIL VEINTI SEIS', () => write(1026, { language: PLanguages.SPANISH }))
test('MIL DOCIENTOS OCHO', () => write(1208, { language: PLanguages.SPANISH }))
test('DOS MIL DOCIENTOS OCHO', () => write(2208, { language: PLanguages.SPANISH }))
test('QUINCE MIL DOCIENTOS OCHO', () => write(15208, { language: PLanguages.SPANISH }))
test('DOS MILLONES DOCIENTOS OCHO', () => write(2000208, { language: PLanguages.SPANISH }))