<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class Dep{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'DepartmentCode'=>$this->dto->DepartmentCode
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 20);
        return $mig;
    }
}

?>