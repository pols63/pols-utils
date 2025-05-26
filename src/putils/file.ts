export const toText = (file: File) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader
		fileReader.onload = (event) => {
			resolve(event.target?.result)
		}
		fileReader.onerror = reject
		fileReader.readAsText(file)
	})
}

export const toBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader
		fileReader.onload = (event) => {
			resolve(event.target?.result as string)
		}
		fileReader.onerror = reject
		fileReader.readAsDataURL(file)
	})
}