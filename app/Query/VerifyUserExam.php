<?php
namespace NewdichApp\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class VerifyUserExam{
    private $dto;
    private $table = Platform::OTPDB_TABLE;

   public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department,
            // "DepartmentCode"=>$this->dto->DepartmentCode,
            "subject"=>$this->dto->subject,
            // "subjectCode"=>$this->dto->subjectCode,
            "regNum"=>$this->dto->regNum,
            // "organization_code"=>$this->dto->organization_code
        ];
        
        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 10);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $response = $decodeMig["response"][0];
            if($response["status"]==="completed"){
                return json_encode([
                    "status"=>"failed",
                    "response"=>"exam completed"
                ], JSON_PRETTY_PRINT);
            }elseif($response["status"]==="writing"){
                return json_encode([
                    "status"=>"success",
                    "response"=>"Grant access to contiune"
                ], JSON_PRETTY_PRINT);
            }
        }else{
            return json_encode([
                "status"=>"success",
                "response"=>"Grant access"
            ], JSON_PRETTY_PRINT);
        }
    }
}
?>