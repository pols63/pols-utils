import fs from 'fs'

/**
 * Check if a directory exists.
 * @param location String path location.
 * @returns `true` is the directory exists, otherwise `false`.
 */
export const existsDirectory = (location: string): boolean => {
	try {
		return fs.statSync(location).isDirectory()
	} catch {
		return false
	}
}

/**
 * Check if a file exists.
 * @param location String path location.
 * @returns `true` is the file exists, otherwise `false`.
 */
export const existsFile = (location: string): boolean => {
	try {
		return fs.statSync(location).isFile()
	} catch {
		return false
	}
}