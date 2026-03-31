<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class TotalDep{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'role'=>'set'
        ];

        $neMig = new Migration(null, $this->table);
        $mig = $neMig->count($where);
        return $mig;
    }
}

?>