import stream from 'stream'

/**
 * Converts a string into a `ReadableStream`. 
 * @param value The target string.
 * @param encoding The encoding format. Can be either `'base64'` and `'utf-8'`. Defaults to `'utf-8'`.
 * @returns A `ReadableStream` representation of the string.
 */
export const toReadableStream = (value: string, encoding: 'utf-8' | 'base64' = 'utf-8') => {
	const readableStream = new stream.Readable
	switch (encoding) {
		case 'utf-8':
			readableStream.push(value)
			break
		case 'base64':
			readableStream.push(Buffer.from(value, 'base64'))
			break
	}
	readableStream.push(null)
	return readableStream
}

export * from './string.browser'