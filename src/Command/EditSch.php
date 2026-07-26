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
        $where = [
            "timeID"=>$this->dto->timeID,
            // 'organization_code'=>$this->dto->organization_code
        ];

        // $newMig2 = new Migration(null, $this->table2);
        // $mig2 = $newMig2->get($get, 0, 1);
        // $decodeMig = json_decode($mig2, true);
        // if($decodeMig["status"]==="success"){
             $data = [
                "department"=> $this->dto->department,
                'DepartmentCode'=> $this->dto->DepartmentCode,
                'date'=> $this->dto->date,
                'start'=> $this->dto->start,
                'end'=> $this->dto->end,
                'duration'=> $this->dto->duration,
                'subject'=>$this->dto->subject,
                'subjectCode'=>$this->dto->subjectCode
                // 'role'=> 'set',
                // 'status'=>$this->dto->status,
                // 'session'=>$this->dto->session,
                // 'timeID'=>$this->dto->timeID,
                // 'organization_code'=>$this->dto->organization_code,
            ];

            // $where = [
            //     'timeID'=>$this->dto->timeID
            // ];
            // // return json_encode([
            //     "status"=>"failed",
            //     "response"=>$data
            // ], true);
            $newMig2 = new Migration(null, $this->table);
            $mig = $newMig2->edit($data, $where);
            return $mig;
            //  return json_encode([
            //     'status'=>'failed',
            //     'response'=>$where
            //     // 'response'=>'Department is found, you can go create that first'
            // ], true);
        // }
        // else{
        //     return json_encode([
        //         'status'=>'failed',
        //         'response'=>'Department is found, you can go create that first'
        //     ], true);
        // }
    }
}

?>