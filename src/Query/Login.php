<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichAuth\Authentication;

class Login{
    private $dto;
    private $table = Platform::ADMINS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email,
            'ID'=>$this->dto->ID,
        ];

        $newMIg = new Migration(null, $this->table);
        $mig = $newMIg->get($where, 0, 1);
        return $mig;
    }
}

?>