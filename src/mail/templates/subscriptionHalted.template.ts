const subscriptionHaltedTemplate = (
    userName: string, 
    planName: string, 
    updateUrl: string
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
                       style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #fee2e2;">
                    <tr>
                        <td>
                            <h2 style="color:#dc2626;margin-top:0;">Action Required: Payment Failed</h2>
                            <p style="color:#555555;line-height:1.6;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            <p style="color:#555555;line-height:1.6;">
                                We were unable to process the recurring payment for your <strong>${planName}</strong> subscription after multiple attempts.
                            </p>
                            
                            <div style="background-color:#fff1f2; border-left:4px solid #dc2626; border-radius:4px; padding:16px; margin:24px 0;">
                                <p style="color:#991b1b; font-size:14px; margin:0;">
                                    <strong>Status:</strong> Your premium access has been temporarily suspended.
                                </p>
                            </div>

                            <p style="color:#555555;line-height:1.6;">
                                To restore your services and reset your usage limits, please update your payment method or re-subscribe through your dashboard.
                            </p>
                            
                            <a href="${updateUrl}" 
                               style="display:inline-block;padding:12px 24px;
                                      background-color:#dc2626;color:#ffffff;
                                      text-decoration:none;border-radius:6px;
                                      font-weight:bold;margin:16px 0;">
                                Restore My Subscription
                            </a>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                If you believe this is an error, please check with your bank or contact our support team immediately. 
                                We want to get you back up and running as soon as possible!
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

export default subscriptionHaltedTemplate;