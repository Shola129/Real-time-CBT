<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichMail\Index; 


class ScheduleExam{
    private $dto;
    private $table = Platform::QUESTIONS_TABLE;
    private $table2 = Platform::SETEXAMTIME_TABLE;
    // private $table3 = Platform::QUESTIONDETAILS_TABLE;
    // private $table3 = Platform::USERS_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department,
            // 'DepartmentCode'=>$this->dto->DepartmentCode,
            'organization_code'=>$this->dto->organization_code,
            'subject'=>$this->dto->subject
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            // $where2 = [
            //     "organization_code"=>$this->dto->organization_code,
            //     "department"=>$this->dto->department,
            //     "status"=>"set"
            // ];

            // $newMig2 = new Migration(null, $this->table3);
            // $mig2 = $newMig2->get($where2, 0, 1);
            // $decodeMig2 = json_decode($mig2, true);
            // if($decodeMig2["status"]==="success"){
                    $col = [
                        "organization_code", 
                        "department", 
                        "DepartmentCode", 
                        // "session",
                        "subject",
                        "subjectCode"
                        ];
                    $val = [
                        $this->dto->organization_code,
                        $this->dto->department,
                        $this->dto->DepartmentCode,
                        // $this->dto->session,
                        $this->dto->subject,
                        $this->dto->subjectCode,
                    ];
                    $data = [
                        'organization_code'=>$this->dto->organization_code,
                        "department"=> $this->dto->department,
                        'DepartmentCode'=> $this->dto->DepartmentCode,
                        'date'=> $this->dto->date,
                        'start'=> $this->dto->start,
                        'end'=> $this->dto->end,
                        'duration'=> $this->dto->duration.'mins',
                        'timeID'=> "time-ref-". substr($this->dto->otp, 0, 3),
                        'role'=> 'set',
                        'status'=>'inactive',
                        // 'session'=>$this->dto->session,
                        'subjectCode'=>$this->dto->subjectCode,
                        'subject'=>$this->dto->subject
                    ];

                    $newMig3 = new Migration(null, $this->table2);
                    $mig3 = $newMig3->saveUniqueMulti($col, $val, $data);
                 return $mig3;
            // }else{
            //     return json_encode([
            //         "status"=>"failed",
            //         "response"=>"The total questions per subject and mark per score is yet to be set or determined, do that under the settings before seting the timetable"
            //     ], JSON_PRETTY_PRINT);
            //     exit();
            // }
        }
        else{
            $course = $this->dto->subject;
            $department = $this->dto->department;
            return json_encode([
                "status"=>"failed",
                "response"=>"Questions are yet to be set for $course under the $department department"
            ], JSON_PRETTY_PRINT);
            exit();
            // return $mig;
        }
    }
}

?>