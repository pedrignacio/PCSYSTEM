# 🚀 Deploy Rápido en Render

## ✅ Pre-requisitos Completados

Tu proyecto ya está configurado y listo para deployar en Render. Los archivos necesarios han sido creados:

- ✅ `package.json` - Script de start actualizado
- ✅ `next.config.ts` - Configuración para producción
- ✅ `render.yaml` - Configuración automática de Render
- ✅ `.nvmrc` - Versión de Node.js especificada

---

## 📋 Pasos para Deploy (5 minutos)

### **1️⃣ Sube tu código a GitHub**

Si aún no lo has hecho:

```bash
# Inicializa git (si no existe)
git init

# Añade todos los archivos
git add .

# Commit
git commit -m "Ready for Render deployment"

# Crea un nuevo repositorio en GitHub y luego:
git branch -M main
git remote add origin https://github.com/TU_USUARIO/PCSYSTEM.git
git push -u origin main
```

Si ya tienes el repo, solo actualiza:

```bash
git add .
git commit -m "Configure for Render deployment"
git push
```

---

### **2️⃣ Crear cuenta en Render**

1. Ve a **[render.com](https://render.com)**
2. Haz clic en **"Get Started"**
3. Regístrate con tu cuenta de **GitHub** (recomendado)

---

### **3️⃣ Crear Web Service**

1. En el Dashboard de Render, haz clic en **"New +"** → **"Web Service"**

2. **Conecta tu repositorio**:
   - Si es la primera vez, autoriza a Render a acceder a tus repos
   - Selecciona el repositorio **PCSYSTEM**

3. **Configuración automática** (Render detectará `render.yaml`):
   - ✅ Name: `pcsystem`
   - ✅ Environment: `Node`
   - ✅ Branch: `main`
   - ✅ Build Command: `npm install && npm run build`
   - ✅ Start Command: `npm start`

4. **Plan**: Selecciona **Free**

5. Haz clic en **"Create Web Service"**

---

### **4️⃣ Espera el Deploy** ⏳

Render automáticamente:
- 📦 Instalará dependencias (2-3 min)
- 🔨 Compilará tu app (1-2 min)
- 🚀 La deployará

**Total: ~5 minutos**

---

### **5️⃣ ¡Listo!** 🎉

Tu sitio estará disponible en:
```
https://pcsystem.onrender.com
```

O el nombre que hayas elegido.

---

## 🔧 Configuración Opcional

### Variables de Entorno

Si necesitas agregar variables de entorno:

1. En Render Dashboard → Tu servicio
2. **"Environment"** → **"Add Environment Variable"**
3. Agrega las que necesites

### Dominio Personalizado

1. **"Settings"** → **"Custom Domain"**
2. Agrega tu dominio: `pcsystem.cl`
3. Configura los DNS según las instrucciones de Render

---

## 🔄 Deploy Automático

Cada vez que hagas `git push` a `main`, Render automáticamente:
- ✅ Detectará el cambio
- ✅ Reconstruirá la app
- ✅ La deployará

---

## 📊 Características de Render (Plan Free)

- ✅ **HTTPS** automático con certificado SSL
- ✅ **750 horas/mes** de uso
- ✅ **Deploy automático** en cada push
- ✅ **Logs en tiempo real**
- ✅ **Rollback** a versiones anteriores
- ⚠️ Se duerme después de 15 min de inactividad (tarda 30s en despertar)

---

## 🐛 Troubleshooting

### Build falla

```bash
# Prueba el build local primero
npm run build

# Si funciona local pero falla en Render, revisa los logs
```

### Puerto incorrecto

El script `start` ya está configurado para usar `$PORT` de Render:
```json
"start": "next start -p ${PORT:-3000}"
```

### Imágenes no cargan

Asegúrate de que las rutas no tengan `/PCSYSTEM` en producción. El código ya está preparado para esto en `next.config.ts`.

---

## 🎯 Checklist Final

Antes de deployar, verifica:

- [ ] ✅ Código en GitHub
- [ ] ✅ `package.json` tiene `"start": "next start -p ${PORT:-3000}"`
- [ ] ✅ `next.config.ts` configurado
- [ ] ✅ `render.yaml` existe
- [ ] ✅ `.nvmrc` existe
- [ ] ✅ Build local funciona: `npm run build`

---

## 🚀 Comandos Útiles

```bash
# Probar build local
npm run build
npm start

# Ver la app local
http://localhost:3000

# Subir cambios
git add .
git commit -m "Update"
git push
```

---

## 📞 Soporte

- **Documentación Render**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Status**: https://status.render.com

---

## 🎉 ¡Eso es todo!

Tu app de PCSystem está lista para deployar. El proceso completo toma **menos de 10 minutos** incluyendo el registro en Render.

**¿Listo para deployar?** 👉 [render.com](https://render.com)
