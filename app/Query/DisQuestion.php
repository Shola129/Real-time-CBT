<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class DisQuestion{
    private $dto;
    private $table = Platform::QUESTIONATTEMPTS_TABLE;
    private $table2 = Platform::QUESTIONS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto->$dto;   
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department,
            'subject'=>$this->dto->subject,
            'regNum'=>$this->dto->regNum
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            return $mig;
        }
        else{
            $where2 = [
                'department'=>$this->dto->department,
                'subject'=>$this->dto->subject
            ];

            $newMig2 = new Migration(null, $this->table2);
            $mig2 = $newMig2->get($where2);
            $decodeMig2 = json_decode($mig2, true);
            if($decodeMig2["status"]==="success"){
                $response = [$decodeMig2]["response"];
                shuffle($response);
                $newMig3 = new Migration(null, $this->table);
                $data = [
                    'department'=>$this->dto->department,
                    'subject'=>$this->dto->subject,
                    'regNum'=>$this->dto->regNum,
                    'question'=>json_encode($response),
                    'status'=>'active',
                    'score'=>$this->dto->score ?? '',
                    'startedAt'=>date("Y-m-d H:i:s")
                ];
                $mig = $newMig3->save($data);
                return json_encode([
                    'status'=>'success',
                    'response'=>$response
                ], JSON_PRETTY_PRINT);
            }
        }
    }
}
?>