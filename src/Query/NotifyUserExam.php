<?php
namespace NewdichSrc\Query;
use NewdichMail\Index;
use NewdichSchema\Platform;
use NewdichDto\AnsofraDto;
use NewdichSchema\Migration;

class NotifyUserExam{
    private $dto;
    // private $table = Platform::SETEXAMTIME_TABLE;
    private $table2 = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department
        ];

        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where, 0, 20);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            // $reponse = $decodeMig["response"][0];
            // $time = $this->dto->timeSchedule;
            // $allEamil = $reponse["email"];
            // $a = count($allEamil);
            // $holdEmail = "";
            // for($i=0; $i<$a; $i++){
            //     $holdEmail=$allEmail[$i];
            // }
            // $body = "Th time set for cbt exam is $time";
            // $newMail = new Index();
            // $mail = $newMail->sendOtp('TimeTable', $body, $holdEmail);
            // $decodeMail = json_decode($mail, true);
            // if($decodeMail['status']==="success"){
            //     return json_encode([
            //         'status'=>'success',
            //         'response'=>'time scheduled have being saved and sent to the registered user department to ready'
            //     ], JSON_PRETTY_PRINT);
            // }
            // else{
            //     return $mail;
            // }

            $response = $decodeMig["response"];
            $time = $this->dto->timeSchedule;
            foreach($response as $row){
                $email = $row["email"];
                
                $body = "The time set for CBT exam is $time";
                $newMail = new Index();
                $mail = $newMail->sendOtp('TimeTable', $body, $email);
                $decodeMail = json_decode($mail, true);
                if($decodeMail['status']==="success"){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'time scheduled have being saved and sent to the registered user department to ready'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return $mail;
                }
            }
        }
        else{
            return json_decode([
                'status'=>'fail',
                'response'=>'no user found registered for the department'
            ], JSON_PRETTY_PRINT);
        }
    }
}

?>