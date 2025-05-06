
/**
 * Email service for sending various types of emails
 */

/**
 * Send password reset email to user
 * @param {string} email - User's email address
 * @param {string} token - Reset password token
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = async (email, token) => {
  try {
    // In a production environment, integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll just log the email that would be sent
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    console.log(`
    Password Reset Email would be sent to: ${email}
    Subject: Reset Your Password
    Body:
    Hello,
    
    You requested a password reset. Please click the link below to reset your password:
    ${resetLink}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    `);
    
    // Production implementation would look like this:
    // await emailProvider.send({
    //   to: email,
    //   subject: "Reset Your Password",
    //   text: `Click here to reset your password: ${resetLink}`,
    //   html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    // });
    
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
};

module.exports = {
  sendResetPasswordEmail,
};
