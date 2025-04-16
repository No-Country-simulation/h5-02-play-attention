# Configuración del Token de Vercel para GitHub Actions

Para que el flujo de trabajo de GitHub Actions funcione correctamente, necesitas configurar un token de Vercel como secreto en tu repositorio de GitHub. Sigue estos pasos:

## 1. Generar un token de Vercel

1. Inicia sesión en tu cuenta de [Vercel](https://vercel.com)
2. Ve a la sección de configuración de tu cuenta (Settings)
3. Navega a "Tokens" o "API Tokens"
4. Crea un nuevo token con permisos para despliegue
5. Copia el token generado (solo se muestra una vez)

## 2. Configurar el token como secreto en GitHub

1. Ve a tu repositorio de GitHub
2. Navega a "Settings" > "Secrets and variables" > "Actions"
3. Haz clic en "New repository secret"
4. Nombre: `VERCEL_TOKEN`
5. Valor: [Pega el token generado en Vercel]
6. Haz clic en "Add secret"

## 3. Configuración adicional opcional

Si quieres personalizar el flujo de trabajo:

- Modifica el archivo `.github/workflows/vercel-deploy.yml` para ajustar la rama de despliegue
- Puedes agregar pasos adicionales como pruebas o validaciones antes del despliegue

Una vez configurado el token, cada vez que se haga push a la rama especificada, GitHub Actions se encargará automáticamente del despliegue en Vercel.
