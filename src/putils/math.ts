export const formula = (toEval: string, parameters: Record<string, string | number>) => {
	if (parameters) {
		parameters = (() => {
			const neoParameters: typeof parameters = {}
			for (const propertyName in parameters) {
				let value = parameters[propertyName]
				switch (typeof value) {
					case 'string':
						value = value.trim()
						if (!value) {
							neoParameters[propertyName] = 0
						} else {
							const num = Number(value)
							neoParameters[propertyName] = isNaN(num) ? value : num
						}
						break
					case 'number':
						neoParameters[propertyName] = value
						break
					default:
						neoParameters[propertyName] = 0
						break
				}
			}
			return neoParameters
		})()
	}
	if (typeof toEval !== 'string') throw new Error(`El primer parámetro debe ser de tipo 'string'`)
	const keywords = {
		avg: (...values: number[]) => values.reduce((ac, value) => ac + value, 0) / values.length,
		pow: Math.pow,
		e: () => Math.E,
		pi: () => Math.PI,
	}

	const patronDeReferencias = /\$\b[a-zA-Z]+?[a-zA-Z0-9]*\b/g

	/* Función que se utilizará de forma recursiva */
	const replaceRefereces = (references: string[] | null) => {
		if (references == null) return
		for (const reference of references) {
			const propertyName = reference.substring(1)
			toEval = toEval.replace(new RegExp(`\\${reference}`, 'g'), parameters?.[propertyName]?.toString().trim() || '0')
		}
		references = toEval.match(patronDeReferencias)
		if (references) replaceRefereces(references)
	}

	/* Busca las referencias */
	const references = toEval.match(patronDeReferencias)

	/* Sustituye las referencias con los parámetros */
	if (references) replaceRefereces(references)

	/* Busca todos los tokens */
	const tokens = new Set(toEval.match(/\b[a-z]+?[a-z0-9]*\b\(/ig) ?? [])

	if (tokens.size) {
		for (let token of Array.from(tokens)) {
			token = token.substring(0, token.length - 1).toLowerCase()
			if (!(token in keywords)) throw new Error(`No existe la función '${token}'`)
			toEval = toEval.replace(new RegExp(token, 'ig'), `keywords.${token}`)
		}
	}

	const result = new Function(toEval)()
	return (isNaN(result) && typeof result !== 'string') ? null : result
}