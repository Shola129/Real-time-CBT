<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetCompleteResult{
    private $dto;
    private $table = Platform::RESULT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "status"=>$this->dto->status,
            "organization_code"=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->count($where);
        return $mig;
    }
}
?>