<?php
namespace NewdichRoute;
use NewdichSchema\Settings;

$serverDir = $_SERVER["DOCUMENT_ROOT"]; //server directory
$docRoot = Settings::DOC_ROOT;
//let apis request go to apis controller
//let app request go to app controller
//let src request go to src controler
$rootDir = Settings::ROOT_DIRECTORY; //the root directory of the project
//set it in the .env file
//$rootDir can be / and it can be something like /vtu
//for example, let's say you have one server/host and you have many project in it.
//Example, in your localhost(/var/www/html), let's say you have 3 different projects:
//ecommerce, vtu, fintech.
//inside your localhost(/var/www/html), you will have
// var/www/html/ecommerce
// var/www/html/vtu
// var/www/html/fintech
//so, for ecommerce, the root directory is /ecommerce
//for vtu, the root directory is /vtu and for fintech the root directory is /fintech
//and if it is only one project you have, and the one project is inside (/var/www/html)
// then the root directory will be /
$usersArea = $docRoot . $rootDir ."/api"; //the area that users can access
// let's say your root directory is / . Then the usersArea will be /api
// if your root directory is /ecommerce, your usersArea will be /ecommerce/api
// if your root directory is /vtu, your usersArea will be /vtu/api
$adminArea = $docRoot . $rootDir ."/apiadmin"; //the area that only admin can access
// let's say your root directory is /, your adminArea will be /apiadmin
// if your root directory is /ecommerce, your adminArea will be /ecommerce/apiadmin
//$appController = $serverDir.$rootDir."/Controller/App";
//$srcController = $serverDir.$rootDir."/Controller/Src";
$appController = "/../Controller/App";
$srcController = "/../Controller/Src";
if($url === $rootDir || $url === $rootDir . "/" || $url === $rootDir . "/index.html" || $url === $rootDir . "/index.php" || $url === $docRoot . $rootDir || $url === $docRoot . $rootDir . "/"){
    require_once __DIR__ . "/../ansofra/public/index.html";
    exit();
}
elseif($url === $usersArea || $url === $usersArea . "/"){
    require_once __DIR__ . $appController."/AppLanding.php";
    exit();
}

elseif($url === $docRoot . $rootDir . "/ilease" || $rootDir === $docRoot . $rootDir . "/ilease" . "/"){
    require_once __DIR__ .  "/../ansofra/public/admin/index.html";
    exit();
}

elseif($url===$docRoot.$rootDir."/ilease/login" || $url===$docRoot.$rootDir."/ilease/login" ."/"){
    require_once __DIR__ . "/../ansofra/public/admin/login.html";
    exit();
}

elseif($url===$docRoot.$rootDir."/ilease/register" || $url===$docRoot.$rootDir."/ilease/register" ."/"){
    require_once __DIR__ . "/../ansofra/public/admin/register.html";
    exit();
}

elseif($url===$docRoot.$rootDir."/ilease/otp/verification" || $url===$docRoot.$rootDir."/ilease/otp/verification" ."/"){
    require_once __DIR__ . "/../ansofra/public/admin/otp.html";
    exit();
}

elseif($url === $docRoot.$rootDir."/ilease/2FA/verification" || $url === $docRoot.$rootDir."/ilease/2FA/verification" . "/"){
    require_once __DIR__ . "/../ansofra/public/admin/2FA.html";
    exit();
}

elseif($url === $docRoot.$rootDir."/ilease/dashboard" || $url === $docRoot.$rootDir."/ilease/dashboard" ."/"){
    require_once __DIR__ . "/../ansofra/public/admin/dashboard.html";
    exit();
}

elseif($url===$docRoot.$rootDir."/ilease/validateEmail" || $url===$docRoot.$rootDir."/ilease/validateEmail" . "/"){
    require_once __DIR__ . "/../ansofra/public/admin/validateemail.html";
    exit();
}

// for user's area

elseif($url === $docRoot.$rootDir."/Login" || $url===$docRoot.$rootDir."/Login" . "/"){
    require_once __DIR__ ."/../ansofra/public/login.html";
    exit();
}

elseif($url=== $docRoot.$rootDir ."/Register" || $url ===$docRoot.$rootDir."/Register" ."/"){
    require_once __DIR__ . "/../ansofra/public/register.html";
    exit();
}

elseif($url=== $docRoot.$rootDir ."/Verification" || $url ===$docRoot.$rootDir."/Verification" ."/"){
    require_once __DIR__ ."/../ansofra/public/otp.html";
    exit();
}

elseif($url=== $docRoot.$rootDir ."/Dashboard" || $url ===$docRoot.$rootDir."/Dashboard" ."/"){
    require_once __DIR__ ."/../ansofra/public/dashboard.html";
    exit();
}

// else($url=== $docRoot.$rootDir ."/" || $url ===$docRoot.$rootDir."/" ."/"){

// }

// else($url=== $docRoot.$rootDir ."/" || $url ===$docRoot.$rootDir."/" ."/"){

// }

// else($url=== $docRoot.$rootDir ."/" || $url ===$docRoot.$rootDir."/" ."/"){

// }

// else($url=== $docRoot.$rootDir ."/" || $url ===$docRoot.$rootDir."/" ."/"){

// }

// else($url=== $docRoot.$rootDir ."/" || $url ===$docRoot.$rootDir."/" ."/"){

