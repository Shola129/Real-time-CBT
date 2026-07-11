<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class DelSubject{
    private $dto;
    private $table = Platform::QUESTION_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "questionID"=>$this->dto->questionID,
            "organization_code"=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->remove($where);
        return $mig;
    }
}

?>