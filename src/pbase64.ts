export class PBase64 {
	mimeType = 'application/octet-stream'
	content?: string
	padding = 0
	get size() {
		if (!this.content) return
		return this.content.length * 3 / 4 - this.padding
	}
	get isInvalid() {
		return !this.content
	}

	constructor(value: string) {
		const matchess = value.match(/^(data:(.*?);base64,)?((.*?)(=*))$/)
		if (!matchess) return
		this.mimeType = matchess[2] ?? this.mimeType
		this.content = matchess[3]
		this.padding = matchess[5].length ?? this.padding
	}

	toBuffer() {
		if (this.isInvalid) throw new Error(`El contenido no corresponde a una cadena Base64`)
		return Buffer.from(this.content, 'base64')
	}

	toString(encode: BufferEncoding = 'utf-8') {
		if (this.isInvalid) return ''
		return Buffer.from(this.content, 'base64').toString(encode)
	}
}