# 🧠 Git y GitHub - Tips Útiles para el Equipo Frontend

Este documento tiene como objetivo facilitar el trabajo diario del equipo frontend con algunos comandos y prácticas útiles de Git y GitHub.

---

## 🧹 Mantenimiento de Ramas

### Guardar cambios temporalmente antes de cambiar de rama
```bash
git stash
```
Esto guarda tus cambios locales sin necesidad de hacer un commit. Muy útil si querés cambiar de rama pero no querés perder lo que estabas haciendo.

### Aplicar los cambios guardados con stash
```bash
git stash pop
```
Esto restaura los cambios guardados con `stash` y los aplica sobre tu rama actual.

### Eliminar ramas remotas que ya no existen
```bash
git fetch -p
```
Esto limpia las referencias a ramas remotas que fueron eliminadas del repositorio.

### Eliminar ramas locales que ya no existen en el remoto
```bash
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d
```
Este comando borra automáticamente todas las ramas locales que ya no existen en el repositorio remoto. ⚠️ Usarlo con cuidado.

---

## 🚀 Mejores Prácticas Adaptadas al Equipo

### Nombrado de ramas
Las ramas se generan automáticamente desde Jira con un formato como:
```
feature/PROY-123-nombre-de-la-tarea
```
Esto asegura trazabilidad directa entre código y tareas del backlog. ✅

### Commits automáticos con IA
Usamos asistentes como Cursor o VS Code con IA para generar los mensajes de commit automáticamente.  
Aun así, es importante revisar que el mensaje generado tenga sentido y refleje bien el cambio hecho.

**Tips rápidos:**
- No comitear cambios sin sentido solo para “guardar”.
- Si hacés un cambio importante, podés editar el mensaje generado antes de confirmar.

---

## 🛟 Extra

### Deshacer el último commit (sin perder los cambios):
```bash
git reset --soft HEAD~1
```

### Borrar todos los stashes:
```bash
git stash clear
```

### Ver qué hay en un stash:
```bash
git stash show -p stash@{0}
```

---

💡 **Consejo general**: si no estás seguro de lo que hace un comando, probalo en una rama de prueba o pedí ayuda. Mejor prevenir que perder trabajo valioso.

---

¿Querés sumar más tips? ¡Proponelos en el canal del equipo!

