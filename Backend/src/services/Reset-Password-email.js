const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async ({ email, resetUrl }) => {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: "Gmail", // You can use other services like 'Yahoo', 'Outlook', etc.
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_KEY, // Your email password or an app-specific password
        },
    });

    // Set up email data
    const mailOptions = {
        from: '"Dynamic Wander Wallet Team" <vkurmi307@gmail.com>', // Display name and email
        to: email,
        subject: "Reset Your Password",
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                <table width="100%" bgcolor="#f4f4f4" style="padding: 20px;">
                    <tr>
                        <td>
                            <table align="center" width="600" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <h1 style="color: #333;">Password Reset Request</h1>
                                        <p style="color: #777;">We noticed you requested a password reset for your Dynamic Wander Wallet account. If this was not you, please disregard this email.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding: 10px 0;">
                                        <p style="color: #555;">
                                            Click the button below to securely reset your password. For your safety, this link will expire in 10 minutes.
                                        </p>
                                        <a href="${resetUrl}" style="background-color: #28a745; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding: 20px; color: #999;">
                                        <p>If you didn't make this request, no further action is needed. However, if you suspect any unauthorized access, please contact our support team immediately.</p>
                                        <p>Safe Travels,<br/> The Dynamic Wander Wallet Team</p>
                                        <p>Need help? <a href="https://your-trip-app.com/support" style="color: #007bff; text-decoration: none;">Contact Support</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        `,
    };
    

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
