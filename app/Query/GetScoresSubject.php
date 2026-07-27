<?php
namespace NewdichApp\query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetScoresSubject{
    private $dto;
    private $table = Platform::SAVESCORE_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'regNum'=>$this->dto->regNum,
            'department'=>$this->dto->department
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 25);
        return $mig;
    }
}

?>