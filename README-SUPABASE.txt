CONEXIÓN SUPABASE - PUNTO DE VENTA

1. Crea un proyecto en Supabase.
2. En SQL Editor ejecuta el contenido de supabase-setup.sql.
3. En Project Settings > API copia Project URL y anon/public key.
4. Abre supabase-config.js y reemplaza:
   https://TU-PROYECTO.supabase.co
   TU_SUPABASE_ANON_KEY
5. Sube todos los archivos de esta carpeta al mismo directorio de tu hosting/GitHub Pages.

La app conserva su interfaz y funcionamiento actual. Los datos locales de las claves
incluidas se descargan de Supabase al abrir por primera vez y los cambios posteriores
se sincronizan automáticamente. La copia local sigue funcionando si Supabase falla.

SEGURIDAD:
El SQL incluido habilita acceso anon abierto para facilitar una primera conexión
sin cambiar el login actual. No es apropiado para datos reales de clientes/ventas
en producción. Para producción se debe agregar Supabase Auth y políticas RLS por
usuario/negocio. No compartas la service_role key en el navegador.
