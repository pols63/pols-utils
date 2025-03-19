import mimeTypes from 'mime-types'
import fs from 'fs'

const DEFAULT_MIME_TYPE = 'application/octet-stream'

/**
 * Manage a Base64 string.
 * @example Create a instance from a Base64 string.
 * ```javascript
 * import { PBase64 } from 'pols-utils'
 * const mybase64 = PBase64.fromBase64String('data:image/png;base64,examplecode=')
 * console.log(mybase64.mimeType) // 'image/png'
 * console.log(mybase64.size) // Size of image in bytes
 * console.log(mybase64.content) // 'examplecode'
 * ```
 * @example Create a instance from a file.
 * ```javascript
 * import { PBase64 } from 'pols-utils'
 * PBase64.fromFile('file/location.any').then(mybase64 => {
 *     console.log(mybase64.mimeType) // Mime type based in the file name. 'application/octet-stream' by default.
 *     console.log(mybase64.size) // Size of file in bytes
 *     console.log(mybase64.content) // File content at Base64 string
 * })
 * ```
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
	static fromBase64String(value: string) {
		const pBase64 = new PBase64
		const matchess = value.match(/^(data:(.*?);base64,)?((.*?)(=*))$/)
		if (!matchess) return
		pBase64.mimeType = matchess[2] ?? DEFAULT_MIME_TYPE
		pBase64._content = matchess[3]
		pBase64.padding = matchess[5].length ?? pBase64.padding
		return pBase64
	}

	/**
	 * Set the content from a file. Extract the content and encode to Base64.
	 * @param fileLocation File location.
	 * @returns 
	 */
	static fromFile(fileLocation: string): Promise<PBase64> {
		return new Promise((resolve, reject) => {
			const stream = fs.createReadStream(fileLocation, { encoding: 'base64' })
			let base64String = ''

			stream.on('data', chunk => (base64String += chunk))
			stream.on('end', () => {
				const pBase64 = this.fromBase64String(base64String)
				pBase64.mimeType = mimeTypes.lookup(fileLocation) || DEFAULT_MIME_TYPE
				resolve(pBase64)
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