// Email service using Resend (can be replaced with SendGrid, Nodemailer, etc.)
// This is a template that works with any email service

export async function sendWelcomeEmail(email: string, name: string, password: string, loginUrl: string) {
  try {
    // TODO: Replace with your email service (Resend, SendGrid, Nodemailer)
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'noreply@taskflow.com',
    //   to: email,
    //   subject: 'Welcome to TaskFlow - Your Login Credentials',
    //   html: generateWelcomeEmailHTML(name, email, password, loginUrl),
    // });

    console.log(`Welcome email sent to ${email}`)
    console.log("Login credentials:", { email, password })
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export async function sendWithdrawalApprovedEmail(email: string, name: string, amount: number) {
  try {
    // TODO: Send withdrawal approval email
    console.log(`Withdrawal approved email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export async function sendWithdrawalRejectedEmail(email: string, name: string, amount: number, reason?: string) {
  try {
    // TODO: Send withdrawal rejection email
    console.log(`Withdrawal rejected email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

function generateWelcomeEmailHTML(name: string, email: string, password: string, loginUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin-top: 20px; }
          .credentials { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .code { font-family: monospace; font-weight: bold; color: #667eea; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TaskFlow!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your account has been created successfully! You're ready to start earning rewards by completing tasks.</p>
            
            <div class="credentials">
              <p><strong>Your Login Credentials:</strong></p>
              <p>Email: <span class="code">${email}</span></p>
              <p>Password: <span class="code">${password}</span></p>
            </div>
            
            <p><strong>Important:</strong> Please change your password after your first login for security.</p>
            
            <a href="${loginUrl}" class="button">Login to Dashboard</a>
            
            <p>Start completing tasks and earn up to $45 in rewards!</p>
            <p>Best regards,<br>TaskFlow Team</p>
          </div>
        </div>
      </body>
    </html>
  `
}
