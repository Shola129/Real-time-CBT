<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetQuestNoMarAns{
    private $dto;
    private $table = Platform::QUESTIONDETAILS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'organization_code'=>$this->dto->organizsation_code,
            'department'=>$this->dto->department
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        return $mig;
    }
}

?>