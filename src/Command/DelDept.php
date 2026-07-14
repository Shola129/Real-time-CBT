<?php
namespace NewdichSrc\Command;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class DelDept{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department_id"=>$this->dto->id,
            "organization_code"=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->remove($where);
        return $mig;
    }
}

?>