<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class DelSubject{
    private $dto;
    private $table = Platform::SETSUBJECTS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "subjectID"=>$this->dto->subjectID,
            "organization_code"=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->remove($where);
        return $mig;
    }
}

?>