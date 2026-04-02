<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class CountSch{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'role'=>'set'
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->count($where);
        return $mig;
    }
}
?>