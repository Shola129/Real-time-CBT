<?php
namespace NewdichSrc\Command;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;
use NewdichFiles\Upload;


class EditQuestion{
    private $dto;
    private $table = Platform::QUESTIONS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    // public function upload($media){
    //     $file = $media ?? "null";
    //     $newFile = new Upload($media);
    //     $file = $newFile->process();
    //     return $file;
    // }

    public function process(){
        // $decodeFile = json_decode($this->upload(), true);
        // $diagram  = $decodeFile["response"][0] ?? 'null';
        // if($decodeFile["status"]=="success"){
            $where = [
                "questions_id"=>$this->dto->id,
                // "organization_code"=>$this->dto->organization_code
            ];

            $data = [
                "questiontext"=>$this->dto->questionstext,
                "optionA"=>$this->dto->optionA,
                "optionB"=>$this->dto->optionB,
                "optionC"=>$this->dto->optionC ?? "none",
                "optionD"=>$this->dto->option ?? "none",
                "optionE"=>$this->dto->optionE ?? "none",
                "correctAss"=>$this->dto->correctAss,
                "correctOtp"=>$this->dto->correctOtp ?? "none",
                // "diagram"=>$diagram ?? 'null',
                // "session"=>$this->dto->session,
                // "level"=>$this->dto->level,
                // "semster"=>$this->dto->semster,
                // ""=>$this->dto->,
            ];

            $newMig = new Migration(null, $this->table);
            $mig = $newMig->edit($data, $where);
            return $mig;
            // return json_encode([
            //     "status"=>"success",
            //     "response"=>$where
            // ], true);
        // }else{
        //     return $this->upload();
        //     exit();
        // }
    }
}

?>