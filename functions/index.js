// Custom Email Verification with Firebase Functions
// This requires Firebase Blaze plan and email service (SendGrid, Mailgun, etc.)

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Configure your email service (example with SendGrid)
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: 'YOUR_SENDGRID_API_KEY' // Replace with your SendGrid API key
    }
});

// Send custom verification email
exports.sendCustomVerificationEmail = functions.auth.user().onCreate(async (user) => {
    const email = user.email;
    const displayName = user.displayName || 'there';
    
    // Generate custom verification link
    const actionCodeSettings = {
        url: 'https://exvertixe.com/dashboard.html',
        handleCodeInApp: false,
    };
    
    try {
        const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
        
        const mailOptions = {
            from: '"Exvertixe" <noreply@exvertixe.com>',
            to: email,
            subject: 'Verify your Exvertixe account - Welcome aboard! 🎉',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 100%;">
                                    
                                    <!-- Header with gradient -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #af73ef, #3f8fef); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Exvertixe</h1>
                                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Premium Marketing Services</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Main content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="margin: 0 0 20px 0; color: #1a1a2e; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                                            
                                            <p style="margin: 0 0 20px 0; color: #4a4a68; font-size: 16px; line-height: 1.6;">
                                                Hello ${displayName},
                                            </p>
                                            
                                            <p style="margin: 0 0 20px 0; color: #4a4a68; font-size: 16px; line-height: 1.6;">
                                                Thank you for creating an account with Exvertixe! To get started, please verify your email address by clicking the button below.
                                            </p>
                                            
                                            <!-- Button -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                                <tr>
                                                    <td align="center">
                                                        <a href="${link}" style="display: inline-block; background: linear-gradient(135deg, #af73ef, #3f8fef); color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(175, 115, 239, 0.3);">
                                                            Verify Email Address
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <p style="margin: 20px 0 0 0; color: #4a4a68; font-size: 16px; line-height: 1.6;">
                                                Once verified, you'll have full access to:
                                            </p>
                                            
                                            <ul style="margin: 15px 0; padding-left: 20px; color: #4a4a68; font-size: 15px; line-height: 1.8;">
                                                <li>Subscribe to monthly marketing packages</li>
                                                <li>Order one-time services</li>
                                                <li>Manage your projects and billing</li>
                                                <li>Access your personalized dashboard</li>
                                            </ul>
                                            
                                            <p style="margin: 20px 0 0 0; color: #4a4a68; font-size: 14px; line-height: 1.6;">
                                                If you didn't create an account with Exvertixe, you can safely ignore this email.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Backup link section -->
                                    <tr>
                                        <td style="padding: 0 30px 30px 30px; border-top: 1px solid #e8e8e8;">
                                            <p style="margin: 20px 0 10px 0; color: #999; font-size: 13px; line-height: 1.5;">
                                                If the button doesn't work, copy and paste this link into your browser:
                                            </p>
                                            <p style="margin: 0; word-break: break-all;">
                                                <a href="${link}" style="color: #af73ef; font-size: 13px; text-decoration: underline;">${link}</a>
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e8e8e8;">
                                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                                <strong>Need help?</strong> Contact us at 
                                                <a href="mailto:info@exvertixe.com" style="color: #af73ef; text-decoration: none;">info@exvertixe.com</a>
                                            </p>
                                            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                                                © 2025 Exvertixe. All rights reserved.
                                            </p>
                                            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                                                Phone: +960 9777354
                                            </p>
                                        </td>
                                    </tr>
                                    
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Custom verification email sent to:', email);
        
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
});
