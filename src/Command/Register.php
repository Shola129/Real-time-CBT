<?php
namespace NewdichSrc\Command;
use NewdichMail\Index;
use NewdichSchema\Platform;
use NewdichSchema\Settings;
use NewdichSchema\Migration;
Use NewdichDto\AnsofraDto;

class Register{
    private $dto;
    private $table = Platform::ADMINS_TABLE;
    private $emailR = Settings::APP_OTP_EMAIL;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }
    
    private function ab($length = 10){
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $result = '';
        for($i = 0; $i < $length; $i++){
            $result .=$characters[random_int(0, strlen($characters) -1)];
        }
        return $result;
    }


    public function process(){
        $col = "email";
        $val = $this->dto->email;
        $otp = $this->dto->otp;
        $org_name = $this->dto->organization_name;
        $org_code = substr($org_name, 0,6) . "-". $this->ab(3) . substr($otp,  0, 2). $this->ab(2) . substr($otp, 0, 1);
        $ID = "ADMIN/00CBT/".$otp;
        $data = [
            'email'=>$this->dto->email,
            'password'=>$this->dto->password,
            'phone'=>$this->dto->phone,
            'fullname'=>$this->dto->fullname,
            'role'=>'ADMIN',
            'organization_name'=>$this->dto->organization_name,
            'organization_code'=>$org_code,
            'organization_type'=>$this->dto->organization_type,
            'last_seen' =>$this->dto->last_seen ?? "00:00",
            'date_created'=>$this->dto->date_created,
            "ID"=>$ID,
            "last_login"=>$this->dto->last_login ?? "00:00",
            "organization_description"=>$this->dto->organization_description,
            "publish"=>$this->dto->publish,
            "status"=>"active"
        ];
        $fullname = $this->dto->fullname;
        
        $newMig = new Migration(null, $this->table);
        $mig = $newMig->saveUnique($col, $val, $data);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            $body = "$fullname as created an admin account which made him to preform some activitive so if not authurizes contact the support term of resuce";
            $newMail1 = new Index();
            $mail1 = $newMail1->sendOtp("Alert", $body, $this->emailR);
            $decodeMail1 = json_decode($mail1, true);
            if($decodeMail1['status']==='success'){
                $dec = $this->dto->organization_description;
                $name = $this->dto->fullname;
                $email = $this->dto->email;
                $date_created = $this->dto->date_created;
                $newMail2 = new Index();
                $body2 = "
                <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Welcome Onboard</title>

                <link rel='preconnect' href='https://fonts.googleapis.com'>
                <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
                <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' rel='stylesheet'>

                <style>
                :root{
                    --primary:#2563EB;
                    --primary-hover:#1D4ED8;
                    --bg:#F8FAFC;
                    --card:#FFFFFF;
                    --text:#0F172A;
                    --muted:#64748B;
                    --border:#CBD5E1;
                    --success:#16A34A;
                }

                *{
                    margin:0;
                    padding:0;
                    box-sizing:border-box;
                }

                body{
                    font-family:'Inter',sans-serif;
                    background:var(--bg);
                    color:var(--text);
                    padding:40px 20px;
                }

                .container{
                    max-width:760px;
                    margin:auto;
                }

                .card{
                    background:var(--card);
                    border:1px solid #E2E8F0;
                    border-radius:12px;
                    box-shadow:0 15px 40px rgba(15,23,42,.08);
                    overflow:hidden;
                }

                .header{
                    text-align:center;
                    padding:45px 40px 30px;
                    border-bottom:1px solid #EEF2F7;
                }

                .success-icon{
                    width:70px;
                    height:70px;
                    background:#DCFCE7;
                    color:var(--success);
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:34px;
                    font-weight:bold;
                    margin:0 auto 20px;
                }

                .header h1{
                    font-size:34px;
                    font-weight:800;
                    margin-bottom:12px;
                    color:var(--text);
                }

                .header p{
                    color:var(--muted);
                    line-height:1.7;
                    max-width:620px;
                    margin:auto;
                }

                .section{
                    padding:35px;
                }

                .section-title{
                    font-size:18px;
                    font-weight:700;
                    margin-bottom:20px;
                }

                .details{
                    border:1px solid var(--border);
                    border-radius:12px;
                    overflow:hidden;
                }

                .row{
                    display:grid;
                    grid-template-columns:220px 1fr;
                    border-bottom:1px solid #E2E8F0;
                }

                .row:last-child{
                    border-bottom:none;
                }

                .label{
                    background:#F8FAFC;
                    padding:18px 22px;
                    font-weight:600;
                    color:#334155;
                }

                .value{
                    padding:18px 22px;
                    color:var(--text);
                    line-height:1.7;
                    word-break:break-word;
                }

                .notice{
                    margin-top:28px;
                    background:#EFF6FF;
                    border-left:5px solid var(--primary);
                    border-radius:10px;
                    padding:22px;
                }

                .notice h3{
                    color:var(--primary);
                    margin-bottom:10px;
                    font-size:17px;
                }

                .notice p{
                    color:#475569;
                    line-height:1.7;
                }

                .actions{
                    display:flex;
                    flex-wrap:wrap;
                    gap:14px;
                    margin-top:32px;
                }

                .btn{
                    text-decoration:none;
                    padding:14px 24px;
                    border-radius:10px;
                    font-weight:600;
                    transition:.25s;
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                }

                .primary{
                    background:var(--primary);
                    color:#fff;
                }

                .primary:hover{
                    background:var(--primary-hover);
                }

                .secondary{
                    background:#fff;
                    color:var(--primary);
                    border:1px solid var(--primary);
                }

                .secondary:hover{
                    background:#EFF6FF;
                }

                .download{
                    display:inline-block;
                    margin-top:18px;
                    color:var(--primary);
                    text-decoration:none;
                    font-weight:600;
                }

                .download:hover{
                    text-decoration:underline;
                }

                .footer{
                    border-top:1px solid #EEF2F7;
                    padding:30px;
                    text-align:center;
                }

                .footer h4{
                    margin-bottom:10px;
                    font-size:18px;
                }

                .footer p{
                    color:var(--muted);
                    line-height:1.7;
                }

                .copyright{
                    margin-top:18px;
                    font-size:14px;
                    color:#94A3B8;
                }

                @media(max-width:640px){

                .header{
                    padding:35px 25px;
                }

                .section{
                    padding:25px;
                }

                .row{
                    grid-template-columns:1fr;
                }

                .label{
                    border-bottom:1px solid #E2E8F0;
                }

                .actions{
                    flex-direction:column;
                }

                .btn{
                    width:100%;
                }

                .header h1{
                    font-size:28px;
                }

                }
                </style>

                </head>
                <body>

                <div class='container'>

                <div class='card'>

                <div class='header'>

                <div class='success-icon'>✓</div>

                <h1>Welcome Onboard!</h1>

                <p>
                Your organization has been successfully created.
                Below are your organization details.
                Please keep this information secure, especially your
                <strong>Organization Code</strong>,
                as your students will need it during registration.
                </p>

                </div>

                <div class='section'>

                <h2 class='section-title'>Organization Details</h2>

                <div class='details'>

                <div class='row'>
                <div class='label'>Organization Name</div>
                <div class='value'>$org_name</div>
                </div>

                <div class='row'>
                <div class='label'>Organization Code</div>
                <div class='value'><strong>$org_code</strong></div>
                </div>

                <div class='row'>
                <div class='label'>Organization Description</div>
                <div class='value'>
                 $dec
                </div>
                </div>

                <div class='row'>
                <div class='label'>Administrator Role</div>
                <div class='value'>ADMIN</div>
                </div>

                <div class='row'>
                <div class='label'>Organization ID</div>
                <div class='value'>$ID</div>
                </div>

                <div class='row'>
                <div class='label'>Administrator Name</div>
                <div class='value'>$name</div>
                </div>

                <div class='row'>
                <div class='label'>Administrator Email</div>
                <div class='value'>$email</div>
                </div>

                <div class='row'>
                <div class='label'>Registration Date</div>
                <div class='value'>$date_created</div>
                </div>

                </div>

                <div class='notice'>
                <h3>Important</h3>

                <p>
                Save your <strong>Organization Code</strong> carefully.
                Every student registering on the platform must provide this code
                to automatically join your organization.
                </p>

                </div>

                <div class='actions'>

                <a href='Edutext.edu.eg' class='btn primary'>
                🏠 Go to Dashboard
                </a>

                // <a href='#' class='btn secondary'>
                // 📋 Copy Organization Code
                // </a>

                </div>


                </div>

                <div class='footer'>

                <h4>Need help?</h4>

                <p>
                Contact our support team if you experience any issues while setting
                up your organization.
                </p>

                <div class='copyright'>
                © 2026 EdutText Platform
                </div>

                </div>

                </div>

                </div>

                </body>
            </html>";
                $mail2 = $newMail2->sendOtp("Welcome on board", $body2, $val);
                $decodeMail2 = json_decode($mail2, true);
                if($decodeMail2['status']==='success'){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'account created successfully'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return json_encode([
                            'status'=>'failed',
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
            return $mig;
        }
    }
}

?>