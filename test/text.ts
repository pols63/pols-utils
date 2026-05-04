import { PBase64 } from '../src/pbase64'

const base64 = PBase64.fromText('texto de prueba')
console.log(base64.content)
console.log(base64.toString())