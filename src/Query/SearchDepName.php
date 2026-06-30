<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Migration;
use NewdichSchema\Platform;

class SearchDepName{
    private $dto;
    private $table = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department,
            "organization_code"=>$this->dto->organization_code,
            "role"=>$this->dto->role,
        ];

        // return json_encode([
        //     "status"=>"failed",
        //     "response"=>$where
        // ], true);
        
        $newmig = new Migration(null, $this->table);
        $mig = $newmig->get($where, 0, 1);
        return $mig;
    }
}

?>