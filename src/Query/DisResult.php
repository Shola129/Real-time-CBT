<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class DisResult{
    private $dto;
    private $table = Platform::RESULT_TABLE;
    
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where =[
            "status"=>$this->dto->status
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 20);
        return $mig;
    }
}

?>