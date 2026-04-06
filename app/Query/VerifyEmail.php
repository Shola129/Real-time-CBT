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
                $neMail = New Index();
                $mail = $neMail->sendOtp("Verification", $otp, $emailToSend);
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