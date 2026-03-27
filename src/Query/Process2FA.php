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
            $body = "$name is now qunlifies for reacting Admin dashboard with email $email";
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