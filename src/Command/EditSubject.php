<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class EditSubject{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'department'=>$this->dto->department,
            'DepartmentCode'=>$this->dto->DepartmentCode,
            'subject'=>$this->dto->subject,
        ];

        $where = [
            'subjectID'=>$this->dto->subjectID
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($data, $where);
        return $mig;

    }
}
?>