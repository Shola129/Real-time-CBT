<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class LastSeen{
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

        $data = [
            'last_seen'=>$this->dto->lastSeen
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($data, $where);
        return $mig; 
    }
}

?>