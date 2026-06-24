# pols-utils

Una librería ligera y versátil de funciones de utilidad en TypeScript/JavaScript para agilizar el manejo de datos, formateo y manipulación común en tus aplicaciones. Diseñada para funcionar tanto en Node.js como en navegadores web con el máximo soporte para sacudida de árbol (Tree Shaking).

## Instalación

Instala el paquete usando npm:

```sh
npm install pols-utils
```

---

## Cómo Importar las Utilidades

La librería soporta dos estilos de importación según tus preferencias:

### 1. Importación Directa de Funciones (Recomendado)
Importa solo las funciones individuales que necesites para reducir el tamaño final de tu aplicación al máximo:

```javascript
import { swap, write, format, capitalize } from 'pols-utils'

const items = [1, 2, 3]
swap(items, 0, 2) // [3, 2, 1]

console.log(write(125)) // "ONE HUNDRED TWENTY FIVE"
```

### 2. Importación por Categorías (Namespaces)
Si prefieres mantener tu código organizado por áreas o evitar colisiones de nombres con tus propias variables:

```javascript
import { PUtilsArray, PUtilsNumber, PUtilsDate } from 'pols-utils'

PUtilsArray.swap(items, 0, 2)
console.log(PUtilsNumber.write(125))
```

---

## Referencia de la API

### 1. Arreglos (`PUtilsArray`)

#### `swap(array, originIndex, destinationIndex)`
Intercambia la posición de dos elementos en un arreglo de forma segura e inmune a valores *falsy*.
```javascript
const miArray = [1, 0, 3]
swap(miArray, 0, 1) // [0, 1, 3]
```

#### `moveItem(array, originIndex, destinationIndex)`
Mueve un elemento de una posición a otra dentro del arreglo.
```javascript
moveItem([10, 20, 30, 40], 1, 3) // [10, 30, 40, 20]
```

#### `filter(array, logicalSelector, transform?)`
Filtra elementos que coincidan con un selector lógico (objeto de comparación con soporte de RegExp, o una función de predicado) y opcionalmente los transforma.
```javascript
const mascotas = [
  { tipo: 'perro', nombre: 'Fido' },
  { tipo: 'gato', nombre: 'Night' }
]
// Filtrar por propiedad
const perros = filter(mascotas, { tipo: 'perro' })
// Filtrar con transformación
const nombresPerros = filter(mascotas, { tipo: 'perro' }, pet => pet.nombre.toUpperCase()) // ['FIDO']
```

#### `filterOne(array, logicalSelector, transform?)`
Encuentra el primer elemento que coincide con el selector lógico. Usa `findIndex` optimizado internamente.
```javascript
const primerPerro = filterOne(mascotas, { tipo: 'perro' }) // { tipo: 'perro', nombre: 'Fido' }
```

#### `extract(array, logicalSelector, transform?)`
Filtra, remueve del arreglo original y retorna los elementos que coinciden con el selector.
```javascript
const perrosExtraidos = extract(mascotas, { tipo: 'perro' })
console.log(mascotas) // [{ tipo: 'gato', nombre: 'Night' }] (Mutado)
```

#### `extractOne(array, logicalSelector, transform?)`
Remueve y retorna el primer elemento que coincide con el selector.
```javascript
const perroExtraido = extractOne(mascotas, { tipo: 'perro' })
```

#### `groupBy(array, keySelector, transform?)`
Agrupa los elementos del arreglo según la clave generada por el callback.
```javascript
groupBy(mascotas, pet => pet.tipo)
// { perro: [...], gato: [...] }
```

#### `chunks(array, size)`
Divide un arreglo en sub-arreglos (chunks) del tamaño especificado.
```javascript
chunks([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
```

#### `distinct(array)`
Retorna un nuevo arreglo sin elementos duplicados utilizando la sintaxis de propagación de un Set nativo.
```javascript
distinct([1, 1, 2, 3, 3]) // [1, 2, 3]
```

---

### 2. Fechas (`PUtilsDate`)

#### `format(date, mask?, language?)`
Formatea una fecha utilizando una máscara personalizada de caracteres. Soporta comodines eficientes analizados en una sola pasada de regex.
```javascript
format(new Date(), '@y-@mm-@dd @hh:@ii:@ss') // "2026-06-24 09:30:15"
```
**Comodines principales:**
*   `@y` : Año completo (ej. 2026)
*   `@mmmm` / `@mmm` : Nombre del mes completo / abreviado
*   `@mm` / `@m` : Número de mes con / sin cero inicial
*   `@dddd` / `@ddd` : Nombre del día de la semana completo / abreviado
*   `@dd` / `@d` : Día del mes con / sin cero inicial
*   `@hh` / `@h` : Hora en formato de 24 horas con / sin cero inicial
*   `@oo` / `@o` : Hora en formato de 12 horas con / sin cero inicial
*   `@ii` / `@i` : Minutos
*   `@ss` / `@s` : Segundos
*   `@lll` / `@ll` / `@l` : Milisegundos
*   `@ee` / `@EE` : Indicador a.m./p.m. (minúscula / mayúscula)

#### `monthName(date | monthNumber, shortName?, language?)`
Retorna el nombre del mes correspondiente (1 a 12 o desde una instancia de Date).
```javascript
monthName(3, false, PLanguages.SPANISH) // "marzo"
```

#### `weekdayName(date, shortName?, language?)`
Retorna el nombre del día de la semana correspondiente de forma correcta sin desfasamientos de índice.
```javascript
weekdayName(new Date('2026-06-21'), false, PLanguages.SPANISH) // "domingo"
```

