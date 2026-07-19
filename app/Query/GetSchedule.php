<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class GetSchedule{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'organization_code'=>$this->dto->organization_code,
            'department'=>$this->dto->department,
            'status'=>$this->dto->status
        ];


        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 5);
        return $mig;
        // return json_encode([
        //     "status"=>"fail",
        //     "respose"=>$where
        // ], true);
    }
}

?>