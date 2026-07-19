<?php
namespace NewdichApp\Query;

use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class ExamAuth{
    private $dto;
    private $table = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "regNum"=>$this->dto->regNum,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        return $mig;
        // return json_encode([
        //     "status"=>"failed",
        //     'response'=>$where
        // ], true);
    }
}
?>