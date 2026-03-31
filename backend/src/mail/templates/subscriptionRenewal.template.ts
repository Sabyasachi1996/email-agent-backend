const subscriptionRenewalTemplate = (
    userName: string, 
    planName: string, 
    amount: string, 
    nextBillingDate: string
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
                       style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #e5e7eb;">
                    <tr>
                        <td>
                            <h2 style="color:#333333;margin-top:0;">Payment Successful</h2>
                            <p style="color:#555555;line-height:1.6;">
                                Hi <strong>${userName}</strong>,
                            </p>
                            <p style="color:#555555;line-height:1.6;">
                                Good news! Your subscription for <strong>${planName}</strong> has been successfully renewed. Your access to all premium features has been extended.
                            </p>
                            
                            <div style="background-color:#f9fafb; border-radius:8px; padding:20px; margin:24px 0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="color:#6b7280; font-size:14px; padding-bottom:8px;">Amount Paid:</td>
                                        <td align="right" style="color:#111827; font-weight:bold; padding-bottom:8px;">${amount}</td>
                                    </tr>
                                    <tr>
                                        <td style="color:#6b7280; font-size:14px;">Next Renewal Date:</td>
                                        <td align="right" style="color:#111827; font-weight:bold;">${nextBillingDate}</td>
                                    </tr>
                                </table>
                            </div>

                            <p style="color:#555555;line-height:1.6;">
                                Your usage limits have been reset for the new billing cycle. You can now continue using the service without interruption.
                            </p>
                            
                            <a href="${process.env.FRONTEND_URL}/dashboard" 
                               style="display:inline-block;padding:12px 24px;
                                      background-color:#4F46E5;color:#ffffff;
                                      text-decoration:none;border-radius:6px;
                                      font-weight:bold;margin:16px 0;">
                                Go to Dashboard
                            </a>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;"/>
                            <p style="color:#999999;font-size:12px;">
                                If you have any questions regarding this charge, please contact our support team. You can manage your subscription settings anytime from your account dashboard.
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

export default subscriptionRenewalTemplate;