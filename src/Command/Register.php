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

    public function process(){
        $col = "email";
        $val = $this->dto->email;
        $otp = $this->dto->otp;
        $ID = "ADMIN/00CBT/".$otp;
        $data = [
            'email'=>$this->dto->email,
            'password'=>$this->dto->password,
            'phone'=>$this->dto->phone,
            'fullname'=>$this->dto->fullname,
            'role'=>'ADMIN',
            'username'=>$this->dto->username ?? '',
            'last_seen' =>$this->dto->last_seen ?? '',
            'date_created'=>$this->dto->date_created,
            "ID"=>$ID
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
                $newMail2 = new Index();
                $mail2 = $newMail2->sendOtp("Welcome on board", "Welcome User", $val);
                $decodeMail2 = json_decode($mail2, true);
                if($decodeMail2['status']==='success'){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'account created successfully'
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
            return $mig;
        }
    }
}

?>