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
            'DepartmentCode'=>$this->dto->DepartmentCode
        ];
        $newMig1 = new Migration(null, $this->table2);
        $mig1 = $newMig1->get($where, 0, 1);
        $decodeMig = json_decode($mig1, true);
        if($decodeMig["status"]==="success"){
             $sub = substr($this->dto->subject, 0,3);
            $data = [
                'department'=>$this->dto->department,
                'DepartmentCode'=>$this->dto->DepartmentCode,
                'subject'=>$this->dto->subject,
                'subjectID'=> $sub.'/'.'213/',
                'role'=>'set'
            ];
            $col = 'subjectID';
            $val = $sub.'/'.'213';

            $newMig = new Migration(null, $this->table);
            $mig = $newMig->saveUnique($col, $val, $data);
            return $mig;
        }
        else{
            return json_encode([
                'status'=>'failed',
                'response'=>"department or departmentcode not found"
            ], JSON_PRETTY_PRINT);
        }
    }
}