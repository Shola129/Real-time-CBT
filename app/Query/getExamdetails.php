<?php
namespace NewdichApp\Query;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class getExamdetails{
    private $dto;
    private $table = Platform::SETEXAMTIME_TABLE;
    private $table1 = Platform::STATUS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where2 = [
            'regNum'=>$this->dto->regNum,
            'fullname'=>$this->dto->fullname
        ];

        $newMig1 = new Migration(null, $this->table1);
        $mig1 = $newMig1->get($where2, 0,1);
        $decode = json_decode($mig1, true);
        if($decode["status"]==="success"){
            $response = $decode["response"][0];
            if($response["status"]==="completed"){
                return json_encode([
                    'status'=>'fail',
                    'response'=>'user has already completed his or her exam'
                ], JSON_PRETTY_PRINT);
            }
            elseif($response==="writing"){
                $where = [
                    "department"=>$this->dto->department
                ];

                $newMig = new Migration(null, $this->table);
                $mig = $newMig->get($where, 0, 20);
                return $mig;
            }
            else{
                $where = [
                    "department"=>$this->dto->department
                ];

                $newMig = new Migration(null, $this->table);
                $mig = $newMig->get($where, 0, 20);
                return $mig;
            }
        }
        else{
            $where2 = [
                'regNum'=>$this->dto->regNum,
                'status'=>'writting',
                'fullname'=>$this->dto->fullname,
                'startAt'=>date('Y-m-d H:s:i'),
            ];

            $newMig3 = new Migration(null, $this->table1);
            $mig3 = $newMig3->save($where2);
            $decodeMig3 = json_decode($mig3, true);
            if($decodeMig3["status"]==="success"){
                $where = [
                    "department"=>$this->dto->department
                ];

                $newMig = new Migration(null, $this->table);
                $mig = $newMig->get($where, 0, 20);
                return $mig;
            }
            else{
                return $mig3;
            }
        }
    }
}
?>