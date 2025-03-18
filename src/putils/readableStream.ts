import stream from 'stream'

export const isReadableSream = (value: unknown): value is stream.Readable => {
	return (
		typeof value === 'object'
		&& value !== null
		&& 'getReader' in value && typeof value.getReader == 'function'
		&& 'on' in value && typeof value.on == 'function'
		&& 'locked' in value && typeof value.locked == 'function'
	)
}

export const toString = (readableStream: stream.Readable, encoding?: 'base64'): Promise<string> => {
	const chunks: Uint8Array[] = []

	return new Promise((resolve, reject) => {
		readableStream.on('data', chunk => {
			chunks.push(chunk)
		})

		readableStream.on('end', () => {
			const text = Buffer.concat(chunks).toString()
			if (encoding == 'base64') {
				resolve(Buffer.from(text).toString('base64'))
			} else {
				resolve(text)
			}
		})

		readableStream.on('error', reject)
	})
}

export const toArrayBuffer = (readableStream: stream.Readable): Promise<ArrayBuffer> => {
	const chunks: Buffer[] = []

	return new Promise((resolve, reject) => {
		readableStream.on('data', chunk => {
			chunks.push(chunk)
		})

		readableStream.on('end', () => {
			const buffer = Buffer.concat(chunks)
			resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
		})

		readableStream.on('error', reject)
	})
}