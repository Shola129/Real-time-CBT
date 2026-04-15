<?php
namespace NewdichSrc\Query;
use NewdichMail\Index;
use NewdichSchema\Platform;
use NewdichDto\AnsofraDto;
use NewdichSchema\Migration;

class NotifyUserExam{
    private $dto;
    // private $table = Platform::SETEXAMTIME_TABLE;
    private $table2 = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            "department"=>$this->dto->department
        ];

        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where, 0, 20);
        $decodeMig = json_decode($mig, true);
        if($decodeMig['status']==="success"){
            // $reponse = $decodeMig["response"][0];
            // $time = $this->dto->timeSchedule;
            // $allEamil = $reponse["email"];
            // $a = count($allEamil);
            // $holdEmail = "";
            // for($i=0; $i<$a; $i++){
            //     $holdEmail=$allEmail[$i];
            // }
            // $body = "Th time set for cbt exam is $time";
            // $newMail = new Index();
            // $mail = $newMail->sendOtp('TimeTable', $body, $holdEmail);
            // $decodeMail = json_decode($mail, true);
            // if($decodeMail['status']==="success"){
            //     return json_encode([
            //         'status'=>'success',
            //         'response'=>'time scheduled have being saved and sent to the registered user department to ready'
            //     ], JSON_PRETTY_PRINT);
            // }
            // else{
            //     return $mail;
            // }

            $response = $decodeMig["response"];
            $name = $this->dto->fullname;
            $start = $this->dto->start;
            $end = $this->dto->end;
            $date = $this->dto->date;
            foreach($response as $row){
                $email = $row["email"];
                $name = $row["fullname"];
                $body = "<!DOCTYPE html>
                    <html lang='en'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes'>
                        <title>Exam Timetable Notification</title>
                        <style>
                            /* Reset & base styles for email client compatibility */
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }

                            body {
                                background-color: #eef2f7;  /* soft neutral background for email clients */
                                font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                line-height: 1.5;
                                padding: 24px 16px;
                            }

                            /* main email container – classic card style */
                            .email-container {
                                max-width: 620px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 20px;
                                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03);
                                overflow: hidden;
                                border: 1px solid #e0e7ed;
                            }

                            /* header area: blue + white + red accent */
                            .email-header {
                                background: linear-gradient(135deg, #0a2b4e 0%, #0f3b6f 100%);
                                padding: 28px 32px 24px 32px;
                                text-align: center;
                                border-bottom: 4px solid #d32f2f; /* classic red accent line */
                            }

                            .header-icon {
                                font-size: 48px;
                                margin-bottom: 10px;
                                display: inline-block;
                                background: rgba(255,255,255,0.12);
                                padding: 12px;
                                border-radius: 60px;
                                line-height: 1;
                            }

                            .email-header h1 {
                                color: white;
                                font-size: 26px;
                                font-weight: 600;
                                letter-spacing: -0.2px;
                                margin: 8px 0 6px 0;
                            }

                            .exam-badge {
                                background-color: #d32f2f;
                                color: white;
                                display: inline-block;
                                padding: 5px 16px;
                                border-radius: 40px;
                                font-size: 14px;
                                font-weight: 500;
                                margin-top: 12px;
                                letter-spacing: 0.3px;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                            }

                            /* body content */
                            .email-body {
                                padding: 32px 32px 28px 32px;
                                background: #ffffff;
                            }

                            .greeting {
                                font-size: 18px;
                                color: #1a2c3e;
                                margin-bottom: 20px;
                                font-weight: 500;
                                border-left: 4px solid #d32f2f;
                                padding-left: 18px;
                                background: #fefaf9;
                                border-radius: 0 12px 12px 0;
                            }

                            .greeting strong {
                                color: #0a2b4e;
                            }

                            .message-text {
                                color: #2c3e4e;
                                margin-bottom: 28px;
                                font-size: 15px;
                                background: #f9fbfd;
                                padding: 12px 16px;
                                border-radius: 16px;
                                border: 1px solid #eef2fa;
                            }

                            /* timetable table styling – clean & classic */
                            .timetable-wrapper {
                                margin: 28px 0 24px 0;
                                overflow-x: auto;
                                border-radius: 18px;
                                border: 1px solid #e2e9f0;
                                background: white;
                            }

                            .exam-table {
                                width: 100%;
                                border-collapse: collapse;
                                font-size: 15px;
                                min-width: 380px;
                            }

                            .exam-table th {
                                background-color: #0a2b4e; /* deep blue */
                                color: white;
                                font-weight: 600;
                                padding: 14px 12px;
                                text-align: left;
                                font-size: 15px;
                                letter-spacing: 0.3px;
                            }

                            .exam-table td {
                                padding: 14px 12px;
                                border-bottom: 1px solid #e9edf2;
                                color: #1e2f3c;
                                background-color: #ffffff;
                            }

                            .exam-table tr:last-child td {
                                border-bottom: none;
                            }

                            .exam-table tr:hover td {
                                background-color: #fafcff;
                            }

                            /* subject column subtle style */
                            .subject-cell {
                                font-weight: 600;
                                color: #0a2b4e;
                            }

                            /* date & time styling */
                            .date-cell {
                                font-weight: 500;
                            }

                            /* red highlight for important notes */
                            .important-note {
                                background-color: #fff5f5;
                                border-left: 4px solid #d32f2f;
                                padding: 14px 18px;
                                border-radius: 14px;
                                margin: 28px 0 18px 0;
                                font-size: 14px;
                                color: #a12626;
                            }

                            .important-note i {
                                font-style: normal;
                                font-weight: 600;
                            }

                            .footer-note {
                                margin-top: 24px;
                                border-top: 1px dashed #cbdbe0;
                                padding-top: 22px;
                                text-align: center;
                                font-size: 13px;
                                color: #5f7a92;
                            }

                            .footer-note p {
                                margin: 5px 0;
                            }

                            .button-info {
                                background-color: #eef3fc;
                                display: inline-block;
                                padding: 6px 14px;
                                border-radius: 30px;
                                font-size: 12px;
                                color: #0a2b4e;
                                font-weight: 500;
                                margin-top: 8px;
                            }

                            .email-footer {
                                background-color: #f8fafc;
                                padding: 20px 32px;
                                text-align: center;
                                font-size: 12px;
                                color: #4a627a;
                                border-top: 1px solid #e2e9f0;
                            }

                            .red-dot {
                                color: #d32f2f;
                                font-weight: bold;
                            }

                            @media (max-width: 560px) {
                                .email-body {
                                    padding: 24px 20px;
                                }
                                .email-header {
                                    padding: 22px 20px;
                                }
                                .exam-table th, .exam-table td {
                                    padding: 10px 8px;
                                    font-size: 13.5px;
                                }
                                .greeting {
                                    font-size: 16px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class='email-container'>
                            <!-- HEADER: deep blue background, white text, red accent border -->
                            <div class='email-header'>
                                <h1>📢 Examination Timetable</h1>
                                <div class='exam-badge'>Spring 2026 • Final Exams</div>
                            </div>

                            <!-- MAIN CONTENT -->
                            <div class='email-body'>
                                <div class='greeting'>
                                    <strong>Dear $name,</strong>
                                </div>
                                <div class='message-text'>
                                    We are pleased to release the official exam schedule for the upcoming session. 
                                    Please review your exam dates, timings, and subjects carefully. Make sure to arrive at 
                                    your assigned venue at least <span class='red-dot'>30 minutes before</span> the scheduled time. 
                                    <br><br>
                                    <!-- <span style='font-size:13px; background:#f0f5ff; display:inline-block; padding:4px 10px; border-radius:30px;'>📌 Exam period: May 10 – May 22, 2026</span> -->
                                </div>

                                <!-- TIMETABLE SECTION: classic design with blue header, white rows -->
                                <div class='timetable-wrapper'>
                                    <table class='exam-table' cellpadding='0' cellspacing='0'>
                                        <thead>
                                            <tr>
                                                <th>📅 Date</th>
                                                <th>⏰ Time (Start)</th>
                                                <th>⏰ Time (End)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>$date</td>
                                                <td>$start</td>
                                                <td>$end</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- IMPORTANT RULES with red/blue accents -->
                                <div class='important-note'>
                                    <i>⚠️ Important Instructions:</i><br>
                                    • Bring valid student ID and printed admission slip.<br>
                                    • No electronic devices (smartwatches, phones) allowed inside exam hall.<br>
                                    • Latecomers will not be permitted after 15 minutes of start time.<br>
                                    • For any conflict, contact examination office before May 5, 2026.
                                </div>

                                <!-- additional helpful note: classic reminder -->
                                <div class='footer-note'>
                                    <p>📎 <strong>Need to reschedule or have a clash?</strong> Reach out to the Exam Coordination team via email: <span style='color:#0a2b4e;'>exams@university.edu</span></p>
                                </div>
                            </div>

                            <!-- FOOTER: subtle blue-white pattern -->
                            <div class='email-footer'>
                                <p style='margin-bottom:6px;'>© 2026 University Examination</p>
                            
                            </div>
                        </div>
                    </body>
                    </html>";
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
        else{
            return json_decode([
                'status'=>'fail',
                'response'=>'no user found registered for the department'
            ], JSON_PRETTY_PRINT);
        }
    }
}

?>