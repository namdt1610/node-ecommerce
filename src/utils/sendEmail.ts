import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp.mailtrap.io' for testing
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
})

export const sendResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset mật khẩu',
        html: `
            <p>Chào bạn,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để tiếp tục:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        `,
    }

    await transporter.sendMail(mailOptions)
}

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Receiver address
        subject,
        text,
        html,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}
