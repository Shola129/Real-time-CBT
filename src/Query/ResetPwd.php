<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichMail\Index;

class ResetPwd{
    private $dto;
    private $table = Platform::ADMINS_TABLE;
    private $table2 = Platform::OTPDB_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $data = [
                'email'=>$this->dto->email,
                'otp'=>$this->dto->otp
            ];

            $newMig2 = new Migration(null, $this->table2);
            $mig2 = $newMig2->save($data);
            $decodeMig2 = json_decode($mig2, true);
            if($decodeMig2["status"]==="success"){
                $otp = $this->dto->otp;
                $email = $this->dto->email;

                $newMail = new Index();
                $mail = $newMail->sendOtp("OTP Verification", $otp, $email);
                $decodeMail = json_decode($mail, true);
                if($decodeMail["status"]==="success"){
                    return json_decode([
                        'status'=>'success',
                        'response'=>'next page'
                    ], JSON_PRETTY_PRINT);
                }else{
                        return json_decode([
                            'status'=>'failed',
                            'response'=>'error'
                        ], JSON_PRETTY_PRINT);
                }
            }else{
                return json_decode([
                        'status'=>'failed',
                        'response'=>'error'
                    ], JSON_PRETTY_PRINT);
            }
        }else{
            return $mig;
        }
    }
}

?>