<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class EditSch{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;
    private $table2 = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $get = [
            "department"=>$this->dto->department,
            'organization_code'=>$this->dto->organization_code
        ];

        $newMig2 = new Migration(null, $this->table2);
        $mig2 = $newMig2->get($get, 0, 1);
        $decodeMig = json_decode($mig2, true);
        if($decodeMig["status"]==="success"){
             $data = [
                "department"=> $this->dto->department,
                'DepartmentCode'=> $this->dto->DepartmentCode,
                'date'=> $this->dto->date,
                'start'=> $this->dto->start,
                'end'=> $this->dto->end,
                'duration'=> $this->dto->duration,
                'role'=> 'set',
                'status'=>$this->dto->status,
                'session'=>$this->dto->session,
                'timeID'=>$this->dto->timeID,
                'organization_code'=>$this->dto->organization_code,
            ];

            $where = [
                'timeID'=>$this->dto->timeID
            ];
            // return json_encode([
            //     "status"=>"failed",
            //     "response"=>$data
            // ], true);
            $neMig = new Migration(null, $this->table);
            $mig = $neMig->edit($data, $where);
            return $mig;
        }
        else{
            return json_encode([
                'status'=>'failed',
                'response'=>'Department is found, you can go create that first'
            ], true);
        }
    }
}

?>