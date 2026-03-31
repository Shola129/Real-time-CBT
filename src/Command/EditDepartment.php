<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class EditDepartment{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'department'=>$this->dto->department,
            'HeadOfDepartment'=>$this->dto->HeadOfDepartment,
            'Description'=>$this->dto->Description,
            'DepartmentCode'=>$this->dto->DepartmentCode
        ];

        $where = [
            'departmentID'=>$this->dto->departmentID
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($data, $where);
        return $mig;

    }
}
?>