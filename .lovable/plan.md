# Diagnóstico del error de pago

## Estado confirmado
- El pedido interno se creó correctamente.
- Realisto autenticó las credenciales y aceptó el terminal **1478**.
- Realisto creó la operación **3210158** y devolvió el enlace de pago con estado correcto.
- Todas las solicitudes de Nitrogames finalizaron con respuesta satisfactoria; por tanto, el error mostrado ocurre después de entrar en el checkout alojado por Realisto.

## Plan
1. Abrir inmediatamente el enlace recién generado y registrar la respuesta y las redirecciones del proveedor.
2. Confirmar si Realisto muestra el error antes de introducir la tarjeta o después de procesarla.
3. Comprobar con el proveedor que la operación **3210158** y el terminal **1478** están habilitados para ese flujo de Revolut.
4. Si el enlace o la redirección del proveedor son incorrectos, conservar la respuesta exacta como evidencia para Realisto; solo modificar Nitrogames si la prueba demuestra que el origen está en nuestra redirección.

## Enlace afectado
`https://payments.realisto.net/revolut/beforecheckout?p=3210158`

No se cambiará el código hasta confirmar el punto exacto del fallo, para evitar romper un flujo de creación de pedidos que actualmente funciona.
