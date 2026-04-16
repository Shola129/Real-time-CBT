<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class EditProfile{
    private $dto;
    private $table = Platform::ADMINS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'password'=>$this->dto->password,
        ];

        $where = [
            'email'=>$this->dto->email,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($data, $where);
        return $mig;
    }
}


?>