// }

// else($url=== $docRoot.$rootDir ."/" || $url ===$docRoot.$rootDir."/" ."/"){

// }


//backend
elseif($url === $adminArea."/run_migration"){
    require_once __DIR__ . $srcController."/RunMigration.php";
    exit();
}

elseif($url=== $adminArea."/validateEmail"){
    require_once __DIR__ . $srcController . "/ValidateEmailController.php";
    exit();
}
elseif($url===$adminArea."/process/otp"){
    require_once __DIR__ . $srcController . "/ProcessOtpController.php";
    exit();
}
elseif($url===$adminArea."/delete/otp"){
    require_once __DIR__ . $srcController . "/DeleteOtpController.php";
    exit();
}
elseif($url===$adminArea."/process/2FA"){
    require_once __DIR__ . $srcController ."/Process2FAController.php";
    exit();
}
elseif($url===$adminArea."/Delete/AD/Otp/"){
    require_once __DIR__ . $srcController . "/DeleteADController.php";
    exit();
}
elseif($url===$adminArea."/register"){
    require_once __DIR__ . $srcController . "/RegisterController.php";
    exit();
}
elseif($url===$adminArea."/login"){
    require_once __DIR__ . $srcController ."/LoginController.php";
    exit();
}
elseif($url===$adminArea."/Details"){
    require_once __DIR__ . $srcController . "/DetailsController.php";
    exit();
}
elseif($url===$adminArea."/TotalStudents"){
    require_once __DIR__ . $srcController . "/TotalStudentsController.php";
    exit();
}
elseif($url===$adminArea."/TotalSubjects"){
    require_once __DIR__ . $srcController . "/TotalSubjectsController.php";
    exit();
}
elseif($url===$adminArea."/Get/LastLogin"){
    require_once __DIR__ . $srcController. "/GetLastLoginController.php";
    exit();
}
elseif($url===$adminArea."/Set/LastLogin"){
    require_once __DIR__ . $srcController ."/LastLoginController.php";
    exit();
}
elseif($url===$adminArea."/Set/LastSeen"){
    require_once __DIR__ . $srcController ."/LastSeenController.php";
    exit();
}

elseif($url===$adminArea."/GET/students"){
    require_once __DIR__ . $srcController . "/StudentInfoController.php";
    exit();
}

elseif($url===$adminArea."/search/regNum"){
    require_once __DIR__ . $srcController . "/SearchRegNoController.php";
    exit();
}

elseif($url===$adminArea."/selected/department"){
    require_once __DIR__ . $srcController . "/SelectedDeptController.php";
    exit();
}

elseif($url===$adminArea."/total/department"){
    require_once __DIR__ . $srcController . "/TotalDepController.php";
    exit();
}

elseif($url === $adminArea . "/set/department"){
    require_once __DIR__ . $srcController . "/SetDeptController.php";
    exit();
}

elseif($url===$adminArea. "/get/department/set/list"){
    require_once __DIR__ . $srcController . "/GetDepListController.php";
    exit();
}

elseif($url=== $adminArea . "/search/dep/code"){
    require_once __DIR__ . $srcController . "/DepController.php";
    exit();
}

elseif($url===$adminArea."/get/allSubject/Dep"){
    require_once __DIR__ . $srcController . "/GetAllSubController.php";
    exit();
}

elseif($url===$adminArea. "/edit/department"){
    require_once __DIR__ . $srcController . "/EditDepartmentController.php";
    exit();
}

elseif($url===$adminArea. "/edit/subject"){
    require_once __DIR__ . $srcController . "/EditSubjectController.php";
    exit();
}

elseif($url===$adminArea. "/save/subject"){
    require_once __DIR__ . $srcController . "/SaveSubjectController.php";
    exit();
}

elseif($url===$adminArea. "/save/questions"){
    require_once __DIR__ . $srcController . "/SaveQuestController.php";
    exit();
}
elseif($url === $adminArea . "/seacrh/question"){
    require_once __DIR__ . $srcController . "/SeacrhQuesController.php";
    exit();
}

elseif($url === $adminArea . "/schedule/exam/time"){
    require_once __DIR__ . $srcController ."/ScheduleExamController.php";
    exit();
}

elseif($url === $adminArea . "/list/time/sets"){
    require_once __DIR__ . $srcController . "/ListTimeController.php";
    exit();
}

elseif($url===$adminArea . "/notify/user/ofExam"){
    require_once __DIR__ . $srcController . "/NotifyUserExamController.php";
    exit();
}

elseif($url === $adminArea . "/count/shedule"){
    require_once __DIR__ . $srcController . "/CountSchController.php";
    exit();
}

elseif($url === $adminArea . "/EditSchedule"){
    require_once __DIR__ . $srcController . "/EditSchController.php";
    exit();
}

elseif($url === $adminArea . "/Search/Dep/Sch"){
    require_once __DIR__ . $srcController . "/SchScheduleDepController.php";
    exit();
}


// /api endpoints
elseif($url === $docRoot . $rootDir . $usersArea."/register" || $url === $usersArea."/register"."/"){
    require_once __DIR__ . $appController."/RegisterController.php";
    exit;
}


else{
    require_once __DIR__ . "/.."."$rootDir/public/error/404.html";
    exit();
}
?>