# 📧 Configuración de la API de Contacto

## Estado Actual

✅ **API creada**: `/app/api/contact/route.ts`  
✅ **Formulario actualizado**: Contact.tsx usa la API  
⏳ **Servicio de email**: Pendiente configuración

Actualmente, el formulario envía datos al backend y redirige a WhatsApp como fallback.

---

## Opciones de Email

Tienes 3 opciones para enviar correos. Elige UNA:

### 🌟 Opción 1: Resend (Recomendado)

**Ventajas**: Simple, moderno, API limpia  
**Costo**: Gratis hasta 3,000 emails/mes

**Pasos**:
```bash
# 1. Instalar
npm install resend

# 2. Configurar .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=contacto@pcsystems.cl
EMAIL_TO=contacto@pcsystems.cl
WHATSAPP_NUMBER=56989142836

# 3. En route.ts, descomenta la sección "OPCIÓN 1: RESEND"
```

**Registro**: [resend.com](https://resend.com)

---

### 📮 Opción 2: Nodemailer (Gmail/SMTP)

**Ventajas**: Usa tu propio email, gratis  
**Desventajas**: Requiere "App Password" en Gmail

**Pasos**:
```bash
# 1. Instalar
npm install nodemailer

# 2. Configurar .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx  # App Password de Gmail
EMAIL_FROM=tu-email@gmail.com
EMAIL_TO=contacto@pcsystems.cl
WHATSAPP_NUMBER=56989142836

# 3. En route.ts, descomenta la sección "OPCIÓN 2: NODEMAILER"
```

**Gmail App Password**: [support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833)

---

### ⚡ Opción 3: SendGrid

**Ventajas**: Robusto, usado por empresas  
**Costo**: Gratis hasta 100 emails/día

**Pasos**:
```bash
# 1. Instalar
npm install @sendgrid/mail

# 2. Configurar .env.local
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=contacto@pcsystems.cl
EMAIL_TO=contacto@pcsystems.cl
WHATSAPP_NUMBER=56989142836

# 3. En route.ts, descomenta la sección "OPCIÓN 3: SENDGRID"
```

**Registro**: [sendgrid.com](https://sendgrid.com)

---

## 🚀 Implementación Rápida

### 1. Elige tu servicio y ejecuta:

```bash
# Para Resend
npm install resend

# O para Nodemailer
npm install nodemailer

# O para SendGrid
npm install @sendgrid/mail
```

### 2. Configura variables de entorno:

```bash
# Copia el ejemplo
cp .env.example .env.local

# Edita .env.local y descomenta tu opción elegida
nano .env.local  # o usa tu editor favorito
```

### 3. Edita `/app/api/contact/route.ts`:

- Busca la sección de tu servicio elegido
- Descomenta TODO el bloque de código
- Asegúrate de que los otros dos estén comentados

### 4. Prueba localmente:

```bash
npm run dev
```

Visita http://localhost:3000/#contacto y prueba el formulario.

### 5. Configura en Render:

1. Ve a tu dashboard de Render
2. Selecciona tu servicio
3. Ve a **Environment**
4. Agrega las variables que uses (sin el `#`)
5. Guarda y redeploy

---

## 🧪 Testing

**Verificar que funciona**:
1. Completa el formulario en http://localhost:3000/#contacto
2. Haz clic en "Enviar Mensaje"
3. Deberías ver "¡Mensaje enviado exitosamente!"
4. Verifica tu bandeja de entrada del `EMAIL_TO`

**Logs para debugging**:
```bash
# Ver logs en producción (Render)
# Dashboard > Logs
```

---

## 📝 Archivos Clave

```
/app/api/contact/route.ts      # API endpoint (aquí eliges el servicio)
/sections/Contact.tsx          # Formulario con fetch a la API
/.env.local                    # Variables de entorno (local)
/.env.example                  # Plantilla de configuración
/API_CONFIG_README.md          # Este archivo
```

---

## ❓ Solución de Problemas

### Error: "Module not found"
```bash
# Asegúrate de instalar el paquete
npm install resend  # o el que hayas elegido
```

### No llegan correos
1. Verifica las variables de entorno en `.env.local`
2. Revisa que descomentas SOLO UNA opción en `route.ts`
3. Checa los logs del servidor: `npm run dev`
4. Para Gmail: verifica que uses App Password (no tu contraseña normal)

### En producción (Render)
1. Ve a Dashboard > Environment
2. Asegúrate de que las variables estén configuradas
3. Haz un redeploy después de agregar variables

---

## 🎯 Recomendación

Para empezar rápido: **usa Resend**

1. Regístrate en [resend.com](https://resend.com)
2. Genera una API key
3. `npm install resend`
4. Configura `.env.local`
5. Descomenta la sección en `route.ts`
6. ¡Listo!

---

## 🔒 Seguridad

- ✅ `.env.local` está en `.gitignore` (no se sube a GitHub)
- ✅ `.env.example` es seguro (sin credenciales reales)
- ✅ Variables de entorno en Render están encriptadas
- ⚠️ **NUNCA** subas API keys a GitHub

---

**¿Necesitas ayuda?** Revisa los logs o contacta al desarrollador.
