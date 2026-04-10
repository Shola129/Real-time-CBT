<?php
namespace NewdichApp\Command;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class Result{
    private $dto;
    private $table = Platform::RESULT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'subject_scores'=>$this->dto->subjectAndScore,
            'overAll'=>$this->dto->overAll,
            'department'=>$this->dto->department,
            'fullname'=>$this->dto->fullname,
            'regNum'=>$this->dto->regNum,
            'createdAt'=>date("Y-m-d H:i:s")
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->save($data);
        return $mig;
    }
}

?>