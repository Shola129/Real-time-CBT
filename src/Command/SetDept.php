<?php
namespace NewdichSrc\Command;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class SetDept{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            "department"=>$this->dto->department,
            'role'=>$this->dto->role,
            'Description'=>$this->dto->Description ?? '',
            'Date_Created'=>$this->dto->date_created,
            'HeadOfDepartment'=>$this->dto->HeadOfDepartment,
            'DepartmentCode'=>$this->dto->DepartmentCode
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->save($data);
        return $mig;
    }
}

?>