<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SeacrhQues{
    private $dto;
    private $table = Platform::QUESTIONS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where  = [
            'department'=>$this->dto->department,
            'subject'=>$this->dto->subject,
            'orgnization_code'=>$this->dto->orgnization_code
        ];

        $neMig = new Migration(null, $this->table);
        $mig = $neMig->get($where, 0, 20);
        return $mig;
    }
}

?>