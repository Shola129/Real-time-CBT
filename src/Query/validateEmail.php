<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;
use NewdichMail\Index;


class validateEmail{
    private $dto;
    private $table = Platform::ADMINS_TABLE;
    private $table2 = Platform::OTPDB_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email,
        ];
        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        $decode = json_decode($mig, true);
        $name = $this->dto->fullname;
        if($decode['status']==='success'){
            return json_encode([
                        'status'=>'failed',
                        'response'=>'Email already exist'
                    ], JSON_PRETTY_PRINT);
        }
        else{
            $email = $this->dto->email;
            $name = $this->dto->fullname;
            $otp = $this->dto->otp;
            $data = [
                'email' => $this->dto->email,
                'otp' => $this->dto->otp
            ];
            $mig2 = new Migration(null, $this->table2);
            $mig3 = $mig2->save($data);
            $decodeMig = json_decode($mig3, true);
            if($decodeMig['status']==='success'){
                $otp = $this->dto->otp;
                $name = $this->dto->fullname;
                $body = "
                <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>OTP Verification</title>

                    <style>
                        body{
                            margin:0;
                            padding:40px 15px;
                            background:#eef7ff;
                            font-family:Arial, Helvetica, sans-serif;
                            color:#1e293b;
                        }

                        .container{
                            max-width:600px;
                            margin:auto;
                            background:#ffffff;
                            border-radius:12px;
                            overflow:hidden;
                            box-shadow:0 8px 25px rgba(0,0,0,.08);
                        }

                        .header{
                            background:#3498db;
                            color:#fff;
                            text-align:center;
                            padding:30px;
                        }

                        .header h1{
                            margin:0;
                            font-size:26px;
                        }

                        .content{
                            padding:40px 35px;
                            text-align:center;
                        }

                        .content h2{
                            margin-top:0;
                            color:#0f172a;
                        }

                        .content p{
                            font-size:15px;
                            line-height:1.7;
                            color:#64748b;
                        }

                        .otp-box{
                            display:inline-block;
                            margin:30px 0;
                            padding:18px 40px;
                            background:#e0f2fe;
                            border:2px dashed #3498db;
                            border-radius:10px;
                            font-size:34px;
                            font-weight:bold;
                            letter-spacing:8px;
                            color:#2563eb;
                        }

                        .note{
                            font-size:13px;
                            color:#94a3b8;
                            line-height:1.6;
                        }

                        .footer{
                            text-align:center;
                            padding:20px;
                            background:#f8fbff;
                            border-top:1px solid #e5e7eb;
                            color:#94a3b8;
                            font-size:13px;
                        }
                    </style>

                    </head>

                    <body>

                    <div class='container'>

                        <div class='header'>
                            <h1>EduTest</h1>
                        </div>

                        <div class='content'>

                            <h2>Email Verification</h2>

                            <p>
                                Welcome $name! Use the One-Time Password (OTP) below to verify your email
                                address and complete your registration.
                            </p>

                            <div class='otp-box'>
                                $otp
                            </div>

                            <p>
                                This verification code will expire in
                                <strong>1 min</strong>.
                            </p>

                            <p class='note'>
                                If you didn't request this code, you can safely ignore this email.
                                Never share your verification code with anyone.
                            </p>

                        </div>

                        <div class='footer'>
                            © 2026 EduTest. All rights reserved.
                        </div>

                    </div>

                    </body>
                    </html>";
                $newMail = new Index();
                $mail = $newMail->sendOtp('OTP verification',$body, $email);
                $decodeMail = json_decode($mail, true);
                if($decodeMail['status']==='success'){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'can now be redirect to otp verification page'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return json_encode([
                        'status'=>'failed',
                        // 'response'=>$mail,
                        'response'=>'Unable to send otp, check your connection or email'
                    ], JSON_PRETTY_PRINT);
                }
            }
            else{
                return json_encode([
                        'status'=>'failed',
                        'response'=>'Error occur, try again later.'
                    ], JSON_PRETTY_PRINT);
            }
        }
    }
}
?>