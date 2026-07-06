<?php
namespace NewdichSrc\Commad;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class EditQuestNoMarAns{
    private $dto;
    private $table = Platform::QUESTIONDETAILS_TABLE;
    private $table2 = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department,
            "organization_code"=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where, 0, 1);
        $decodeMig = json_decode($mig, 0, 1);
        if($decodeMig["status"]==="sucess"){
            $data = [
                "organization_code"=>$this->dto->organization_code,
                "department"=>$this->dto->department,
                "total_question"=>$this->dto->total_questions,
                "mark_per_score"=>$this->dto->score,
                "status"=>"set",
            ];
            
            $where = [
                "organization_code"=>$this->dto->organization_code,
                "save_id"=>$this->dto->save_id
            ];

            $newMig2 = new Migration(null, $this->table);
            $mig2 = $newMig2->edit($data, $where);
            return $mig2;
        }else{  
            return json_decode([
                "status"=>"success",
                "response"=>"Department is not found or yet to be set"
            ], JSON_PRETTY_PRINT);
        }
    }
}

?>