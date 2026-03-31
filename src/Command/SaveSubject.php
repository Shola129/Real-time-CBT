<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SaveSubject{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
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
}