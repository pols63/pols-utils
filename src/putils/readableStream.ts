import stream from 'stream'

export const isReadableStream = (value: unknown): value is stream.Readable => {
	if (typeof value !== 'object' || value === null) return false
	const isNodeStream = 'on' in value && typeof (value as any).on === 'function' && 'pipe' in value && typeof (value as any).pipe === 'function'
	const isWebStream = 'getReader' in value && typeof (value as any).getReader === 'function' && 'locked' in value
	return isNodeStream || isWebStream
}

export const toString = (readableStream: stream.Readable, encoding?: 'base64'): Promise<string> => {
	const chunks: Uint8Array[] = []

	return new Promise((resolve, reject) => {
		readableStream.on('data', chunk => {
			chunks.push(chunk)
		})

		readableStream.on('end', () => {
			const buffer = Buffer.concat(chunks)
			if (encoding == 'base64') {
				resolve(buffer.toString('base64'))
			} else {
				resolve(buffer.toString('utf8'))
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