<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetAllSub{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department,
            "organization_code"=>$this->dto->organization_code,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 100);
        return $mig;
    }
}
?>