<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class GetActiveSch{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "status"=>$this->dto->status ?? "active",
            'organization_code'=>$this->dto->organization_code,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where);
        return $mig;
    }
}

?>

