<?php
namespace NewdichSrc\Query;
use NewdichMail\Index;
use NewdichSchema\Platform;
use NewdichDto\AnsofraDto;
use NewdichSchema\Migration;

class NotifyUserExam{
    private $dto;
    // private $table = Platform::SETEXAMTIME_TABLE;
    private $table2 = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department
        ];

        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where, 0, 20);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            $reponse = $decodeMig['reponse'];
        }
    }
}

?>