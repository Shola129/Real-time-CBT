<?php
namespace NewdichApp\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class SaveScore{
    private $dto;
    private $table = Platform::SAVESCORE_TABLE;
    private $table2 = Platform::USERS_TABLE;
    private $table3 = Platform::QUESTIONATTEMPTS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            'score'=>$this->dto->score,
            'subject'=>$this->dto->subject,
            'department'=>$this->dto->department,
            'regNum'=>$this->dto->regNum,
            'saveAt'=>date("Y-m-d H:i:s")
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->save($data);
        $decode = json_decode($mig, true);
        if($decode["status"]==="success"){
            $score = $this->dto->scroe;
           $totalScore = 0;
           foreach($score as $itme){
            $totalScore += $itme['score'];
           }
           
           $data2 = [
            'score'=>$totalScore
           ];

           $where = [
            'regNum'=>$this->dto->regNum
           ];

           $newMig2 = new Migration(null, $this->table2);
           $mig2 = $newMig2->edit($data2, $where);
           $decodeMig2 = json_decode($mig2, true);
           if($decodeMig2["status"]==="success"){
              $data3 = [
                'score'=>$this->dto->score,
                'status'=>'completed'
              ];
              
              $where3 = [
                'regNum'=>$this->dto->regNum,
                'subject'=>$this->dto->subject,
                'department'=>$this->dto->department
              ];

              $newMig3 = json_decode(null, $this->table3);
              $mig3 = $newMig3->edit($data3, $where3);
              $decodeMig3 = json_decode($mig3, true);
              if($decodeMig3["status"]==="success"){
                    return json_encode([
                        'status'=>"success",
                        'response'=>"active"
                    ], JSON_PRETTY_PRINT);
              }
              else{
                return $mig3;
              }
           }
           else{
                return $mig2;
           }
        }
        else{
            return $mig;
        }
    }
}

?>