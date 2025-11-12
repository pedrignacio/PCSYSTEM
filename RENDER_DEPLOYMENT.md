# 🚀 Deployment en Render - Guía Actualizada (Next.js 15)

## 📋 Configuración Completa

### 1. **Variables de Entorno en Render**

Ve a tu servicio en Render → **Environment** → Agregar estas variables:

```bash
# Node.js
NODE_VERSION=20.11.0

# Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Puerto dinámico (Render lo asigna automáticamente)
PORT=3000

# Email API (elige UNA opción)
# Opción 1: Resend (recomendado)
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=contacto@pcsystem.cl
EMAIL_TO=contacto@pcsystem.cl

# O Opción 2: Nodemailer (Gmail)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=tu-email@gmail.com
# SMTP_PASSWORD=tu-app-password
# EMAIL_FROM=tu-email@gmail.com
# EMAIL_TO=contacto@pcsystem.cl

# O Opción 3: SendGrid
# SENDGRID_API_KEY=SG.tu_api_key_aqui
# EMAIL_FROM=contacto@pcsystem.cl
# EMAIL_TO=contacto@pcsystem.cl

# WhatsApp (fallback)
WHATSAPP_NUMBER=56989142836

# Google Verification (opcional, para Search Console)
# NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=tu-codigo-verificacion

# Analytics (opcional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### 2. **Archivos de Configuración**

#### ✅ Ya están configurados:

**`package.json`** - Scripts optimizados:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "lint": "next lint"
  }
}
```

**`next.config.ts`** - Configuración completa con:
```typescript
✅ output: 'standalone' (para Render)
✅ Optimización de imágenes (AVIF, WebP)
✅ Headers de seguridad
✅ Compresión
✅ Remote patterns para imágenes externas
```

**`.nvmrc`** - Versión de Node:
```
20.11.0
```

**`render.yaml`** - Blueprint de Render:
```yaml
✅ Build command
✅ Start command  
✅ Health check path
✅ Auto-deploy
```

---

### 3. **Configuración del Servicio en Render**

#### Dashboard de Render:

1. **Service Type**: `Web Service`

2. **Build Command**:
   ```bash
   npm install && npm run build
   ```

3. **Start Command**:
   ```bash
   npm run start
   ```

4. **Environment**:
   - Runtime: `Node`
   - Node Version: `20.11.0` (se lee desde .nvmrc)

5. **Auto-Deploy**:
   - ✅ Activado para rama `mati` o `main`

6. **Health Check Path**:
   ```
   /
   ```

7. **Instance Type** (recomendado):
   - Free tier: ✅ Funciona perfecto
   - Starter: Para mejor performance

---

### 4. **Proceso de Deploy**

#### Opción A: Auto-deploy (Recomendado)
```bash
# En tu terminal local
git add .
git commit -m "Optimizaciones SEO y configuración Render"
git push origin mati

# Render detecta el push automáticamente y hace deploy
```

#### Opción B: Deploy Manual
1. Ve a Render Dashboard
2. Selecciona tu servicio
3. Click en "Manual Deploy" → "Deploy latest commit"

---

### 5. **Verificación Post-Deploy**

Después del deploy, verifica:

#### A. Sitio funcionando:
```
https://tu-servicio.onrender.com
```

#### B. API de contacto:
```
https://tu-servicio.onrender.com/api/contact
```
Prueba el formulario de contacto.

#### C. SEO Files:
```
https://tu-servicio.onrender.com/robots.txt
https://tu-servicio.onrender.com/sitemap.xml
https://tu-servicio.onrender.com/manifest.webmanifest
```

#### D. Logs:
En Render Dashboard → **Logs** → Verifica que no haya errores

---

### 6. **Dominio Personalizado (Opcional)**

#### Si tienes dominio propio (pcsystem.cl):

1. **En Render**:
   - Settings → Custom Domains
   - Agregar: `pcsystem.cl` y `www.pcsystem.cl`

2. **En tu proveedor DNS** (NIC Chile, Cloudflare, etc.):
   ```
   Tipo: CNAME
   Nombre: www
   Valor: tu-servicio.onrender.com
   
   Tipo: A
   Nombre: @
   Valor: [IP que Render te proporcione]
   ```

