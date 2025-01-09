import fs from 'fs'
import path from 'path'
import { URecord } from "./types"
import { PUtils } from './index'

type Themes = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEBUG' | 'SYSTEM'

export type PLoggerParams = {
	label: string
	description?: string
	body?: string | URecord | unknown[]
	date?: Date
	exit?: boolean
	showInConsole?: boolean
	logPath?: string
}

const logger = (theme: Themes, { label, description, body, exit = false, showInConsole, logPath }: PLoggerParams) => {
	const now = new Date
	const nowString = PUtils.Date.format(now, '@dd/@mm/@y @hh:@ii:@ss.@lll')

	const headers: string[] = [`[${theme}]`, nowString, '::', label]
	if (description) headers.push('::', description)

	const textBody: string[] = []
	if (body instanceof Array) {
		textBody.push(...body.map(b => {
			if (b instanceof Error) {
				return [
					'Error: ' + b.message,
					b.stack.replace(/^Error.*?\n/, '')
				]
			} else if (typeof b == 'string') {
				return b
			} else if (typeof b == 'number') {
				return b.toString()
			} else if (b == null) {
				return ''
			} else {
				b.toString()
			}
		}).flat())
	} else if (body instanceof Error) {
		textBody.push(
			'Error: ' + body.message,
			body.stack.replace(/^Error.*?\n/, '')
		)
	} else if (typeof body == 'string') {
		textBody.push(body)
	}

	/* Mensaje en consola */
	if (showInConsole) {
		if (theme == 'ERROR') {
			console.error(headers.join(' '))
			if (textBody.length) console.error(textBody.join('\n'))
		} else {
			console.log(headers.join(' '))
			if (textBody.length) console.log(textBody.join('\n'))
		}
	}

	/* Mensaje en archivo */
	if (logPath) {
		if (!fs.existsSync(logPath)) {
			/* Si no existe la carpeta para los logs, se intentará crear automáticamente */
			try {
				fs.mkdirSync(logPath, { recursive: true })
			} catch (error) {
				logger('ERROR', { label: 'LOG', description: `Ocurrió un error al intentar crear el directorio para los logs del sistema en '${logPath}'`, body: error, exit: true, showInConsole: true })
			}
		}

		const filePath = path.join(logPath, `LOGS ${PUtils.Date.format(now, '@y-@mm-@dd')}.log`)
		try {
			if (logPath) fs.appendFileSync(filePath, `${headers.join(' ')}\n${textBody.join('\n')}\n`, { encoding: 'utf-8' })
		} catch (error) {
			logger('ERROR', { label: 'LOG', description: `Ocurrió un error al intentar registrar una entrada en el archivo '${filePath}'`, body: error, exit: true, showInConsole: true })
		}
	}

	/* Si se ha dado la opción, se sale del programa */
	if (exit) process.exit()
}

export const PLogger = {
	info: (params: PLoggerParams) => logger('INFO', params),
	success: (params: PLoggerParams) => logger('SUCCESS', params),
	warning: (params: PLoggerParams) => logger('WARNING', params),
	error: (params: PLoggerParams) => logger('ERROR', params),
	debug: (params: PLoggerParams) => logger('DEBUG', params),
	system: (params: PLoggerParams) => logger('SYSTEM', params),
}