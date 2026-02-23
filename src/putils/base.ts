export const coalesce = (...args: unknown[]) => {
	return args.find(v => v) ?? null
}