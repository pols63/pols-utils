import { date_Format } from "./base"
import { Languages } from "./types"

export type PDateParams = string | number | Date | PDate | {
	year?: number
	month?: number
	day?: number
	hour?: number
	minute?: number
	second?: number
	millisecond?: number
}

export class PDate {
	engine?: Date

	get isInvalidDate() {
		return this.engine == null || isNaN(this.engine.getTime())
	}

	get year(): number | undefined {
		return this.engine?.getFullYear()
	}

	set year(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.engine?.setFullYear(value)
	}

	addYear(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.year = (this.year ?? 1) + value
		return this
	}

	get month(): number | undefined {
		if (this.isInvalidDate) return
		return (this.engine?.getMonth() ?? 0) + 1
	}

	addMonth(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.month = (this.month ?? 1) + value
		return this
	}

	set month(value: number) {
		this.engine?.setMonth(value - 1)
	}

	get week() {
		if (this.isInvalidDate) {
			return
		} else {
			const onejan = new Date(this.year ?? 1, 0, 1)
			return Math.ceil((((this.time ?? 0) - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
		}
	}

	get day(): number | undefined {
		return this.engine?.getDate()
	}

	set day(value: number) {
		this.engine?.setDate(value)
	}

	addDay(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.day = (this.day ?? 1) + value
		return this
	}

	get weekDay() {
		return this.engine?.getDay()
	}

	get hour(): number | undefined {
		return this.engine?.getHours()
	}

	addHour(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.hour = (this.hour ?? 0) + value
		return this
	}

	set hour(value: number) {
		this.engine?.setHours(value)
	}

	get minute(): number | undefined {
		return this.engine?.getMinutes()
	}

	set minute(value: number) {
		this.engine?.setMinutes(value)
	}

	addMinute(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.minute = (this.minute ?? 0) + value
		return this
	}

	get second(): number | undefined {
		return this.engine?.getSeconds()
	}

	set second(value: number) {
		this.engine?.setSeconds(value)
	}

	addSecond(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.second = (this.second ?? 0) + value
		return this
	}

	get millisecond(): number | undefined {
		return this.engine?.getMilliseconds()
	}

	set millisecond(value: number) {
		this.engine?.setMilliseconds(value)
	}

	addMillisecond(value: number) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		this.millisecond = (this.millisecond ?? 0) + value
		return this
	}

	get time() {
		return this.engine?.getTime()
	}

	constructor(params?: PDateParams) {
		if (!params) {
			this.engine = new Date
		} else {
			if (typeof params == 'string' || typeof params == 'number' || params instanceof Date || params instanceof PDate) {
				this.setFrom(params)
			} else {
				this.engine = new Date(params.year ?? 1, (params.month ?? 1) - 1, params.day ?? 1, params.hour ?? 0, params.minute ?? 0, params.second ?? 0, params.millisecond ?? 0)
			}
		}
	}

	setFrom(value: string | number | Date | PDate) {
		if (typeof value == 'string') {
			let year: number
			let month: number
			let day: number
			let hours: number
			let minutes: number
			let seconds: number
			let miliseconds: number

			/* Formato estandar yyyy-mm-dd, la hora es opcional */
			let parts = value.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})((T|\s)([0-9]{2}):([0-9]{2}):([0-9]{2})(\.([0-9]{3})Z?)?)$/)
			if (parts) {
				year = Number(parts[1])
				month = Number(parts[2]) - 1
				day = Number(parts[3])
				hours = Number(parts[6] ?? 0)
				minutes = Number(parts[7] ?? 0)
				seconds = Number(parts[8] ?? 0)
				miliseconds = Number(parts[10] ?? 0)
			} else {
				const today = new Date
				/* Formato humano */
				parts = value.match(/^([0-9]{1,2})(\/)?([0-9]{1,2})?\2?([0-9]{1,4})?(\s([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})(\.([0-9]{1,3}))?$|$)/)
				if (parts) {
					day = Number(parts[1])
					month = parts[3] ? (Number(parts[3]) - 1) : today.getMonth()
					year = Number(parts[4] ?? today.getFullYear())
					hours = Number(parts[6] ?? 0)
					minutes = Number(parts[7] ?? 0)
					seconds = Number(parts[8] ?? 0)
					miliseconds = Number(parts[10] ?? 0)
				}
			}

			if (parts) {
				this.engine = new Date(year, month, day, hours, minutes, seconds, miliseconds)
			} else {
				this.engine = undefined
			}
		} else if (typeof value == 'number') {
			this.setFrom(value.toString())
		} else if (value instanceof Date) {
			this.engine = new Date(value)
		} else if (value instanceof PDate) {
			this.engine = value.toDate()
		}
		return this
	}

	setTime(value?: string) {
		if (value != null) {
			const temp = new Date(`${this.toString('@y-@mm-@dd')} ${value}`)
			this.engine = temp
		} else {
			this.clearTime()
		}
		return this
	}

	clearTime() {
		this.engine?.setHours(0)
		this.engine?.setMinutes(0)
		this.engine?.setSeconds(0)
		this.engine?.setMilliseconds(0)
		return this
	}

	daysDifference(other: PDate) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		if (other.isInvalidDate) throw new Error(`El objeto de comparación es un InvalidDate`)
		const ref1 = this.clone().clearTime()
		const ref2 = other.clone().clearTime()
		return Math.ceil(((ref1.time ?? 0) - (ref2.time ?? 0)) / 1000 / 60 / 60 / 24)
	}

	minutesDifference(other: PDate) {
		if (this.isInvalidDate) throw new Error(`Este objeto es un InvalidDate`)
		if (other.isInvalidDate) throw new Error(`El objeto de comparación es un InvalidDate`)
		const ref1 = this.clone()
		ref1.second = 0
		ref1.millisecond = 0
		const ref2 = other.clone()
		ref2.second = 0
		ref2.millisecond = 0
		return Math.ceil(((ref1.time ?? 0) - (ref2.time ?? 0)) / 1000 / 60)
	}

	toString(mask = '@y-@mm-@dd @hh:@ii:@ss.@lll', language: Languages = 'spanish') {
		if (this.isInvalidDate) return ''
		return date_Format(this.engine, mask, language)
	}

	toDate() {
		return new Date(this.engine)
	}

	clone() {
		return new PDate(this.engine)
	}
}