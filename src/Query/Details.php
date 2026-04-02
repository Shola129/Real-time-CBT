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
      $data = [
         "ID"=>$this->dto->ID,
         "email"=>$this->dto->email
        ];

        $mig = new Migration(null, $this->table);
        $newmig = $mig->get($data, 0, 1);
        return $newmig;
     }
}

?>