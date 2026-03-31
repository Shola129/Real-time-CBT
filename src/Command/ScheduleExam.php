<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichMail\Index; 


class ScheduleExam{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;
    private $table2 = Platform::SETEXAMTIME_TABLE;
    private $table3 = Platform::USERS_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department,
            'DepartmentCode'=>$this->dto->DepartmentCode,
            'departmentID'=>$this->dto->departmentID
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0,1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            $col = "departmentID";
            $val = $this->dto->departmentID;
            $data = [
                'departmentID'=>$this->dto->departmentID,
                "department"=>$this->dto->department,
                'departmentCode'=>$this->dto->departmentCode,
                'time_schedule'=>$this->dto->timeSchedule
            ];

            $newMig2 = new Migration(null, $this->table);
            $mig2 = $newMig2->saveUnique($col, $val, $data);
            $decodeMig2 = json_decode($mig2, true);
            if($decodeMig2['status']==="success"){
                $getAllUserInThatDep = [
                    "department"=>$this->dto->department
                ];
                
                $newMig3 = new Migration(null, $this->table3);
                $mig3 = $newMig3->get($getAllUserInThatDep, 0, 50);
                $decodeMig3 = json_decode($mig3, true);
                if($decodeMig3["status"]==="success"){
                    $response = $decodeMig3["response"];
                    $allEmail = $response["email"];
                    $output = '';
                    for($i=0; $i<$allEmail; $i++){

                    }
                }
            }
        }
    }
}

?>