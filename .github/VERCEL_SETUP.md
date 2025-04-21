# Configuración de Vercel para CI/CD

Este documento explica cómo configurar los secretos necesarios para el flujo de trabajo de CI/CD con Vercel.

## Requisitos previos

1. Una cuenta en [Vercel](https://vercel.com)
2. Tu proyecto ya importado en Vercel
3. Acceso a la configuración del repositorio en GitHub

## Pasos para la configuración

### 1. Obtener el token de Vercel

1. Inicia sesión en tu cuenta de Vercel
2. Ve a la página de [Tokens](https://vercel.com/account/tokens)
3. Haz clic en "Create" para crear un nuevo token
4. Asigna un nombre descriptivo (por ejemplo, "GitHub Actions CI/CD")
5. Haz clic en "Create Token" y copia el token generado

### 2. Configurar secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a "Settings" > "Secrets and variables" > "Actions"
3. Haz clic en "New repository secret"
4. Añade el siguiente secreto:
   - Nombre: `VERCEL_TOKEN`
   - Valor: [el token que copiaste de Vercel]
5. Haz clic en "Add secret"

### 3. Configuración adicional de Vercel (opcional)

Si prefieres usar la acción oficial de Vercel, también necesitarás configurar:

```yaml
- name: Deploy to Vercel
  uses: vercel/actions/cli@master
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: ./frontend/admin
```

Para obtener los IDs de organización y proyecto:

1. Instala la CLI de Vercel: `npm i -g vercel`
2. Ejecuta `vercel whoami` para obtener tu ID de organización
3. Ejecuta `vercel projects list` para obtener tu ID de proyecto
4. Añade estos secretos en GitHub como `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`

## Solución de problemas

Si encuentras algún problema con el despliegue:

1. Verifica que los secretos estén correctamente configurados
2. Revisa los logs del flujo de trabajo en GitHub Actions
3. Asegúrate de que la estructura de directorios en el flujo de trabajo coincide con tu repositorio

Para más información, consulta la [documentación oficial de Vercel sobre CI/CD](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel).
