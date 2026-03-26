const subscriptionCancelledTemplate = (
    userName: string, 
    planName: string
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
                       style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #d1d5db;">
                    <tr>
                        <td>
                            <h2 style="color:#374151;margin-top:0;">Subscription Cancelled</h2>
                            <p style="color:#555555;line-height:1.6;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            <p style="color:#555555;line-height:1.6;">
                                This is a confirmation that your <strong>${planName}</strong> subscription has been cancelled. 
                            </p>
                            
                            <div style="background-color:#f3f4f6; border-radius:4px; padding:16px; margin:24px 0;">
                                <p style="color:#4b5563; font-size:14px; margin:0;">
                                    Your premium access will remain active until the end of your current billing period. After that, your account will move to the free tier.
                                </p>
                            </div>

                            <p style="color:#555555;line-height:1.6;">
                                We’re sorry to see you go! If you ever change your mind, we’d love to have you back. You can re-subscribe at any time with just one click.
                            </p>
                            
                            <a href="${process.env.FRONTEND_URL}/billing" 
                               style="display:inline-block;padding:12px 24px;
                                      background-color:#374151;color:#ffffff;
                                      text-decoration:none;border-radius:6px;
                                      font-weight:bold;margin:16px 0;">
                                View Pricing Plans
                            </a>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                Would you mind telling us why you cancelled? Your feedback helps us improve. Simply reply to this email to share your thoughts.
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

export default subscriptionCancelledTemplate;