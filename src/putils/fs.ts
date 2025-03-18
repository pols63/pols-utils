import fs from 'fs'

export const existsDirectory = (filePath: string): boolean => {
	if (!fs.existsSync(filePath)) return false
	const stats = fs.statSync(filePath)
	return stats.isDirectory()
}

export const existsFile = (filePath: string): boolean => {
	if (!fs.existsSync(filePath)) return false
	const stats = fs.statSync(filePath)
	return stats.isFile()
}