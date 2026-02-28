import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Development fallback: If credentials are not set, mock the email by logging it to the console
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('\n==================================================');
        console.log('📧 MOCK EMAIL DELIVERED (Missing SMTP Credentials in .env)');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('==================================================\n');
        return;
    }

    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use gmail or preferred SMTP service
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, // App password
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `HireSphere <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
