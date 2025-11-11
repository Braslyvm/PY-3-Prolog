# 🧩 Proyecto 3 – Lenguajes de Programación

**Instituto Tecnológico de Costa Rica – Centro Académico de Limón**  
**Profesor: Allan Rodríguez Dávila**

## 👥 Estudiantes
- **Elder León Pérez** – 2023166120
- **Owen Torres Porras** – 2023302034  
- **Brasly Villarebia Morales** – 2023105915

**Semestre:** II - 2025  
**Entrega:** 10 de noviembre del 2025

---

## 📑 Índice
1. [Información](#🧠-información)
2. [Manual de usuario](#💻-manual-de-usuario)
3. [Descripción del problema](#🧩-descripción-del-problema)
4. [Diseño del programa](#⚙️-diseño-del-programa)
5. [Análisis de resultados](#✅-análisis-de-resultados)
6. [Análisis de predicados](#🔍-análisis-de-predicados)
7. [Bitácora](#📋-bitácora)

---

## 🧠 Información

Este sistema permite a un usuario explorar un mundo virtual compuesto por distintos lugares, objetos y reglas lógicas definidas en Prolog.

A través de una interfaz web, el jugador puede:
- Moverse entre lugares conectados
- Tomar y usar objetos
- Consultar su inventario
- Verificar si puede moverse a un destino
- Obtener rutas entre ubicaciones
- Reiniciar la partida

El backend está completamente implementado en **SWI-Prolog** y expone los predicados como endpoints HTTP JSON.  
El frontend, desarrollado en **React + TypeScript**, consume dichos endpoints mediante funciones `fetch()`.

---

## 💻 Manual de usuario

### 🧩 Requisitos previos
- Tener instalado **SWI-Prolog**
- Tener instalado **Node.js** (para el frontend)
- Contar con los siguientes archivos:
  - `BC.pl` → Base de conocimiento (lugares, objetos, conexiones, etc.)
  - `Reglas.pl` → Lógica del juego (tomar/1, usar/1, ruta/3, etc.)
  - `server.pl` → Servidor HTTP y endpoints
  - Carpeta `/frontend` → Código del proyecto en React

### ⚙️ Instrucciones de compilación

1. **Abrir una terminal y acceder a la carpeta del proyecto:**
   ```bash
   cd Programa
   ```

2. **Verificar si el puerto 8080 está en uso:**
   ```bash
   sudo lsof -i :8080
   ```
   *Si aparece un proceso, detenerlo antes de continuar.*

3. **Ejecutar el servidor Prolog:**
   ```bash
   swipl api.pl
   ```

4. **En otra terminal, iniciar el frontend:**
   ```bash
   cd Interfaz/aventura-logica
   npm run dev
   ```

5. **Luego abrir el enlace de localhost que aparece en consola.**

### 🎮 Instrucciones de juego

#### Moverse entre lugares
Usa el panel **"Moverse a"** para desplazarte entre lugares conectados. Solo podrás moverte a sitios directamente enlazados con tu ubicación actual y que cumplan los requisitos necesarios (por ejemplo, haber usado un objeto específico).

#### Tomar objetos
En cada lugar puede haber objetos (como una llave o una antorcha). Escribe el nombre del objeto en el campo de **Acciones** y selecciona **Tomar** para añadirlo al inventario.

#### Usar objetos
Si un lugar requiere un objeto especial, debes usarlo antes de poder ingresar. Escribe el nombre del objeto y selecciona **Usar** para activarlo.

#### Buscar objetos
Puedes consultar la ubicación de un objeto mediante el endpoint:
```
/api/donde_esta/:objeto
```
**Ejemplo:**
```
/api/donde_esta/llave
```
Esto mostrará el lugar donde se encuentra el objeto.

#### Consultar el inventario
En el panel **Inventario** podrás ver los objetos que posees actualmente o consultar mediante:
```
/api/inventario
```

#### Preguntas para avanzar
El juego permite realizar preguntas para obtener orientación:

- **"¿Puedo ir a [lugar]?"** → Verifica si el jugador puede moverse
- **"¿Dónde está [objeto]?"** → Indica la ubicación actual del objeto

**Ejemplo de endpoint:**
```
/api/puedo_ir/templo
```

#### Ver rutas hacia un lugar
El jugador puede obtener rutas lógicas entre ubicaciones:
```
/api/ruta/:inicio/:fin
```
**Ejemplo:**
```
/api/ruta/bosque/cueva
```
**Resultado:**
```json
["bosque","rio","cueva"]
```

#### Revisar progreso
El **Panel de control** permite:
- Ver lugares visitados → `/api/lugares_visitados`
- Consultar cómo ganar → `/api/como_gano`
- Verificar si ya ganaste → `/api/verifica_gane`

#### Reiniciar el juego o salir
Puedes reiniciar la partida o salir en cualquier momento mediante los botones:
- **Reiniciar juego**
- **Salir**

O usando el endpoint:
```
/api/reiniciar_total
```

---

## 🧩 Descripción del problema

El objetivo es desarrollar un sistema inteligente que represente un entorno de exploración en el que el jugador pueda desplazarse entre lugares, recoger objetos, cumplir condiciones lógicas y alcanzar una meta (por ejemplo, encontrar un tesoro).

Este entorno debe modelarse mediante conocimientos y reglas en Prolog, permitiendo deducir:
- Qué lugares están conectados
- Qué objetos son necesarios para avanzar
- Si una acción (usar, mover, etc.) es válida según el estado actual
- Cómo llegar desde un punto inicial hasta un destino mediante el predicado `ruta/3`

El sistema debe ofrecer además una interfaz gráfica amigable que comunique al usuario las acciones y resultados.

---

## ⚙️ Diseño del programa

- Se utilizaron **predicados de control** para manejar reglas con múltiples condiciones
- Se emplearon **negaciones de predicados** cuando no era necesario usar control explícito
- Se implementaron **casos múltiples** para reglas que requieren validaciones adicionales
- Se utilizó `append/3` para adaptar reglas con retornos complejos
- Para la construcción del API se usaron las **librerías HTTP oficiales de SWI-Prolog**

---

## ✅ Análisis de resultados

| Prueba / Funcionalidad | Descripción del comportamiento esperado | Resultado obtenido | Estado | Observaciones |
|-----------------------|------------------------------------------|---------------------|---------|---------------|
| **Inicio del servidor Prolog** | Ejecutar servidor(8080) debe iniciar el servidor HTTP | El servidor inicia y escucha correctamente en el puerto 8080 | ✅ Correcto | Sin errores |
| **/api/lugares** | Devuelve todos los lugares con nombre y descripción | Retorna JSON con los lugares definidos en BC.pl | ✅ Correcto | Ejemplo: `{"lugares":[{"nombre":"bosque","descripcion":"Un bosque frondoso"}]}` |
| **/api/jugador** | Devuelve el lugar actual del jugador | Retorna posición actual según jugador/1 | ✅ Correcto | Se actualiza dinámicamente |
| **/api/mover/:lugar** | Mueve al jugador si hay conexión y condiciones válidas | Movimiento exitoso | ✅ Correcto | Error JSON si no hay conexión o falta objeto |
| **/api/tomar/:objeto** | Permite recoger objetos en el lugar actual | Objeto agregado al inventario | ✅ Correcto | Error si ya fue tomado |
| **/api/usar/:objeto** | Usa un objeto del inventario | Marca el objeto como en uso | ✅ Correcto | Error si no está disponible |
| **/api/inventario** | Devuelve lista de objetos actuales | Retorna JSON actualizado | ✅ Correcto | Cambia tras tomar objetos |
| **/api/verifica_gane** | Verifica condición de victoria | Retorna true cuando se cumplen requisitos | ✅ Correcto | Se actualiza al alcanzar el tesoro |
| **/api/como_gano** | Indica pasos para ganar | Devuelve condiciones lógicas del triunfo | ✅ Correcto | Útil para depurar reglas |
| **/api/donde_esta/:objeto** | Muestra la ubicación de un objeto | Indica el lugar correcto o error | ✅ Correcto | Usa donde_esta/2 |
| **/api/puedo_ir/:lugar** | Verifica si el jugador puede moverse | Muestra mensaje de éxito o bloqueo | ✅ Correcto | Usa puedo_ir/1 |
| **/api/lugares_visitados** | Devuelve lugares visitados | Lista ordenada en JSON | ✅ Correcto | Registro histórico |
| **/api/reiniciar_total** | Reinicia el sistema | Limpia hechos y recarga BC.pl y Reglas.pl | ✅ Correcto | Útil para pruebas |
| **/api/ruta/:inicio/:fin** | Calcula ruta entre lugares | Devuelve lista de lugares intermedios | ✅ Correcto | Ejemplo: `["bosque","rio","cueva"]` |
| **Integración con Frontend React** | Frontend consume correctamente los endpoints | Todos los botones (Ir, Tomar, Usar, Ver ruta) funcionan | ✅ Correcto | Sincronización estable |
| **Validación de uso de objetos** | Evita usar objetos repetidos | Devuelve mensaje de error adecuado | ✅ Correcto | Usa validar_repetido_uso/1 |
| **Rendimiento y estabilidad** | Pruebas con múltiples solicitudes | Mantiene estabilidad sin bloqueos | ✅ Correcto | SWI-Prolog maneja concurrencia correctamente |

---

## 🔍 Análisis de predicados

### `ruta/3`
Recibe la ubicación inicial y final y retorna los caminos entre ambos puntos. Verifica si el destino es el mismo punto de inicio, usa una lista auxiliar para evitar repeticiones y valida las conexiones disponibles.

### `verifica_gane/0`
Evalúa la ubicación del jugador, su inventario y los hechos de tesoro. Determina si el jugador cumple las condiciones necesarias para ganar.

### `como_gano/0`
Consulta la ubicación actual del jugador y los tesoros del juego. Calcula todas las rutas posibles mediante `ruta/3`, analiza los objetos requeridos y devuelve una lista de pasos para lograr la victoria.

---

