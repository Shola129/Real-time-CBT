<?php
namespace NewdichApp\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SaveQuestionATT{
    private $dto;
    private $table = Platform::SAVEQUESTIONS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            "department"=>$this->dto->department,
            "regNum"=>$this->dto->regNum,
            "questionToSave"=>$this->dto->questionToSave,
            "fullname"=>$this->dto->fullname,
            "saveAt"=>$this->dto->submittedAt,
            "totalQuestions"=>$this->dto->totalQuestions,
            "savequestID"=>"SAVE/QUES/ANS/".$this->dto->otp,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->save($data);
        return $mig;
    }
}

?>