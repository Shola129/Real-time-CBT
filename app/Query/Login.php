<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichAuth\Authentication;

class Login{
    private $dto;
    private $mid;
    private $table = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto, Index $mid){
        $this->dto=$dto;
        $this->mid=$mid;
    }

    public function process(){
        $where = [
            'email'=>$this->mid->cleanData($this->dto->email),
            'regNum'=>$this->mid->cleanData($this->dto->regNum)
        ];

        $newMIg = new Migration(null, $this->table);
        $mig = $newMIg->get($where, 0, 1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==='success'){
            return $mig;
            // $response = $decodeMig['response'][0];
            // $password = $response['password'];
            // $pwd = $this->mid->cleanData($this->dto->password);
            // if($pwd === $password){
                $email = $this->mid->cleanData($this->dto->email);
                $role = "role";
                // $newAuth  = new Authentication();
                // $auth = $newAuth->auth($email, $role);
                // return $auth;
                // $decodeAuth = json_decode($auth, true);
                // if($decodeAuth['status']==='success'){
                //     $res = $decodeAuth['response'];
                //     $response["response"] = $res;
                //     return json_encode([
                //         'status'=>'success',
                //         'response'=>$response
                //     ], JSON_PRETTY_PRINT);
                // }
                // else{
                //     return $auth;
                // }
            // }
            // else{
                // return json_encode([
                //     'status'=>'failed',
                //     'response'=>'incorrect password'
                // ], JSON_PRETTY_PRINT);
            // }
        }
        else{
            return $mig;
        } 
    }
}

?>