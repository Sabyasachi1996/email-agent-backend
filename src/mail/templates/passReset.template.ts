const passwordResetTemplate = (resetUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 0;">
                <table width="600" cellpadding="0" cellspacing="0" 
                       style="background:#ffffff;border-radius:8px;padding:40px;">
                    <tr>
                        <td>
                            <h2 style="color:#333333;margin-top:0;">Password Reset Request</h2>
                            <p style="color:#555555;line-height:1.6;">
                                We received a request to reset your password. 
                                Click the button below to proceed. 
                                This link is valid for <strong>15 minutes</strong>.
                            </p>
                            <a href="${resetUrl}" 
                               style="display:inline-block;padding:12px 24px;
                                      background-color:#4F46E5;color:#ffffff;
                                      text-decoration:none;border-radius:6px;
                                      font-weight:bold;margin:16px 0;">
                                Reset Password
                            </a>
                            <p style="color:#555555;line-height:1.6;">
                                If you did not request this, please ignore this email. 
                                Your password will not change.
                            </p>
                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                This link will expire in 15 minutes. 
                                If you need a new link, go back to the app and request again.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
export default passwordResetTemplate;