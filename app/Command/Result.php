<?php
namespace NewdichApp\Command;
use NewdichSchema\Platform;
use NewdichSchema\Migration;
use NewdichDto\AnsofraDto;

class Result{
    private $dto;
    private $table = Platform::RESULT_TABLE;
    private $table2 = Platform::STATUS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'subject_scores'=>$this->dto->subjectAndScore,
            'overAll'=>$this->dto->overAll,
            'department'=>$this->dto->department,
            'fullname'=>$this->dto->fullname,
            'regNum'=>$this->dto->regNum,
            'createdAt'=>date("Y-m-d H:i:s"),
            'status'=>'completed',
            'publish'=>'pending',
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->save($data);
        $decode = json_decode($mig, true);
        if($decode["status"]==="success"){
            $where = [
                'regNum'=>$this->dto->regNum
            ];
            $data = [
                'status'=>'completed',
            ];

            $newMig2 = new Migration(null, $this->table2);
            $mig2 = $newMig2->edit($data, $where);
            return $mig2;
        }
    }
}

?>