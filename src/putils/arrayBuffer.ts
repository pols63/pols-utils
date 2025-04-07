export type PEncodingType = "utf-8" | "utf-16le" | "utf-16be" | "iso-8859-1" | "windows-1252"

/**
 * Transform a array buffer to string.
 * @param data Array buffer data.
 * @param encode Encode type: `"utf-8" | "utf-16le" | "utf-16be" | "iso-8859-1" | "windows-1252"`. `utf-8` by default.
 * @returns The converted string.
 */
export const toString = (data: ArrayBuffer, encode: PEncodingType = 'utf-8') => new TextDecoder(encode).decode(new Uint8Array(data))