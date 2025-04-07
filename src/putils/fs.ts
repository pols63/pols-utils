import fs from 'fs'

/**
 * Check if a directory exists.
 * @param location String path location.
 * @returns `true` is the directory exists, otherwise `false`.
 */
export const existsDirectory = (location: string): boolean => {
	if (!fs.existsSync(location)) return false
	const stats = fs.statSync(location)
	return stats.isDirectory()
}

/**
 * Check if a file exists.
 * @param location String path location.
 * @returns `true` is the file exists, otherwise `false`.
 */
export const existsFile = (location: string): boolean => {
	if (!fs.existsSync(location)) return false
	const stats = fs.statSync(location)
	return stats.isFile()
}