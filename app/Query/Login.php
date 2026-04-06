<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class Login{
    private $dto;
    private $table = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'email'=>$this->dto->email
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0,1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $response = $decodeMig["response"][0];
            $password = $response["password"];
            $pass = $this->dto->password
        }
    }
}

?>