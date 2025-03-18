type EncodingType = "utf-8" | "utf-16le" | "utf-16be" | "iso-8859-1" | "windows-1252"

export const toString = (data: ArrayBuffer, encode: EncodingType = 'utf-8') => new TextDecoder(encode).decode(new Uint8Array(data))