export class PBase64 {
	type = 'application/octet-stream'
	content?: string
	padding = 0
	get size() {
		if (!this.content) return
		return this.content.length * 3 / 4 - this.padding
	}

	constructor(value: string) {
		const matchess = value.match(/^(data:(.*?);base64,)?((.*?)(=*))$/)
		if (!matchess) return
		this.type = matchess[2] ?? this.type
		this.content = matchess[3]
		this.padding = matchess[5].length ?? this.padding
	}
}