<?php
namespace NewdichApp\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class GetAvailableOrg{
    private $dto;
    private $table = Platform::ADMINS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "role"=>$this->dto->role,
            "publish"=>$this->dto->publish
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 5);
        return $mig;
        exit();
    }
}
?>