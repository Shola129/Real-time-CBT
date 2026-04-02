<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class Details{
     private $dto;
     private $table = Platform::ADMINS_TABLE;

     public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
     }

     public function process(){
        $where = [
            "ID"=>$this->dto->ID
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        return $mig;
     }
}

?>