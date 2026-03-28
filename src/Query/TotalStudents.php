<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class TotalStudents{
    private $dto;
    // private $table = Platform::USERS_TABLE;
    private $table = Platform::ADMINS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'role'=>$this->dto->role
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->count($where);
        return $mig;
    }
}

?>