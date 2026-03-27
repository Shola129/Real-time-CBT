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
        if($decode['status']==='failed'){
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
                $newMail = new Index();
                $mail = $newMail->sendOtp('OTP verification',$otp,$email);
                $decodeMail = json_decode($mail, true);
                if($decodeMail['status']==='success'){
                    return json_encode([
                        'status'=>'failed',
                        'response'=>'can now be redirect to otp verification page'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return json_encode([
                        'status'=>'success',
                        'response'=>'unable to send otp'
                    ], JSON_PRETTY_PRINT);
                }
            }
            else{
                return json_encode([
                        'status'=>'success',
                        'response'=>'unable to genrate otp'
                    ], JSON_PRETTY_PRINT);
            }
        }
        else{
            return $mig;
        }
    }
}
?>