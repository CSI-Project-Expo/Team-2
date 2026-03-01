const sendEmail = async (options) => {
    // Development fallback: If API key is not set, mock the email by logging it to the console
    if (!process.env.BREVO_API_KEY) {
        console.log('\n==================================================');
        console.log('📧 MOCK EMAIL DELIVERED (Missing BREVO_API_KEY in .env)');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('==================================================\n');
        return;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: { name: 'HireSphere', email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: options.email }],
            subject: options.subject,
            textContent: options.message,
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to send email via Brevo');
    }
};

export default sendEmail;
