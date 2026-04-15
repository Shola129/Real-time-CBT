<?php
namespace NewdichApp\Query;
use NewdichSchema\Platform;
use NewdichDto\AnsofraDto;
use NewdichSchema\Migration;
use NewdichMail\Index;

class VerifyEmail{
    private $dto;
    private $table = Platform::USERS_TABLE;
    private $table2 = Platform::OTPDB_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email
        ];
        
        $neMig = new Migration(null, $this->table);
        $mig = $neMig->get($where, 0, 1);
        $deMig = json_decode($mig, true);
        if($deMig['status']==="failed"){
            $otp = $this->dto->otp;
            $emailToSend = $this->dto->email;
            $neMig2 = new Migration(null, $this->table2);
            $data = [
                'email'=>$emailToSend,
                'otp'=>$otp
            ];
            $mig = $neMig2->save($data);
            $decodeMig = json_decode($mig, true);
            if($decodeMig["status"]==="success"){
                $email = $this->dto->email;
                $name = $this->dto->name;
                $body = "
                        <!DOCTYPE html>
                            <html lang='en'>
                            <head>
                                <meta charset='UTF-8'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes'>
                                <title>Your OTP Verification Code</title>
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
                                        max-width: 560px;
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
                                        font-size: 26px;
                                        font-weight: 600;
                                        letter-spacing: -0.2px;
                                        margin: 8px 0 6px 0;
                                    }

                                    .otp-badge {
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

                                    .message-text {
                                        color: #2c3e4e;
                                        margin-bottom: 24px;
                                        font-size: 15px;
                                        background: #f9fbfd;
                                        padding: 14px 18px;
                                        border-radius: 16px;
                                        border: 1px solid #eef2fa;
                                    }

                                    .user-details {
                                        background-color: #f0f5ff;
                                        border-radius: 16px;
                                        padding: 18px 20px;
                                        margin: 20px 0 24px 0;
                                        border: 1px solid #dce5f2;
                                    }

                                    .detail-row {
                                        display: flex;
                                        align-items: baseline;
                                        padding: 8px 0;
                                        border-bottom: 1px solid #e2e9f0;
                                    }

                                    .detail-row:last-child {
                                        border-bottom: none;
                                    }

                                    .detail-label {
                                        width: 70px;
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

                                    /* OTP box - classic red and white prominent design */
                                    .otp-container {
                                        text-align: center;
                                        margin: 28px 0 22px 0;
                                        background: #ffffff;
                                        border: 2px solid #d32f2f;
                                        border-radius: 24px;
                                        padding: 24px 20px;
                                        background: linear-gradient(135deg, #fffaf5 0%, #ffffff 100%);
                                        box-shadow: 0 4px 12px rgba(211, 47, 47, 0.08);
                                    }

                                    .otp-label {
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        letter-spacing: 2px;
                                        color: #d32f2f;
                                        font-weight: 700;
                                        margin-bottom: 14px;
                                    }

                                    .otp-code {
                                        font-size: 42px;
                                        font-weight: 800;
                                        font-family: 'Courier New', 'SF Mono', 'JetBrains Mono', monospace;
                                        letter-spacing: 10px;
                                        color: #0a2b4e;
                                        background: #f2f6fc;
                                        display: inline-block;
                                        padding: 14px 28px;
                                        border-radius: 60px;
                                        border: 1px solid #cfdfed;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                                    }

                                    .otp-expiry {
                                        font-size: 12px;
                                        color: #d32f2f;
                                        margin-top: 14px;
                                        font-weight: 500;
                                    }

                                    .action-note {
                                        text-align: center;
                                        margin: 16px 0 10px;
                                        font-size: 13px;
                                        color: #5f7a92;
                                    }

                                    .info-message {
                                        background-color: #e8f0fe;
                                        border-radius: 14px;
                                        padding: 14px 18px;
                                        margin: 24px 0 10px;
                                        font-size: 13px;
                                        color: #2c5282;
                                        text-align: left;
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
                                        .otp-code {
                                            font-size: 32px;
                                            letter-spacing: 6px;
                                            padding: 10px 18px;
                                        }
                                        .detail-label {
                                            width: 60px;
                                            font-size: 13px;
                                        }
                                    }
                                </style>
                            </head>
                            <body>
                                <div class='email-container'>
                                    <!-- HEADER: deep blue background, white text, red accent border -->
                                    <div class='email-header'>
                                        <div class='header-icon'>🔐</div>
                                        <h1>Verification Code (OTP)</h1>
                                        <div class='otp-badge'>One-Time Password</div>
                                    </div>

                                    <!-- MAIN CONTENT -->
                                    <div class='email-body'>
                                        <div class='greeting'>
                                            <strong>Hello, <span id='user-name-greeting'>Valued User</span>!</strong>
                                        </div>

                                        <div class='message-text'>
                                            You have requested to verify your identity. Please use the One-Time Password (OTP) below to complete your verification process. 
                                            This code is required to access your account or perform secure actions.
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
                                        </div>

                                        <!-- OTP Verification Block - Prominent classic design with red border and blue code -->
                                        <div class='otp-container'>
                                            <div class='otp-label'>🔑 Your Verification Code</div>
                                            <div class='otp-code' id='otp-code-display'>$otp</div>
                                            <div class='otp-expiry'>⏰ This code expires in <span class='red-dot'>10 minutes</span></div>
                                            <div class='action-note'>Enter this code on the verification page to confirm your identity</div>
                                        </div>


                                        <!-- additional helpful note -->
                                        <div class='footer-note'>
                                            <p>📞 <strong>Need help?</strong> Contact our support team at <span style='color:#0a2b4e;'>support@secureplatform.com</span></p>
                                            <p style='margin-top: 8px; font-size: 11px;'>✨ This is an automated message — no reply needed.</p>
                                        </div>
                                    </div>

                                    <!-- FOOTER: subtle blue-white pattern -->
                                    <div class='email-footer'>
                                        <p style='margin-bottom:4px;'>© 2026 Secure Verification System — One-Time Password</p>
                                        <p>Protecting your account with multi-factor authentication.</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                ";
                $neMail = New Index();
                $mail = $neMail->sendOtp("Verification", $body, $emailToSend);
                $decodeMail = json_decode($mail, true);
                if($decodeMail["status"]==="success"){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'allowed to next step'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                   return json_encode([
                    'status'=>'fail',
                    'response'=>'error'
                ], JSON_PRETTY_PRINT);
                }
            }
            else{
                return json_encode([
                    'status'=>'fail',
                    'response'=>'error'
                ], JSON_PRETTY_PRINT);
            }   
        }
        else{
            return json_decode([
                'status'=>'failed',
                'response'=>'email already exit'
            ], JSON_PRETTY_PRINT);
        }
    }
}

?>