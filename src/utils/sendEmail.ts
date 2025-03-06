import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp.mailtrap.io' for testing
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
})

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
