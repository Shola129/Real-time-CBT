<?php
namespace NewdichApp\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichMiddleware\Index;

class EditPassword{
    private $dto;
    private $table = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "organization_code"=>$this->dto->organization_code,
            "regNum"=>$this->dto->regNum,
        ];
        
        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]=="success"){
            $response = $decodeMig["response"][0];
            $DbPwd = $response["password"];
            $current_pwd = $this->dto->old_password;
            // $newMid = new Index();
            // $mid = $newMid->verifyHash($)  
            if($DbPwd != $current_pwd){
                return json_decode([
                    "status"=>"failed",
                    "respnse"=>"old password is not correct"
                ], JSON_PRETTY_PRINT);
            }else{
                $data = [
                    "password"=>$this->dto->password
                ];

                $where = [
                    "organization_code"=>$this->dto->organization_code,
                    "regNum"=>$this->dto->regNum
                ];

                $newMig2 = new Migration(null, $this->table);
                $mig2 = $newMig2->edut($data, $where);
                return $mig2;
            }
        }else{
            return $mig;
        }
    }
}

?>