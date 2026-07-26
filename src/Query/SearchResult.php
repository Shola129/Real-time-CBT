<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SearchResult{
    private $dto;
    private $table = Platform::RESULT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $type = $this->dto->type;
        if($type=="regNum"){
            $where = [
                "regNum"=>$this->dto->value,
                "organization_code"=>$this->dto->organization_code
            ];

            $newMig = new Migration(null, $this->table);
            $mig = $newMig->get($where, 0, 200);
            return $mig;
        }elseif($type==="fullname"){
            $where = [
                "fullname"=>$this->dto->value,
                "organization_code"=>$this->dto->organization_code
            ];

            $newMig = new Migration(null, $this->table);
            $mig = $newMig->get($where, 0, 200);
            return $mig;
        }else{
            $where = [
                "department"=>$this->dto->value,
                "organization_code"=>$this->dto->organization_code
            ];

            $newMig = new Migration(null, $this->table);
            $mig = $newMig->get($where, 0, 200);
            return $mig;
        }
    }
}

?>