---

### 3. Números (`PUtilsNumber`)

#### `format(value, config?)`
Formatea un número con separadores de miles y decimales personalizados.
```javascript
format(1234567.89, { decimals: 2, decimalSeparator: ',', thousandSeparator: '.' }) // "1.234.567,89"
```

#### `write(value, config?)`
Convierte un valor numérico a su equivalente escrito en palabras (Español o Inglés), útil para emisión de cheques o recibos.
```javascript
write(1208.50, { decimals: 2, language: PLanguages.SPANISH }) 
// "MIL DOSCIENTOS OCHO CON 50/100"
```

#### `compare(value, conditions)`
Compara un número contra una o varias condiciones (cadenas como `'>10'`, `'<=50'` o un objeto como `{ gt: 10, lte: 50, in: [...] }`).
```javascript
compare(45, ['>10', '<50']) // true
compare(45, { in: [30, 40, 45, 50] }) // true
```

#### `sizeRepresentation(sizeInBytes)`
Convierte un número de bytes en una cadena legible por humanos (K, M, G, T, etc.).
```javascript
sizeRepresentation(1048576) // "1.00 M"
```

---

### 4. Textos y Cadenas (`PUtilsString`)

#### `capitalize(text, toLowerFirst?)`
Capitaliza la primera letra de cada palabra en un texto.
```javascript
capitalize('hi JEAN!', true) // "Hi Jean!"
```

#### `withoutAccentMark(text)`
Elimina las tildes y diacríticos de un texto de forma robusta utilizando la normalización Unicode `'NFD'`.
```javascript
withoutAccentMark('áéíóúÁÉÍÓÚ') // "aeiouAEIOU"
```

#### `textMatch(text, query)`
Evalúa si un texto coincide de forma parcial con una consulta ignorando mayúsculas, minúsculas y tildes.
```javascript
textMatch('Este es un texto de prueba', 'texto pru') // true
```

---

### 5. Objetos (`PUtilsObject`)

#### `getValue(object, path)`
Obtiene un valor en una ruta anidada usando notación de puntos (ej. `'usuario.direccion.calle'`).
```javascript
const datos = { usuario: { direccion: { calle: 'Principal' } } }
getValue(datos, 'usuario.direccion.calle') // "Principal"
```

#### `setValue(object, path, value)`
Asigna un valor en una ruta anidada creando las propiedades intermedias si no existen.
```javascript
setValue(datos, 'usuario.contacto.telefono', '123456')
```

#### `toUrlParameters(object)`
Serializa de forma robusta un objeto a una cadena de consulta (Query String) de URL usando la API nativa `URLSearchParams`. A diferencia de la API nativa, serializa de forma automática objetos anidados en formato JSON y limpia valores `null` o `undefined` convirtiéndolos en cadenas vacías en lugar del texto `"null"`.
```javascript
toUrlParameters({ id: 10, filtro: { estado: 'activo' }, vacio: null })
// "id=10&filtro=%7B%22estado%22%3A%22activo%22%7D&vacio="
```

#### `urlParametersToObject(queryString)`
Convierte una cadena de consulta de URL en un objeto decodificado de forma automática.
```javascript
urlParametersToObject('id=10&estado=activo') // { id: '10', estado: 'activo' }
```

---

### 6. Archivos y FS (`PUtilsFile` y `PUtilsFS`)

#### `existsFile(path)` / `existsDirectory(path)`
Verifica de forma segura y atómica si un archivo o directorio existe en Node.js.
```javascript
if (existsFile('/ruta/archivo.txt')) { ... }
```

---

### 7. Optimización (`PUtilsFunction`)

#### `throttle(func, preventTime)`
Crea una versión limitada (throttled) de una función para asegurar que no se ejecute más de una vez dentro del intervalo especificado, preservando el contexto `this` y el tipado.
```javascript
const throttledLog = throttle((msg) => console.log(msg), 1000)
```

#### `debounce(func, delay)`
Crea una versión anti-rebote (debounced) de la función para retrasar su ejecución hasta que haya transcurrido el tiempo indicado desde la última llamada.
```javascript
const debouncedSearch = debounce((query) => apiSearch(query), 500)
```

---

### 8. Fórmulas Matemáticas (`PUtilsMath`)

#### `formula(expression, parameters?)`
Evalúa una expresión matemática dada como cadena de texto de forma segura y con soporte de marcadores dinámicos. Incluye validación de caracteres de entrada para **bloquear la ejecución de código JavaScript malicioso (previene vulnerabilidades RCE)**.
```javascript
formula('$base * $altura', { base: 10, height: 5 }) 
// { formula: '10 * 5', result: 50 }

formula('pow(2, 3) + pi()')
// Evalúa funciones matemáticas integradas de forma segura.
```

---

### 9. Clase `PBase64`

Una clase envolvente para crear, inspeccionar y convertir datos binarios codificados en Base64.

```javascript
import { PBase64 } from 'pols-utils'

// Crear desde un String Base64 o Data URI
const imageBase64 = PBase64.fromBase64String('data:image/png;base64,iVBORw0KGgo...')
console.log(imageBase64.mimeType) // "image/png"
console.log(imageBase64.size) // Tamaño original en bytes

// Convertir a texto decodificado
console.log(imageBase64.toString('utf-8'))

// Crear desde un archivo (asíncrono, exclusivo de Node.js)
PBase64.fromFile('ruta/archivo.pdf').then(pdfBase64 => {
  console.log(pdfBase64.mimeType) // "application/pdf"
})
```