<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetSubjectTimeTable{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'organization_code'=>$this->dto->organization_code,
            'department'=>$this->dto->department,
        ];


        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 100);
        return $mig;
        // return json_encode([
        //     "status"=>"fail",
        //     "respose"=>$where
        // ], true);
    }
}

?>