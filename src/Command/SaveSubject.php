<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SaveSubject{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;
    private $table2 =Platform::DEPARTMENT_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department,
            'DepartmentCode'=>$this->dto->DepartmentCode,
            'organization_code'=>$this->dto->organization_code,
            'role'=>'set'
        ];
        $newMig1 = new Migration(null, $this->table2);
        $mig1 = $newMig1->get($where, 0, 1);
        $decodeMig = json_decode($mig1, true);
        if($decodeMig["status"]==="success"){
        $data = [
            'department'=>$this->dto->department,
            'DepartmentCode'=>$this->dto->DepartmentCode,
            'organization_code'=>$this->dto->organization_code,
            'subject'=>$this->dto->subject,
            'subjectCode'=>$this->dto->subjectCode ?? "Null",
            'date_created'=>$this->dto->date_created,
            'role'=>'set',
            'subjectID'=>substr($this->dto->otp, 0,2)
        ];
        // return json_encode([
        //     "status"=>"failed",
        //     "response"=>$data
        // ], true);
        $col = [
            "organization_code", "role", "DepartmentCode", "department", "subject"
        ];

        $val = [
            $this->dto->organization_code,
            'set',
            $this->dto->DepartmentCode,
            $this->dto->department,
            $this->dto->subject
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->saveUniqueMulti($col, $val, $data);
        return $mig;
    }else{
        return json_encode([
            "status"=>"failed",
            "response"=>"Department or department code not found"
        ], JSON_PRETTY_PRINT);
        exit();
    }
        // $where = [
        //     'department'=>$this->dto->department,
        //     'DepartmentCode'=>$this->dto->DepartmentCode,
        //     'orgnization_code'=>$this->dto->orgnization_code
        // ];
        // $newMig1 = new Migration(null, $this->table2);
        // $mig1 = $newMig1->get($where, 0, 1);
        // $decodeMig = json_decode($mig1, true);
        // if($decodeMig["status"]==="success"){
        //      $sub = substr($this->dto->subject, 0,3);
        //     $data = [
        //         'orgnization_code'=>$this->dto->orgnization,
        //         'department'=>$this->dto->department,
        //         'DepartmentCode'=>$this->dto->DepartmentCode,
        //         'subject'=>$this->dto->subject,
        //         'subjectID'=> $sub.'/'.'213/',
        //         'role'=>'set'
        //     ];
        //     $col = 'subjectID';
        //     $val = $sub.'/'.'213';

        //     $newMig = new Migration(null, $this->table);
        //     $mig = $newMig->saveUnique($col, $val, $data);
        //     return $mig;
        // }
        // else{
        //     return json_encode([
        //         'status'=>'failed',
        //         'response'=>"department or departmentcode not found"
        //     ], JSON_PRETTY_PRINT);
        // }
    }
}