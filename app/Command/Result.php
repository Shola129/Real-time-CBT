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
        $where = [
            "regNum"=>$this->dto->regNum
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where,0, 1);
        $decodemig = json_decode($mig, true);
        if($decodemig["status"]==="success"){
            $data = [
                "overAll"=>$this->dto->overAll
            ];

            $where = [
                "regNum"=>$this->dto->regNum
            ];
            
            $newMig2 = new Migration(null, $this->table);
            $mig2 = $newMig2->edit($data, $where);
            return $mig2;
        }else{
            $data = [
                'subject_scores'=>$this->dto->subjectAndScore,
                'overAll'=>$this->dto->overAll,
                'department'=>$this->dto->department,
                'fullname'=>$this->dto->fullname,
                'regNum'=>$this->dto->regNum,
                'createdAt'=>date("Y-m-d H:i:s"),
                'status'=>'completed',
                'publish'=>'pending',
                'email'=>$this->dto->email,
                'organization_code'=>$this->dto->organization_code
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
            else{
                return $mig;
            }
        }
    }

    // public function process(){
        // $data = [
        //     'subject_scores'=>$this->dto->subjectAndScore,
        //     'overAll'=>$this->dto->overAll,
        //     'department'=>$this->dto->department,
        //     'fullname'=>$this->dto->fullname,
        //     'regNum'=>$this->dto->regNum,
        //     'createdAt'=>date("Y-m-d H:i:s"),
        //     'status'=>'completed',
        //     'publish'=>'pending',
        //     'email'=>$this->dto->email,
        //     'organization_code'=>$this->dto->organization_code
        // ];

        // $newMig = new Migration(null, $this->table);
        // $mig = $newMig->save($data);
        // $decode = json_decode($mig, true);
        // if($decode["status"]==="success"){
        //     $where = [
        //         'regNum'=>$this->dto->regNum
        //     ];
        //     $data = [
        //         'status'=>'completed',
        //     ];

        //     $newMig2 = new Migration(null, $this->table2);
        //     $mig2 = $newMig2->edit($data, $where);
        //     return $mig2;
        // }
        // else{
        //     return $mig;
        // }
    }
// }

?>