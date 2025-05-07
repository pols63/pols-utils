export type PEncodingType = "utf-8" | "utf-16le" | "utf-16be" | "iso-8859-1" | "windows-1252"

/**
 * Converts an `ArrayBuffer` to a string using the specified encoding.
 * 
 * @param data The `ArrayBuffer` to convert.
 * @param encode The character encoding to use. Supported values: `"utf-8"`, `"utf-16le"`, `"utf-16be"`, `"iso-8859-1"`, or `"windows-1252"`. Defaults to `"utf-8"`.
 * @returns The decoded string.
 */
export const toString = (data: ArrayBuffer, encode: PEncodingType = 'utf-8') => new TextDecoder(encode).decode(new Uint8Array(data))