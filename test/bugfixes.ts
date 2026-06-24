import { PUtilsArray, PUtilsDate, PUtilsNumber, PUtilsString, PUtilsRS, PUtilsMath, PLanguages } from '../src/index'
import { Readable } from 'stream'

console.log('=== RUNNING BUGFIX & REFACTOR VERIFICATION ===')

// Helper assert function
const assert = (name: string, condition: boolean, extraInfo?: any) => {
	console.log(condition ? '✔' : '❌', name, extraInfo ? `| ${JSON.stringify(extraInfo)}` : '')
	if (!condition) {
		console.error(`Assertion failed for: ${name}`)
		process.exit(1)
	}
}

// 1. Swap with falsy value
const arr1 = [1, 0, 3]
PUtilsArray.swap(arr1, 0, 1)
assert('PUtilsArray.swap handles falsy values correctly', arr1[0] === 0 && arr1[1] === 1 && arr1[2] === 3, arr1)

// 2. Extract infinite loop prevention
const arr2: any[] = [1, { type: 'dog', name: 'Fido' }, 2]
const extracted = PUtilsArray.extract(arr2, { type: 'dog' }) as any[]
assert('PUtilsArray.extract handles non-object elements without infinite looping', extracted.length === 1 && extracted[0].name === 'Fido', { extracted, remaining: arr2 })

// 3. Compare with 'in' condition
const compareResultTrue = PUtilsNumber.compare(45, { in: [30, 40, 45, 50] })
const compareResultFalse = PUtilsNumber.compare(99, { in: [30, 40, 45, 50] })
assert('PUtilsNumber.compare with "in" matching value returns true', compareResultTrue === true)
assert('PUtilsNumber.compare with "in" non-matching value returns false', compareResultFalse === false)

// 4. weekdayName matching Sunday correctly
const sunday = new Date('2026-06-21T12:00:00') // June 21, 2026 is Sunday
const dayNameES = PUtilsDate.weekdayName(sunday, false, PLanguages.SPANISH)
const dayNameEN = PUtilsDate.weekdayName(sunday, false, PLanguages.ENGLISH)
assert('PUtilsDate.weekdayName Sunday returns domingo in Spanish', dayNameES === 'domingo', dayNameES)
assert('PUtilsDate.weekdayName Sunday returns sunday in English', dayNameEN === 'sunday', dayNameEN)

// 5. isReadableStream logic for Node stream
const nodeStream = new Readable({ read() {} })
const checkNodeStream = PUtilsRS.isReadableStream(nodeStream)
assert('PUtilsRS.isReadableStream returns true for Node Readable stream', checkNodeStream === true)

// 6. withoutAccentMark using NFD normalization
const accentedText = 'áéíóúÁÉÍÓÚ'
const cleanedText = PUtilsString.withoutAccentMark(accentedText)
assert('PUtilsString.withoutAccentMark removes all accents using normalization', cleanedText === 'aeiouAEIOU', cleanedText)

// 7. Math formula security and keyword resolution
const formulaResult = PUtilsMath.formula('pow(2, 3)')
assert('PUtilsMath.formula resolves keywords correctly', formulaResult.result === 8, formulaResult)

try {
	PUtilsMath.formula('""["constructor"]("console.log(1)")()')
	assert('PUtilsMath.formula RCE check', false, 'RCE not blocked')
} catch (e: any) {
	assert('PUtilsMath.formula blocks RCE successfully', e.message === 'Invalid characters in formula', e.message)
}

console.log('=== ALL BUGFIX VERIFICATIONS PASSED SUCCESSFULLY ===')
