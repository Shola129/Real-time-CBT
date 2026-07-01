<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichMail\Index; 


class ScheduleExam{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;
    private $table2 = Platform::SETEXAMTIME_TABLE;
    // private $table3 = Platform::USERS_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department,
            'DepartmentCode'=>$this->dto->DepartmentCode,
            'organization_code'=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            $col = [
                "organization_code", 
                "department", 
                "DepartmentCode", 
                "session"
                ];
            $val = [
                $this->dto->organization,
                $this->dto->department,
                $this->dto->DepartmentCode,
                $this->dto->session
            ];
            $data = [
                'organization_code'=>$this->dto->organization_code,
                "department"=> $this->dto->department,
                'DepartmentCode'=> $this->dto->DepartmentCode,
                'date'=> $this->dto->date,
                'start'=> $this->dto->start,
                'end'=> $this->dto->end,
                'duration'=> $this->dto->duration.'hrs',
                'timeID'=> "ref-". substr($this->dto->otp, 0, 3),
                'role'=> 'set',
                'status'=>'inactive',
                'session'=>$this->dto->session
            ];

            $newMig2 = new Migration(null, $this->table2);
            $mig2 = $newMig2->saveUniqueMulti($col, $val, $data);
            return $mig2;
            // $decodeMig2 = json_decode($mig2, true);
            // // if($decodeMig2['status']==="success"){
            // //     $getAllUserInThatDep = [
            // //         "department"=>$this->dto->department
            // //     ];
                
            // //     $newMig3 = new Migration(null, $this->table3);
            // //     $mig3 = $newMig3->get($getAllUserInThatDep, 0, 50);
            // //     $decodeMig3 = json_decode($mig3, true);
            // //     if($decodeMig3["status"]==="success"){
            // //         $time = $this->dto->timeSchedule;
            // //         $response = $decodeMig3["response"];
            // //         $allEmail = $response["email"];
            // //         $a = count($allEmail);
            // //         $holdEachEmail='';
            // //         for($i=0; $i<$a; $i++){
            // //             $holdEachEmail=$allEmail[$i];
            // //         }
            // //         $body = "Th time set for cbt exam is $time";
            // //         $newMail = new Index();
            // //         $mail = $newMail->sendOtp('TimeTable', $body, $holdEachEmail);
            // //         $decodeMail = json_decode($mail, true);
            // //         if($decodeMail['status']==="success"){
            // //             return json_encode([
            // //                 'status'=>'success',
            // //                 'response'=>'time scheduled have being saved and sent to the registered user department to ready'
            // //             ], JSON_PRETTY_PRINT);
            // //         }
            // //         else{
            // //             return $mail;
            // //         }
            // //     }
            // //     else{
            // //         return json_encode([
            // //             'status'=>'fail',
            // //             'response'=>'no user found registered for the department'
            // //         ], JSON_PRETTY_PRINT);
                // }
            // }
            // else{
            //     return $mig2;
            // }
        }
        else{
            return $mig;
        }
    }
}

?>