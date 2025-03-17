import fs from 'fs'

const DEFAULT_MIME_TYPE = 'application/octet-stream'

/**
 * Manage a base64 value
 */
export class PBase64 {
	/** Get the mime type if the value. If it was set from a file content, the `mimeType` prop get `'application/octet-stream'` value. */
	mimeType = DEFAULT_MIME_TYPE

	private _content: string

	/** Get the Base64 string. It represents only the content. Data URI will be ignored. */
	get content() {
		return this._content
	}

	private padding = 0

	/** Represent the size in bytes of the buffer resulting from decoding the Base64 string. It correspond to the original contentsize before encoding. */
	get size() {
		if (!this.content) return
		return this.content.length * 3 / 4 - this.padding
	}

	/** Get if the content is invalid. */
	get isInvalid() {
		return !this.content
	}

	/**
	 * Set the content from a Base64 string. The mime type extract from the data URI. If it not exists, the mime type will be `'application/octet-stream'`.
	 * @param value The Base64 string.
	 * @returns 
	 */
	fromBase64String(value: string) {
		const matchess = value.match(/^(data:(.*?);base64,)?((.*?)(=*))$/)
		if (!matchess) return
		this.mimeType = matchess[2] ?? DEFAULT_MIME_TYPE
		this._content = matchess[3]
		this.padding = matchess[5].length ?? this.padding
	}

	/**
	 * Set the content from a file. Extract the content and encode to Base64.
	 * @param fileLocation File location.
	 * @returns 
	 */
	fromFile(fileLocation: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const stream = fs.createReadStream(fileLocation, { encoding: 'base64' })
			let base64String = ''

			stream.on('data', chunk => (base64String += chunk))
			stream.on('end', () => {
				this.fromBase64String(base64String)
				this.mimeType = DEFAULT_MIME_TYPE
				resolve()
			})
			stream.on('error', err => reject(err))
		})
	}

	/**
	 * Convert the content to a Buffer instance.
	 * @returns 
	 */
	toBuffer(): Buffer {
		if (this.isInvalid) throw new Error(`El contenido no corresponde a una cadena Base64`)
		return Buffer.from(this.content, 'base64')
	}

	/**
	 * Convert the content to a decoded string.
	 * @param encode 
	 * @returns 
	 */
	toString(encode: BufferEncoding = 'utf-8') {
		if (this.isInvalid) return ''
		return Buffer.from(this.content, 'base64').toString(encode)
	}
}