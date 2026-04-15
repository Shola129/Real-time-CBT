<?php
namespace NewdichApp\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichMail\Index;

class InsertData{
    private $dto;
    private $table = Platform::USERS_TABLE;
    private $table2 = Platform::DEPARTMENT_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department
            ];
        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $col = "email";
            $val = $this->dto->email;
            $regNum = "2026/EXAM/".$this->dto->otp;
            $data = [
                "email"=>$this->dto->email,
                "fullname"=>$this->dto->fullname,
                "password"=>$this->dto->password,
                "role"=>"USER",
                "department"=>$this->dto->department,
                "date_created"=>$this->dto->date_created,
                "regNum"=>$regNum,
                "result"=>$this->dto->result ?? '',
                'state'=>$this->dto->state ?? '',
                "gender"=>$this->dto->gender ?? '',
                "year"=>$this->dto->year ?? '',
                "dob"=>$this->dto->dob,
                "phone"=>$this->dto->phone,
                "status"=>"set"
            ];

            $newMig2 = new Migration(null, $this->table);
            $mig2 = $newMig2->saveUnique($col, $val ,$data);
            $decodeMig2 = json_decode($mig2, true);
            if($decodeMig["status"]==="success"){
               $email= $this->dto->email;
               $fullname=$this->dto->fullname;
               $department=$this->dto->department;
               $date_created=$this->dto->date_created;
               $regNum1=$regNum;
               $state=$this->dto->state;
               $gender=$this->dto->gender;
               $year=$this->dto->year;
               $dob=$this->dto->dob;
               $phone=$this->dto->phone;

               $body = "
                <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes'>
                        <title>Welcome - Your Registration Details</title>
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
                                max-width: 600px;
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

                            .welcome-badge {
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
                                margin-bottom: 28px;
                                font-size: 15px;
                                background: #f9fbfd;
                                padding: 14px 18px;
                                border-radius: 16px;
                                border: 1px solid #eef2fa;
                            }

                            /* user details card */
                            .user-details-card {
                                background: linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%);
                                border-radius: 20px;
                                padding: 8px 0;
                                margin: 24px 0 20px 0;
                                border: 1px solid #dce5f2;
                                overflow: hidden;
                            }

                            .section-title {
                                background-color: #0a2b4e;
                                color: white;
                                padding: 12px 20px;
                                font-size: 15px;
                                font-weight: 600;
                                letter-spacing: 0.5px;
                            }

                            .details-grid {
                                padding: 8px 0;
                            }

                            .detail-row {
                                display: flex;
                                align-items: baseline;
                                padding: 12px 20px;
                                border-bottom: 1px solid #e9edf2;
                            }

                            .detail-row:last-child {
                                border-bottom: none;
                            }

                            .detail-label {
                                width: 130px;
                                font-weight: 700;
                                color: #0a2b4e;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.3px;
                            }

                            .detail-value {
                                flex: 1;
                                color: #1e2f3c;
                                font-size: 15px;
                                font-weight: 500;
                                word-break: break-word;
                            }

                            .detail-value.email-value, .detail-value.reg-value {
                                color: #0a2b4e;
                                font-family: monospace;
                                font-size: 14px;
                            }

                            .highlight-value {
                                background-color: #eef3fc;
                                padding: 4px 10px;
                                border-radius: 20px;
                                display: inline-block;
                            }

                            .info-box {
                                background-color: #fff8e7;
                                border-left: 4px solid #f5a623;
                                padding: 14px 18px;
                                border-radius: 14px;
                                margin: 24px 0 16px;
                                font-size: 13px;
                                color: #8a6e2b;
                            }

                            .action-button {
                                text-align: center;
                                margin: 28px 0 20px;
                            }

                            .dashboard-btn {
                                display: inline-block;
                                background-color: #0a2b4e;
                                color: white;
                                font-weight: 600;
                                padding: 12px 32px;
                                border-radius: 40px;
                                text-decoration: none;
                                font-size: 15px;
                                letter-spacing: 0.5px;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                transition: all 0.2s ease;
                            }

                            .dashboard-btn:hover {
                                background-color: #123e66;
                                transform: translateY(-1px);
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
                                    width: 100px;
                                    font-size: 11px;
                                }
                                .detail-value {
                                    font-size: 13px;
                                }
                                .section-title {
                                    font-size: 13px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class='email-container'>
                            <!-- HEADER: deep blue background, white text, red accent border -->
                            <div class='email-header'>
                                <div class='header-icon'>🎓</div>
                                <h1>Registration Confirmed!</h1>
                                <div class='welcome-badge'>Welcome Aboard</div>
                            </div>

                            <!-- MAIN CONTENT -->
                            <div class='email-body'>
                                <div class='greeting'>
                                    <strong>Dear <span id='fullname-display-greeting'>Valued User</span>,</strong>
                                </div>

                                <div class='message-text'>
                                    Thank you for successfully registering with us! Your account has been created and is now active. 
                                    Below are your complete registration details. Please review them carefully and keep this information for your records.
                                </div>

                                <!-- User Details Card -->
                                <div class='user-details-card'>
                                    <div class='section-title'>
                                        📋 REGISTRATION INFORMATION
                                    </div>
                                    <div class='details-grid'>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Full Name:</span>
                                            <span class='detail-value' id='fullname-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Email Address:</span>
                                            <span class='detail-value email-value' id='email-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Registration Number:</span>
                                            <span class='detail-value reg-value' id='regNum-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Department:</span>
                                            <span class='detail-value' id='department-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Year of Study:</span>
                                            <span class='detail-value' id='year-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Date of Birth:</span>
                                            <span class='detail-value' id='dob-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Gender:</span>
                                            <span class='detail-value' id='gender-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>State:</span>
                                            <span class='detail-value' id='state-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Phone Number:</span>
                                            <span class='detail-value' id='phone-display'>—</span>
                                        </div>
                                        <div class='detail-row'>
                                            <span class='detail-label'>Date Created:</span>
                                            <span class='detail-value' id='date_created-display'>—</span>
                                        </div>
                                    </div>
                                </div>

                                <div class='info-box'>
                                    <strong>ℹ️ Next Steps:</strong><br>
                                    • You can now log in using your email and registration number.<br>
                                    • Complete your profile setup and explore available resources.<br>
                                    • Keep your registration number safe for future reference.
                                </div>

                                <!-- <div class='action-button'>
                                    <a href='#' class='dashboard-btn' style='color: white; text-decoration: none;'>🔐 Login to Your Account</a>
                                </div> -->

                                <!-- Important security note with red accent -->
                                <div class='important-note'>
                                    <i>🛡️ Important Reminders:</i><br>
                                    • Never share your registration number or password with anyone.<br>
                                    • If any details above are incorrect, contact support immediately.<br>
                                    • Keep your email and phone number updated for important notifications.<br>
                                    • This is an automated message — please save this email for reference.
                                </div>

                                <!-- additional helpful note -->
                                <div class='footer-note'>
                                    <p>📞 <strong>Need assistance?</strong> Contact our support team at <span style='color:#0a2b4e;'>support@universityportal.com</span></p>
                                    <p style='margin-top: 8px; font-size: 11px;'>✨ Please review your details and confirm accuracy.</p>
                                </div>
                            </div>

                            <!-- FOOTER: subtle blue-white pattern -->
                            <div class='email-footer'>
                                <p style='margin-bottom:4px;'>© 2026 Registration Portal — All Rights Reserved</p>
                                <p>This is your official registration confirmation.</p>
                            </div>
                        </div>
                    </body>
                </html>
               ";
               $newmail = new Index();
               $mail = $newmail->sendOtp("Welcome On Board", $body, $email);
               $decodeMail = json_decode($mail, true);
               if($decodeMail["status"]==="success"){
                    return json_encode([
                        "status"=>"success",
                        "response"=>"successfully regsitered",
                    ], JSON_PRETTY_PRINT);
               }
               else{
                    return json_encode([
                        "status"=>"success",
                        "response"=>"successfully regsitered",
                ], JSON_PRETTY_PRINT);
               }
            }
        }
        else{
            return json_encode([
                'status'=>'fail',
                'response'=>'department picked is not available'
            ], JSON_PRETTY_PRINT);
        }
    }

}

?>