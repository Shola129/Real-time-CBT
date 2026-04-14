<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class GetAllSub{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department,
            // 'DepartmentCode'=>$this->dto->DepartmentCode
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 20);
        return $mig;
    }
}

?>