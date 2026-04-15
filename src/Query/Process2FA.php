<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichMail\Index;
use NewdichSchema\Migration;
use NewdichSchema\Platform;
use NewdichSchema\Settings;

class Process2FA{
    private $dto;
    private $table = Platform::ADMINAPPROVE_TABLE;
    private $emailR = Settings::APP_OTP_EMAIL;
    
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'email'=>$this->dto->email,
            'otp'=>$this->dto->otpCode,
            'fullname'=>$this->dto->fullname
        ];
        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($data,0,1);
        $decodemig= json_decode($mig, true);
        if($decodemig['status']==='success'){
            $name = $this->dto->fullname;
            $email = $this->dto->email;
            // $body = "$name is now qunlifies for reacting Admin dashboard with email $email";
        $body = "
        <!DOCTYPE html>
            <html lang='en'>
                <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes'>
                <title>New Admin Account Created - Authorization Required</title>
                <style>
                    /* Reset & base styles for email client compatibility */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        background-color: #eef2f7;
                        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        line-height: 1.5;
                        padding: 24px 16px;
                    }

                    /* main email container – classic card style */
                    .email-container {
                        max-width: 580px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 20px;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03);
                        overflow: hidden;
                        border: 1px solid #e0e7ed;
                    }

                    /* header area: blue + white + red accent */
                    .email-header {
                        background: linear-gradient(135deg, #0a2b4e 0%, #0f3b6f 100%);
                        padding: 28px 32px 24px 32px;
                        text-align: center;
                        border-bottom: 4px solid #d32f2f;
                    }

                    .header-icon {
                        font-size: 48px;
                        margin-bottom: 10px;
                        display: inline-block;
                        background: rgba(255,255,255,0.12);
                        padding: 12px;
                        border-radius: 60px;
                        line-height: 1;
                    }

                    .email-header h1 {
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                        letter-spacing: -0.2px;
                        margin: 8px 0 6px 0;
                    }

                    .alert-badge {
                        background-color: #d32f2f;
                        color: white;
                        display: inline-block;
                        padding: 5px 16px;
                        border-radius: 40px;
                        font-size: 13px;
                        font-weight: 500;
                        margin-top: 12px;
                        letter-spacing: 0.3px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    }

                    /* body content */
                    .email-body {
                        padding: 32px 32px 28px 32px;
                        background: #ffffff;
                    }

                    .greeting {
                        font-size: 18px;
                        color: #1a2c3e;
                        margin-bottom: 20px;
                        font-weight: 500;
                        border-left: 4px solid #d32f2f;
                        padding-left: 18px;
                        background: #fefaf9;
                        border-radius: 0 12px 12px 0;
                    }

                    .greeting strong {
                        color: #0a2b4e;
                    }

                    .notification-box {
                        background-color: #fff8e7;
                        border-left: 4px solid #f5a623;
                        padding: 16px 20px;
                        border-radius: 14px;
                        margin: 20px 0;
                        font-size: 14px;
                        color: #5a4a1a;
                    }

                    .user-details {
                        background-color: #f0f5ff;
                        border-radius: 16px;
                        padding: 18px 20px;
                        margin: 24px 0;
                        border: 1px solid #dce5f2;
                    }

                    .detail-row {
                        display: flex;
                        align-items: baseline;
                        padding: 10px 0;
                        border-bottom: 1px solid #e2e9f0;
                    }

                    .detail-row:last-child {
                        border-bottom: none;
                    }

                    .detail-label {
                        width: 80px;
                        font-weight: 700;
                        color: #0a2b4e;
                        font-size: 14px;
                    }

                    .detail-value {
                        flex: 1;
                        color: #1e2f3c;
                        font-size: 15px;
                        font-weight: 500;
                        word-break: break-all;
                    }

                    .detail-value.email-value {
                        color: #0a2b4e;
                        font-family: monospace;
                        font-size: 14px;
                    }

                    .status-badge {
                        display: inline-block;
                        background-color: #ffecb3;
                        color: #c47d00;
                        padding: 4px 12px;
                        border-radius: 30px;
                        font-size: 12px;
                        font-weight: 600;
                        margin-left: 8px;
                    }

                    /* Authorization action buttons */
                    .action-buttons {
                        display: flex;
                        gap: 16px;
                        justify-content: center;
                        margin: 28px 0 20px;
                        flex-wrap: wrap;
                    }

                    .btn-approve {
                        display: inline-block;
                        background-color: #0a2b4e;
                        color: white;
                        font-weight: 600;
                        padding: 12px 28px;
                        border-radius: 40px;
                        text-decoration: none;
                        font-size: 15px;
                        letter-spacing: 0.5px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .btn-approve:hover {
                        background-color: #123e66;
                        transform: translateY(-1px);
                    }

                    .btn-reject {
                        display: inline-block;
                        background-color: #ffffff;
                        color: #d32f2f;
                        font-weight: 600;
                        padding: 12px 28px;
                        border-radius: 40px;
                        text-decoration: none;
                        font-size: 15px;
                        letter-spacing: 0.5px;
                        border: 1.5px solid #d32f2f;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .btn-reject:hover {
                        background-color: #fff5f5;
                        transform: translateY(-1px);
                    }

                    .info-message {
                        background-color: #e8f0fe;
                        border-radius: 14px;
                        padding: 14px 18px;
                        margin: 20px 0 10px;
                        font-size: 13px;
                        color: #2c5282;
                        text-align: center;
                    }

                    .important-note {
                        background-color: #fff5f5;
                        border-left: 4px solid #d32f2f;
                        padding: 14px 18px;
                        border-radius: 14px;
                        margin: 28px 0 10px 0;
                        font-size: 13px;
                        color: #a12626;
                    }

                    .important-note i {
                        font-style: normal;
                        font-weight: 600;
                    }

                    .footer-note {
                        margin-top: 24px;
                        border-top: 1px dashed #cbdbe0;
                        padding-top: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #5f7a92;
                    }

                    .email-footer {
                        background-color: #f8fafc;
                        padding: 18px 32px;
                        text-align: center;
                        font-size: 11px;
                        color: #4a627a;
                        border-top: 1px solid #e2e9f0;
                    }

                    .red-dot {
                        color: #d32f2f;
                        font-weight: bold;
                    }

                    @media (max-width: 560px) {
                        .email-body {
                            padding: 24px 20px;
                        }
                        .email-header {
                            padding: 22px 20px;
                        }
                        .detail-label {
                            width: 70px;
                            font-size: 13px;
                        }
                        .action-buttons {
                            gap: 12px;
                        }
                        .btn-approve, .btn-reject {
                            padding: 10px 20px;
                            font-size: 14px;
                        }
                    }
                </style>
                </head>
                <body>
                <div class='email-container'>
                    <!-- HEADER: deep blue background, white text, red accent border -->
                    <div class='email-header'>
                        <div class='header-icon'>👤</div>
                        <h1>New Admin Account Created</h1>
                        <div class='alert-badge'>⚠️ Authorization Required</div>
                    </div>

                    <!-- MAIN CONTENT -->
                    <div class='email-body'>
                        <div class='greeting'>
                            <strong>Dear Administrator,</strong>
                        </div>

                        <div class='notification-box'>
                            🔔 A new admin account has been successfully created and is pending your authorization. 
                            Please review the user details below and take appropriate action.
                        </div>

                        <!-- User information section: name and email dynamic placeholders -->
                        <div class='user-details'>
                            <div class='detail-row'>
                                <span class='detail-label'>👤 Name:</span>
                                <span class='detail-value' id='user-name-display'>$name</span>
                            </div>
                            <div class='detail-row'>
                                <span class='detail-label'>📧 Email:</span>
                                <span class='detail-value email-value' id='user-email-display'>$email</span>
                            </div>
                            <!-- <div class='detail-row'>
                                <span class='detail-label'>🕒 Created:</span>
                                <span class='detail-value' id='creation-time'>April 15, 2026 - 10:32 AM UTC</span>
                            </div> -->
                            <div class='detail-row'>
                                <span class='detail-label'>📋 Status:</span>
                                <span class='detail-value'>Completed </span>
                            </div>
                        </div>

                        
                        

                        <!-- Important security note with red accent -->
                        <!-- <div class='important-note'>
                            <i>🔐 Security Checklist:</i><br>
                            • Verify that this request was expected and authorized by your team.<br>
                            • Cross-check the user's email domain and identity before approving.<br>
                            • All admin actions are logged for compliance and audit purposes.<br>
                            • If you did not initiate this, please reject immediately and contact IT security.
                        </div> -->

                        <!-- additional helpful note -->
                        <div class='footer-note'>
                            <p>📌 <strong>Need more information?</strong> Contact the user directly at <span style='color:#0a2b4e;' id='contact-email'>provided email</span> or escalate to super admin.</p>
                            <p style='margin-top: 8px; font-size: 11px;'>🛡️ This is an automated admin notification. Do not ignore — action required.</p>
                        </div>
                    </div>

                    <!-- FOOTER: subtle blue-white pattern -->
                    <div class='email-footer'>
                        <p style='margin-bottom:4px;'>© 2026 Admin Security System — Account Verification Portal</p>
                        <!-- <p>Authorization is mandatory before dashboard access is granted.</p> -->
                    </div>
                </div>


                    
                    
                </body>
                </html>
            ";
            $newMail = new Index();
            $mail = $newMail->sendOtp('Verification success',$body, $this->emailR);
            $decodeMail = json_decode($mail, true);
            if($decodeMail['status']==='success'){
                return json_encode([
                    'status'=>'success',
                    'response'=>'can now be redirect to register page'
                ], JSON_PRETTY_PRINT);
            }
            else{
                return json_encode([
                    'status'=>'failed',
                    'response'=>'can not redirect to register page'
                ], JSON_PRETTY_PRINT);
            }
        }
        else{
            return $mig;
        }
    }
}

?>