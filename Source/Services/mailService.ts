import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resetPassword?token=${resetToken}`

  
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Recuperación de contraseña — Kinefit',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Kinefit</strong>.</p>
        <p>Hacé clic en el siguiente botón para crear una nueva contraseña:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">
          Restablecer contraseña
        </a>
        <p style="color: #6b7280; font-size: 14px;">Este enlace expira en <strong>1 hora</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este cambio, ignorá este mensaje.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Kinefit — Sistema de turnos</p>
      </div>
    `,
  })
}