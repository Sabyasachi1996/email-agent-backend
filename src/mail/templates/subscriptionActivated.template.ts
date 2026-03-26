const subscriptionActivatedTemplate = (
    userName: string, 
    planName: string, 
    features: string[]
): string => `
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
                       style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #4F46E5;">
                    <tr>
                        <td>
                            <h2 style="color:#4F46E5;margin-top:0;">Welcome to ${planName}!</h2>
                            <p style="color:#555555;line-height:1.6;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            <p style="color:#555555;line-height:1.6;">
                                Your subscription is now **Active**. We are excited to have you on board! You now have full access to the following features:
                            </p>
                            
                            <ul style="color:#555555; line-height:1.8; padding-left:20px;">
                                ${features.map(f => `<li>${f}</li>`).join('')}
                            </ul>

                            <p style="color:#555555;line-height:1.6;">
                                You can start using our AI tools immediately from your dashboard.
                            </p>
                            
                            <a href="${process.env.FRONTEND_URL}/dashboard" 
                               style="display:inline-block;padding:12px 24px;
                                      background-color:#4F46E5;color:#ffffff;
                                      text-decoration:none;border-radius:6px;
                                      font-weight:bold;margin:16px 0;">
                                Start Exploring
                            </a>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                Need help getting started? Just reply to this email or visit our documentation page.
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

export default subscriptionActivatedTemplate;