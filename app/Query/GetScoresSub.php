<?php
namespace NewdichApp\query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetScoresSub{
    private $dto;
    private $table = Platform::SAVESCORE_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'regNum'=>$this->dto->regNum
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        return $mig;
    }
}

?>