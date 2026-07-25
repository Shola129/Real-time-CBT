<?php
namespace NewdichSrc\Query;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class DelScheduleExam{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "exam_time_table_id"=>$this->dto->id
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->remove($where);
        return $mig;
    }
}

?>