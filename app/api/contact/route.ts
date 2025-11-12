import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email y mensaje son obligatorios' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // ========================================
    // OPCIÓN 1: Resend (Recomendado)
    // ========================================
    // Descomenta esto si usas Resend
    // Instala: npm install resend
    /*
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'PCSystem <onboarding@resend.dev>', // Cambia esto por tu dominio verificado
      to: [process.env.CONTACT_EMAIL || 'contacto@pcsystems.cl'],
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto desde PCSystem</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Servicio de Interés:</strong> ${service || 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // ========================================
    // OPCIÓN 2: Nodemailer (Gmail/SMTP)
    // ========================================
    // Descomenta esto si usas Nodemailer
    // Instala: npm install nodemailer
    /*
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password si usas Gmail
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'contacto@pcsystems.cl',
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto desde PCSystem</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Servicio de Interés:</strong> ${service || 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // ========================================
    // OPCIÓN 3: SendGrid
    // ========================================
    // Descomenta esto si usas SendGrid
    // Instala: npm install @sendgrid/mail
    /*
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);

    await sgMail.default.send({
      from: process.env.SENDGRID_FROM_EMAIL!,
      to: process.env.CONTACT_EMAIL || 'contacto@pcsystems.cl',
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto desde PCSystem</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Servicio de Interés:</strong> ${service || 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // ========================================
    // FALLBACK: Por ahora solo registra en consola
    // Descomenta SOLO UNA de las opciones de arriba
    // ========================================
    console.log('📧 Nuevo mensaje de contacto:', {
      name,
      email,
      phone,
      service,
      message,
      timestamp: new Date().toISOString(),
    });

    // También envía a WhatsApp como backup
    const whatsappMessage = `Nuevo contacto web:\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'N/A'}\nServicio: ${service || 'N/A'}\nMensaje: ${message}`;
    const whatsappUrl = `https://wa.me/56989142836?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente',
      whatsappUrl, // Para fallback a WhatsApp
    });

  } catch (error) {
    console.error('Error en API de contacto:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar el mensaje',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS (si es necesario)
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
