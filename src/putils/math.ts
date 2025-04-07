const referencePattern = /\$\b[a-z]+?[a-z0-9]*\b/gi

export type PFormulaParameters = Record<string, string | number>

/* Reemplaza las referencias por los valores entregados en los parámetros */
const replaceRefereces = (toEval: string, parameters: PFormulaParameters) => {
	const references = toEval.match(referencePattern)
	if (references) {
		for (const reference of references) {
			const propertyName = reference.substring(1)
			toEval = toEval.replace(new RegExp(`\\${reference}`, 'g'), parameters?.[propertyName]?.toString().trim() || '0')
		}
		toEval = replaceRefereces(toEval, parameters)
	} else {
		return toEval
	}
	return toEval
}

const tree = (mainBranch: string, branch: string, whoCalls: Record<string, string[]>) => {
	const references = whoCalls[branch]
	if (references.includes(mainBranch)) return true
	let cycling = false
	for (const reference of references) {
		cycling = tree(mainBranch, reference, whoCalls)
	}
	return cycling
}

/**
 * Eval the formula string passed in `toEval`.
 * @param toEval String formula to evaluate.
 * @param parameters 
 * @returns 
 */
export const formula = (toEval: string, parameters?: PFormulaParameters) => {
	if (parameters) {
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
		parameters = neoParameters

		/* Evalúa si los parámetros tienen referencias cíclicas */
		const whoCalls: Record<string, string[]> = {}
		for (const propertyName in parameters) {
			const cycling = tree(propertyName, propertyName, whoCalls)
			if (cycling) throw new Error(`Cyclical reference for ${propertyName}`)
		}

		/*
		{
			uno: '$dos',
			dos: '$tres $cuatro',
			tres: '$uno $cuatro',
			cuatro: ''
		}
		*/
	}

	const keywords = {
		avg: (...values: number[]) => values.reduce((ac, value) => ac + value, 0) / values.length,
		pow: Math.pow,
		e: () => Math.E,
		pi: () => Math.PI,
	}

	/* Busca las referencias y las reemplaza */
	toEval = replaceRefereces(toEval, parameters)

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