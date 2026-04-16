<?php
namespace NewdichSrc\Query;
use NewdichDto\AnsofraDto;
use NewdichMail\Index;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class RelResult{
    private $dto;
    private $table = Platform::RESULT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'status'=>$this->dto->status
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->get($where, 0, 20);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $response = $decodeMig["response"];
            foreach($response as $row){
                $email = $row["email"];
                $score = $row["overAll"];
                $fullname = $row["fullname"];
                $department = $row["department"];
                $regNum = $row["regNum"];
                $subjectScores = json_decode($row["subject_scores"], true);
                foreach($subjectScores as $col){
                    $scores = $col["score"];
                    $subject = $col["subject"];
                    $table = "<table>
                                <td>
                                    <tr>Subjects</tr>
                                    <tr>Scores</tr>
                                </td>
                                <td>
                                    <tr>$scores</tr>
                                    <tr>$subject</tr>
                                </td>
                            </table>";
                $body = "Dear $fullname, your overall score is $score with $table. RegNumber $regNum";;
                $newMail = new Index();
                $mail = $newMail->sendOtp('TimeTable', $body, $email);
                $decodeMail = json_decode($mail, true);
                if($decodeMail['status']==="success"){
                    return json_encode([
                        'status'=>'success',
                        'response'=>'time scheduled have being saved and sent to the registered user department to ready'
                    ], JSON_PRETTY_PRINT);
                }
                else{
                    return $mail;
                }
                }
            }
        }
    }
} 
?>