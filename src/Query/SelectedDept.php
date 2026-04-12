<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SelectedDept{
    private $dto;
     private $table = Platform::USERS_TABLE;
     
     public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
     }

     public function process(){
        $where = [
            'department'=>$this->dto->department
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 20);
        return $mig;
     }
}
?>