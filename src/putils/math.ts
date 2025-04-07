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
	if (!references) return false
	if (references.includes(mainBranch)) return true
	let cycling = false
	for (const reference of references) {
		cycling = tree(mainBranch, reference, whoCalls)
		if (cycling) break
	}
	return cycling
}

const math = {
	avg: (...values: number[]) => values.reduce((ac, value) => ac + value, 0) / values.length,
	pow: Math.pow,
	e: () => Math.E,
	pi: () => Math.PI,
}
const keywords = Object.keys(math)

/**
 * Evaluates a mathematical expression given as a string.
 * Supports the use of parameter placeholders (prefixed with `$`), which are replaced with values from the `parameters` object before evaluation.
 *
 * You can use numbers, placeholders, and the following functions within the expression:
 * * `avg(p1, p2, ...)`: Returns the average of the given numbers.
 * * `pow(p1, p2)`: Returns the result of raising `p1` to the power of `p2`.
 * * `pi()`: Returns the value of PI.
 * * `e()`: Returns the value of Euler's number (e).
 * @param toEval The formula string to evaluate. Placeholders must be in the form of `$paramName`.
 * @param parameters An optional object containing values to replace placeholders in the formula.
 * @returns The results of the evaluated formula.
 * @example
 * ```javascript
 * console.log(PUtilsMath.formula('1 + 2')) // 3
 * console.log(PUtilsMath.formula('5 * 6')) // 30
 * console.log(PUtilsMath.formula('$one + 10', { one: 3 })) // 13
 * console.log(PUtilsMath.formula('$one + $two', { one: 5, two: '$one' })) // 10
 * console.log(PUtilsMath.formula('pi() + 1')) // 4.1416...
 * ```
 */
export const formula = (toEval: string, parameters?: PFormulaParameters): {
	formula: string
	result: number
} => {
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
			const value = parameters[propertyName]
			if (typeof value != 'string') continue
			const references = value.match(referencePattern)
			if (!references) continue
			whoCalls[propertyName] = references.map(reference => reference.substring(1))
		}
		for (const propertyName in whoCalls) {
			const cycling = tree(propertyName, propertyName, whoCalls)
			if (cycling) throw new Error(`Cyclical reference for "${propertyName}"`)
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

	/* Busca las referencias y las reemplaza */
	toEval = replaceRefereces(toEval, parameters)

	/* Busca todos los tokens */
	const tokens = new Set(toEval.match(/\b[a-z]+?[a-z0-9]*\b\(/ig) ?? [])

	if (tokens.size) {
		for (let token of Array.from(tokens)) {
			token = token.substring(0, token.length - 1).toLowerCase()
			if (!keywords.includes(token)) throw new Error(`The function '${token}' doesn't exists`)
			toEval = toEval.replace(new RegExp(token, 'ig'), `keywords.${token}`)
		}
	}

	try {
		const result = new Function(`return ${toEval}`)()
		return {
			formula: toEval,
			result: (isNaN(result) && typeof result !== 'string') ? null : result
		}
	} catch {
		throw new Error(`Can't eval "${toEval}"`)
	}
}