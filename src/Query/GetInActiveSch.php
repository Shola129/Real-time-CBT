<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class GetInActiveSch{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "status"=>$this->dto->status ?? "inactive",
            'organization_code'=>$this->dto->organization_code,
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->count($where);
        return $mig;
    }
}

?>

