import nodemailer from 'nodemailer'

// Don't create transporter during module load
export async function sendResetEmail(to: string, resetUrl: string) {
    // Log what we see here
    console.log('Send email environment check:', {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER ? '***exists***' : 'missing',
    })

    // Create transporter when function is called
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: process.env.MAIL_PORT === '465',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    })

    // Rest of your email sending code
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to,
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Regards,<br>Your App Team</p>
      </div>
    `,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.messageId)
        return true
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error('Failed to send reset email')
    }
}

export async function sendOtpEmail(to: string, otp: string) {
    console.log('Send OTP email environment check:', {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER ? '***exists***' : 'missing',
    })

    // Create transporter when function is called
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: process.env.MAIL_PORT === '465',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    })

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to,
        subject: 'Your Password Reset OTP',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset OTP</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the following OTP code to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otp}</p>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Regards,<br>Your App Team</p>
      </div>
    `,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('OTP Email sent: ' + info.messageId)
        return true
    } catch (error) {
        console.error('Error sending OTP email:', error)
        throw new Error('Failed to send OTP email')
    }
}

export async function sendOrderConfirmationEmail(
    to: string,
    orderId: string,
    items: any[],
    totalPrice: number
) {
    console.log('Send order confirmation email environment check:', {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER ? '***exists***' : 'missing',
    })

    // Create transporter when function is called
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: process.env.MAIL_PORT === '465',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    })

    const itemList = items
        .map((item) => `<li>${item.productId} (x${item.quantity})</li>`)
        .join('')

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to,
        subject: 'Order Confirmation',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation</h2>
        <p>Thank you for your order! Your order ID is ${orderId}.</p>
        <p>Items in your order:</p>
        <ul>${itemList}</ul>
        <p>Total Price: $${totalPrice.toFixed(2)}</p>
        <p>Your order will be processed shortly. You will receive another email once your order has shipped.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Regards,<br>Your App Team</p>
      </div>
    `,
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Order confirmation email sent: ' + info.messageId)
        return true
    } catch (error) {
        console.error('Error sending order confirmation email:', error)
        throw new Error('Failed to send order confirmation email')
    }
}
