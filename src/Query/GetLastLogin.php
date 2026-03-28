<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetLastLogin{
    private $dto;
    private $table = Platform::ADMINS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email,
            'ID'=>$this->dto->ID
        ];

        $newMig =new Migration(null, $this->table);
        $mig = $newMig->get($where, 0,1);
        return $mig;
    }
}

?>