3. **SSL/HTTPS**:
   - Render lo configura automáticamente (Let's Encrypt)
   - Espera 5-10 minutos

---

### 7. **Configuración de Email**

#### Activar API de Email (elige una):

**Opción 1: Resend** (más fácil)
```bash
# 1. Regístrate en resend.com
# 2. Obtén API key
# 3. Agrega en Render Environment:
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=contacto@pcsystem.cl
EMAIL_TO=contacto@pcsystem.cl

# 4. En /app/api/contact/route.ts descomenta sección RESEND
```

**Opción 2: Gmail con Nodemailer**
```bash
# 1. Habilita "App Passwords" en tu Gmail
# 2. Agrega en Render Environment:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM=tu-email@gmail.com
EMAIL_TO=contacto@pcsystem.cl

# 3. En /app/api/contact/route.ts descomenta sección NODEMAILER
```

---

### 8. **SEO - Google Search Console**

#### Después del deploy:

1. **Verificar propiedad**:
   - Ve a: https://search.google.com/search-console
   - Agregar propiedad: `https://tu-servicio.onrender.com`
   - Método: HTML tag (usa NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION)

2. **Enviar sitemap**:
   ```
   https://tu-servicio.onrender.com/sitemap.xml
   ```

3. **Esperar indexación**: 2-7 días

---

### 9. **Monitoreo y Performance**

#### Herramientas recomendadas:

**PageSpeed Insights**:
```
https://pagespeed.web.dev/
```
- Score esperado: 90-100/100

**Lighthouse** (Chrome DevTools):
- Performance: 90+
- SEO: 100
- Best Practices: 90+
- Accessibility: 90+

**Uptime Monitoring** (opcional):
- UptimeRobot.com (gratis)
- Configurar ping cada 5 minutos

---

### 10. **Troubleshooting**

#### Error: "Module not found"
```bash
# Asegúrate de que package.json tenga todas las deps
npm install
npm run build

# Si persiste, verifica logs en Render
```

#### Error: "Port already in use"
```bash
# Render maneja el PORT automáticamente
# Verifica que package.json tenga:
"start": "next start -p ${PORT:-3000}"
```

#### Error: "API route not working"
```bash
# 1. Verifica variables de entorno en Render
# 2. Checa logs: Dashboard → Logs
# 3. Asegúrate de que next.config.ts tenga output: 'standalone'
```

#### Error: "Images not loading"
```bash
# Verifica next.config.ts:
images: {
  unoptimized: false,  # Para Render debe ser false
  remotePatterns: [...] # Agrega dominios necesarios
}
```

#### Build muy lento
```bash
# Render Free tier tiene límites de CPU
# Considera upgrade a Starter ($7/mes)
```

---

### 11. **Optimizaciones Adicionales**

#### A. CDN (Opcional)
```bash
# Configurar Cloudflare delante de Render:
# 1. Cloudflare como DNS
# 2. Proxy activado (nube naranja)
# 3. Cache todo estático
# 4. Minificar CSS/JS
```

#### B. Database (Si necesitas)
```bash
# Render ofrece PostgreSQL gratis:
# 1. Crear PostgreSQL database
# 2. Conectar con Prisma o similar
# 3. Variable: DATABASE_URL
```

#### C. Redis Cache (Avanzado)
```bash
# Para cache de sesiones o rate limiting
# Upstash Redis (gratis tier)
```

---

### 12. **Checklist Final**

Antes de hacer deploy production:

- [ ] Variables de entorno configuradas
- [ ] Email API funcionando (prueba local)
- [ ] `npm run build` sin errores
- [ ] Imágenes optimizadas
- [ ] SEO metadata completa
- [ ] Sitemap generándose correctamente
- [ ] Robots.txt accesible
- [ ] SSL/HTTPS activado
- [ ] Dominio personalizado (si aplica)
- [ ] Google Search Console verificado
- [ ] Analytics configurado (opcional)

---

### 13. **URLs Importantes**

```bash
# Sitio principal
https://tu-servicio.onrender.com

# Admin panel
https://tu-servicio.onrender.com/admin

# Login
https://tu-servicio.onrender.com/login

# API Contact
https://tu-servicio.onrender.com/api/contact

# SEO files
https://tu-servicio.onrender.com/robots.txt
https://tu-servicio.onrender.com/sitemap.xml
https://tu-servicio.onrender.com/manifest.webmanifest

# Render Dashboard
https://dashboard.render.com
```

---

### 14. **Costos**

#### Free Tier (Actual):
```
✅ Gratis para siempre
✅ 750 horas/mes
✅ Auto-sleep después 15 min inactividad
⚠️ Cold start: 30-60 segundos
✅ Perfecto para desarrollo/testing
```

#### Starter Plan ($7/mes):
```
✅ Sin auto-sleep
✅ Siempre activo
✅ Mejor performance
✅ 100GB bandwidth
✅ Recomendado para producción
```

---

### 15. **Mantenimiento**

#### Semanal:
- Revisar logs de errores
- Verificar uptime
- Chequear emails llegando

#### Mensual:
- Google Search Console → rendimiento
- PageSpeed → performance
- Actualizar dependencias: `npm update`

#### Trimestral:
- Auditoría de seguridad: `npm audit`
- Revisar analytics
- Actualizar contenido

---

## 🎯 Resumen Rápido

### Para deploy inmediato:

1. **Push a GitHub**:
   ```bash
   git push origin mati
   ```

2. **Configurar en Render**:
   - Build: `npm install && npm run build`
   - Start: `npm run start`
   - Variables: Ver sección 1

3. **Deploy**: Automático o manual

4. **Verificar**: URLs de la sección 13

---

## 📞 Soporte

**Documentación Render**: https://render.com/docs  
**Documentación Next.js**: https://nextjs.org/docs  
**Community**: https://community.render.com

---

**Estado**: ✅ Configuración completa y optimizada  
**Next.js**: 15.0.1 (App Router + Server Components)  
**Node**: 20.11.0  
**Output**: Standalone (optimizado para Render)
