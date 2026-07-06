<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SetQuestNoMarAns{
    private $dto;
    private $table = Platform::QUESTIONDETAILS_TABLE;
    private $table2 = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
      $where = [
        "department"=>$this->dto->department,
        "organization_code"=>$this->organization_code,
      ];

      $newMig = new Migration(null, $this->table2);
      $mig = $newMig->get($where, 0, 1);
      $decodeMig = json_decode($mig, true);
      if($decodeMig["status"]==="success"){
        $col = ["organization_code", "department", "status"];
        $val = [
            $this->dto->organization_code,
            $this->dto->department,
            "set"
        ];
        
        $data = [
            "organization_code"=>$this->dto->organization_code,
            "department"=>$this->dto->department,
            "total_question"=>$this->dto->total_questions,
            "mark_per_score"=>$this->dto->score,
            "status"=>"set",
            "save_id"=>"ref/". substr($this->dto->otp, 0, 3),
        ];

        $newMig2 = new Migration(null, $this->table);
        $mig2 = $newMig2->saveUniqueMulti($col, $val, $data);
        // return $mig2;
        $decodeMig2 = json_decode($mig2, true);
        if($decodeMig2["status"]==="success"){
            return json_encode([
                "status"=>"success",
                "response"=>"Data save successfully"
            ], JSON_PRETTY_PRINT);
            exit();
        }else{
            return json_encode([
                "status"=>"failed",
                "response"=>"Failed, department and organization code already exist"
            ], JSON_PRETTY_PRINT);
            exit();
        }
      }else{
        return json_decode([
            "status"=>"failed",
            "response"=>"Yet to set the department"
        ], JSON_PRETTY_PRINT);
        exit();
      }
    }
}
