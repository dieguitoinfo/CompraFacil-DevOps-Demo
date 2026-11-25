# Demo práctica: CompraFácil con DevOps, CI/CD y monitoreo

Esta mini tienda funciona en tu computadora y simula pagos. No conecta con un banco, no pide datos de tarjeta y no realiza cobros reales.

## Requisitos

- Node.js 20 o superior (para ejecutar la tienda y sus pruebas)
- Git (para subir el proyecto a GitHub y ver CI/CD)
- Una cuenta de GitHub si quieres hacer el despliegue público

## 1. Ejecutar la tienda en tu computadora

1. Extrae la carpeta `CompraFacil-DevOps-Demo`.
2. Abre PowerShell dentro de esa carpeta.
3. Comprueba que Node está instalado: `node -v`.
4. Ejecuta las pruebas automáticas: `npm test`. Deben pasar cuatro pruebas.
5. Inicia la tienda: `npm start`.
6. Abre `http://localhost:4173` en el navegador.

### Qué hacer en la tienda

1. Pulsa **Simular pago aprobado**. Observa que se confirma el pedido y aparece un cobro.
2. Pulsa **Reintentar la misma solicitud**. El número de cobros debe seguir en 1. La clave de idempotencia evita cobrar dos veces la misma solicitud.
3. Pulsa **Simular despliegue de v1.3** para representar la publicación de una nueva versión.
4. Pulsa **Empezar otro pedido** y luego **Simular pago rechazado**. Como la nueva versión está activa, aparece una alerta de monitoreo.
5. Pulsa **Simular reversión a v1.2**. La tienda vuelve a mostrar la versión estable.
6. Revisa el registro de actividad: muestra los cambios, el reintento, la alerta y la reversión.

Para detener el servidor, vuelve a PowerShell y pulsa `Ctrl+C`.

## 2. Mostrar cómo CI encuentra un error

Este paso es opcional. Sirve para mostrar a la docente una prueba que falla y cómo CI frena el cambio.

1. Abre `site/payment.js` en un editor de texto.
2. Busca esta línea: `if (previous) {`.
3. Cámbiala temporalmente por `if (false && previous) {` y guarda.
4. En PowerShell ejecuta `npm test`. La prueba de reintento debe fallar porque ahora permite el cobro duplicado.
5. Restaura la línea original: `if (previous) {`.
6. Ejecuta otra vez `npm test`. Las cuatro pruebas deben pasar.

No dejes el cambio intencional en el proyecto que subas a GitHub.

## 3. Subirlo a GitHub para ver CI/CD

1. En GitHub crea un repositorio público vacío llamado `CompraFacil-DevOps-Demo`. No agregues README desde GitHub, porque este proyecto ya trae uno.
2. En PowerShell, dentro de la carpeta del proyecto, ejecuta:

```powershell
git init
git branch -M main
git add .
git commit -m "Crear demo de pagos CompraFácil"
git remote add origin https://github.com/TU-USUARIO/CompraFacil-DevOps-Demo.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub.

3. En GitHub abre el repositorio y ve a **Settings → Pages**. En **Build and deployment**, elige **GitHub Actions** como origen.
4. Abre la pestaña **Actions**. El flujo **CI y despliegue de CompraFácil** ejecuta `npm test`. Si las pruebas pasan en `main`, también publica la tienda en GitHub Pages.
5. Al terminar, abre el enlace que GitHub muestra en la ejecución del despliegue. Cada actualización que llegue a `main` vuelve a publicar la tienda.

### Demostrar una CI roja y luego verde (opcional)

Para no afectar `main`, crea una rama para la falla intencional:

```powershell
git switch -c demo/falla-ci
```

Cambia temporalmente `if (previous) {` por `if (false && previous) {`, guarda y ejecuta:

```powershell
git add .
git commit -m "Demostrar una prueba que detecta un cobro repetido"
git push -u origin demo/falla-ci
```

En GitHub crea una **Pull request** desde `demo/falla-ci` hacia `main`. La prueba automática debe fallar y mostrar que el cambio no está listo para integrarse. Restaura `if (previous) {`, guarda, ejecuta `npm test` y sube el arreglo a la misma rama:

```powershell
git add .
git commit -m "Evitar el cobro duplicado"
git push
```

La Pull request debe actualizarse y pasar. Después puedes cerrarla si solo fue una demostración. El despliegue automático ocurre cuando el cambio corregido llega a `main`.

## Qué representa cada práctica

- **DevOps:** desarrollo y operaciones comparten la responsabilidad de que la compra funcione.
- **CI:** cada cambio ejecuta las cuatro pruebas en GitHub Actions.
- **CD:** una vez que las pruebas pasan y el cambio llega a `main`, GitHub Pages publica la tienda.
- **Monitoreo:** el panel registra pagos rechazados y muestra una alerta simulada; la reversión representa volver a una versión estable.

La tienda, las alertas y los pagos son una simulación educativa. No uses números de tarjetas reales.
