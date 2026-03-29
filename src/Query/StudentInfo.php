<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class StudentInfo{
    private $dto;
    private $table = Platform::USERS_DATA;

    public function process(){
        $where = [
            'role'=>$this->dto->role
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 20);
        return $mig;
    }
}
?>