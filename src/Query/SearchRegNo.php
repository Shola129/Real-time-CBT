<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SearchRegNo{
    private $dto;
    private $table = Platform::USERS_TABLE;     
     public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
     }

     public function process(){
        $where = [
            'regNum'=>$this->dto->regNum,
            'organization_code'=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 200);
        return $mig;
     }
}
?>