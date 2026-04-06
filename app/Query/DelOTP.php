<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class DelOTP{
    private $dto;
    private $table = Platform::OTPDB_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
          $where = [
            'email'=>$this->dto->email
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->remove($where);
        return $mig;
    }
}

?>