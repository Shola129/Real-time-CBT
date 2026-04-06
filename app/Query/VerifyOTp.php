<?php
namespace NewdichApp\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class VerifyOTp{
    private $dto;
    private $table = Platform::OTPDB_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'otp'=>$this->dto->otpCode,
            'email'=>$this->dto->email
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        return $mig;
    }
}
?>