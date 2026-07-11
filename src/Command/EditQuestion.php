<?php
namespace NewdichSrc\Command;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;


class EditQuestion{
    private $dto;
    private $table = Platform::QUESTIONS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "questionID"=>$this->dto->questionID,
            "organization_code"=>$this->dto->organization_code
        ];

        $data = [
            "department"=>$this->dto->department,
            "subject"=>$this->dto->subject,
            "questionID"=>$this->dto->questionID,
            "questionstext"=>$this->dto->questionstext,
            "optionA"=>$this->dto->optionA,
            "optionB"=>$this->dto->optionB,
            "optionC"=>$this->dto->optionC,
            "optionD"=>$this->dto->optionD,
            "optionE"=>$this->dto->optionE,
            "correctAss"=>$this->dto->correctAss,
            "correctOtp"=>$this->dto->correctOtp
            // ""=>$this->dto->,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($data, $where);
    }
}

?>