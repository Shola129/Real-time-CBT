<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;
use NewdichMail\Index;
use NewdichSchema\Settings;
class ProcessOtp{
    private $dto;
    private $table = Platform::OTPDB_TABLE;
    private $table2 = Platform::ADMINAPPROVE_TABLE;
    private $recipient = Settings::APP_OTP_EMAIL;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email,
            'otp'=>$this->dto->otpCode
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0,1);
        $decode = json_decode($mig, true);
        if($decode['status']==='success'){
            $email = $this->dto->email;
            $subEmail = substr($email, 0, 4);
            $otp = $subEmail . $this->dto->otp;
            $data = [
                'email'=>$this->dto->email,
                'fullname'=>$this->dto->fullname,
                'otp'=> $otp
            ];
            $mig2 = new Migration(null, $this->table2);
            $mig3 = $mig2->save($data);
            $decodeMig = json_decode($mig3, true);
            if($decodeMig['status']==='success'){
                $name = $this->dto->fullname;
                $body = "This users $name is trying create a admin account with an email of $email. So authrize the users by giving it the $otp for last verification to create an admin account";
                $newMail = new Index();
                $mail = $newMail->sendOtp('2 Faactors Authentications', $body, APP_OTP_EMAIL);
                $decodeMail = json_decode($mail, true);
                if($decodeMail['status']==='success'){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'redirect to 2FA page'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return json_encode([
                        'status'=>'failed',
                        'response'=>'unable to perform 2FA'
                    ], JSON_PRETTY_PRINT);
                }
            }
            else{
                return json_encode([
                    'status'=>'failed',
                    'response'=>'unable to genrate the otp for the 2FA'
                ], JSON_PRETTY_PRINT);
                // return $mig3;
            }
        }
        else{
            return $mig;
        }
    }
}

?>