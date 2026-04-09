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
            "subject"=>$this->dto->subject,
            "regNum"=>$this->dto->regNum,
            "questionID"=>$this->dto->questionID,
            "correctOtp"=>$this->dto->correctOtp,
            "correctAns"=>$this->dto->correctAns,
            "optionPicked"=>$this->dto->optionPicked,
            "answerPicked"=>$this->dto->answerPicked,
            "saveAt"=>date("Y-m-d H:i:s"),
            "savequestID"=>"SAVE/QUES/ANS/".$this->dto->otp,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->save($data);
        return $mig;
    }
}

?>