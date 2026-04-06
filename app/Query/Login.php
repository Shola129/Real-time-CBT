<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichAuth\Authentication;

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
            $pass = $this->dto->password;
            if($pass===$password){
                $newAuth = new Authentication();
                $auth = $newAuth->auth($this->dto->email, "USER");
                $decodeAuth = json_decode($auth, true);
                if($decodeAuth["status"]==="success"){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'allow in'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return $auth;
                }
            }
            else{
                return json_encode([
                    'status'=>'fail',
                    'response'=>'password not correct'
                ], JSON_PRETTY_PRINT);
            }
        }
        else{
             return json_encode([
                'status'=>'failed',
                'response'=>'email no found'
            ], JSON_PRETTY_PRINT);
        }
    }
}

?>