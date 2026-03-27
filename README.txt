ANSOFRA WAS DEVELOPED AND MAINTAINED BY NEWDICH TECHNOLOGY(A Software Engineering firm)
OFFICIAL WEBSITE: WWW.NEWDICH.TECH | SUPPORT EMAIL: NEWDICHNGR@GMAIL.COM | FACEBOOK: FACEBOOK.COM/NEWDICH
CREATED BY: SAMUEL IDEBI(A senior Software Engineer at NEWDICH TECHNOLOGY)
DESCRIPTION: ANSOFRA IS A FRAMEWORK THAT IS PERFECT FOR DEVELOPING ANY SOFTWARE.
THE NAME ANSOFRA IS AN ACRONYM OF THE PHRASE: ANY SOFTWARE FRAMEWORK(ANSOFRA)
IT FOLLOWS THE CQRS(COMMAND QUERY RESPONSIBILITY SEGREGATION) PATTERN WHICH IS A PERFECT ARCHITECTURE FOR BUILDING ANY SOFTWARE INCLUDING ENTERPRISE APPLICATIONS
IT MAKES MVP FASTER.
ANSOFRA SPEEDS UP DEVELOPMENT BY 60%
SOFTWARES BUILT WITH ANSOFRA FRAMEWORK ARE EASY TO MAINTAIN.
ANSOFRA ALLOWS A .NET DEVELOPER, JAVA DEVELOPER, C++ DEVELOPER TO EASILY GET ON AND EASILY BUILD IN PHP
TO USE ANSOFRA, YOU SHOULD HAVE A SOUND KNOWLEDGE IN CQRS ARCHITECTURE PATTERN.

BELOW ARE SOME DIRECTORIES AND FILES TO UNDERSTAND IN ANSOFRA.
index.php
    is the entry to the framework.
    it contains the autoload, it is where all request land before sending it to route

route
    The route directory contains an index.php file which receives the request sent from
    the landing index.php
    From the route directory, requests are then passed to the Controllers of
    the microservices in the apis directory, app directory, src directory.
    The namespace is NewdichRoute

apis
    This is the directory that contains microservices of API or third parties
    It contains an index.php file which is just a file for prevention
    It can contain microservices of other third parties APIs(Each microservice has Command, Controller, Query,)
    The namespace is NewdichApis

app
    The app directory is the backend for users and it contains all the app microservices of users on this project, 
    it is scannable on Swagger framework(that is it works with swagger)
    It contains a docs directory which is holds the JSON documentation(newdichapp.json) for Swagger framework
    It contains a swagger directory, the GUI for swagger documentation. This directory has an index.html file that can be loaded on a browser to show/see the API documentation for the whole app/ main directory
    It contains AppSpecification.php which is the file that contains the Info Details of the app/ swagger documentation
    It contains an index.php file, which is just an empty file(do not touch it).
    It can contain as many microservices as you want, for example, a default Account/ and Wallet/ microservices comes with it, which you may delete if you don't need it.
    The namespace is NewdichApp

Mail
    This is the directory for sending Emails.
    The namespace is NewdichMail
    it has a file Index.php which is the class that sends the mail
    It has 2 methods which are sendOtp() for sending OTP and sendMail() for sending mail.
    both the sendOtp() and sendMail() methods take 3 arguments which are :
    subject, body, recipient
    example
        use NewdichMail\Index;
        $newMail = new Index();
        //to send otp
        $subject ="Registration OTP";
        $body ="Use the OTP 123456 to complete your registration";
        $recipient ="user1@gmail.com";
        $sotp = $newMail->sendOtp($subject, $body, $recipient);

        //To send random mail(e.g marketing mail or any notification mail)
        $subject ="Release of new feature";
        $body ="Hi dear user, we just released a new feature on our app";
        $recipient ="activeuser@gmail.com";
        $smail = $newMail->sendMail($subject, $body, $recipient);
    
    To send email via sendgrid, use the Mail/Sendgrid.php class. It has a send() function
    The send() function takes 4 arguments which are:
        recipient Email
        recipient name
        Email subject
        Email content
        example
            use NewdichMail\Sendgrid;
            $newSendgrid = new Sendgrid();
            $newSendgrid->send($recipient_email, $recipient_name, $subject, $content);
        Note: Don't forget to set all your .env environment
    
    To send email via mailgun, use Mail/Mailgun.php class, it has send() function 
    The send() function takes 4 arguments which are:
        recipient Email
        recipient name
        Email subject
        Email content
        example
            use NewdichMail\Mailgun;
            $newMailgun = new Mailgun();
            $newMailgun->send($recipient_email, $recipient_name, $subject, $content);
        Note: Don't forget to set all your .env environment

    To send email via mailersend, use Mail/Mailersend.php class, it has send() function 
    The send() function takes 4 arguments which are:
        recipient Email
        recipient name
        Email subject
        Email content
        example
            use NewdichMail\Mailersend;
            $newMailsend = new Mailersend();
            $newMailsend->send($recipient_email, $recipient_name, $subject, $content);
        Note: Don't forget to set all your .env environment

public
    The public folder is the directory for the FrontEnd
    It has an admin/ directory which is the FrontEnd for admins, this sends and receives requests and responses from the src/ directory
    It contains assets/ directory that stores all the static assets like images, videos, gifs, favicon, logos, etc..
    It contains css/ directory that stores the CSS styling codes
    It contains js/ directory that stores the JS codes
    index.html is the landing page to the FrontEnd(This is where all users to the app lands)

Schema
    The Schema directory houses everything about the Database and the settings of the software
    The Dealer.php file contains the server connection codes
    index.php is an empty file(do not touch)
    Migration.php contains Database Migration codes
    Platform.php contains the lists of Database tables and the table Ids
    Settings.php contains the software's configuration like port, ips, names, otp emails, etc..
    The namespace is NewdichSchema
    Settings.php class :
        The Settings.php class loads all the configuration of your software.
        Your can set the configuration in the Settings.php class directly or load it from the .env environment to the Settings.php class
        The settings of your server, hosting, cloud, etc, is loaded/set in the Settings.php class
    Dealer.php class :
        The Dealer.php class connects your software to your server user, host, databases
        The Dealer.php class uses the configuration in the Settings.php class to make the connection
    Platform.php class :
        The Platform.php class contains your Database Tables.
        If you need to create any table, Add it to the Platform.php class, then load it in the RunMigration.php class and execute the RunMigration.php class
    Migration.php class :
        The Migration.php class contains the SQL/Database logic which should only be called.
        To use the Migration.php class anywhere in your project, use it by adding use NewdichSchema\Migration to the file or class where you want to use it.
        After adding it to the file or class where you need it, you can then create an object of the Migration class and start calling the methods/functions on the object created.
        E.G
        To create new database, use the createDB() method in the Migration.php class
        Pass the name of the databse to the createDB()
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $dbName = Settings::SERVER_DB;
            $usersTable = Platform::USERS;
            $usersTableColumns = Platform::USERS_COLUMNS;
            $adminTable = Platform::ADMINS;
            $adminTableColumns = Platform::ADMINS_COLUMNS;
            
            $newMigration = new Migration(); //createDB does not need the arguments passed into the constructor
            echo $newMigration->createDB($dbName);
        
        To create new table, use the createTB() method in the Migration.php class
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $dbName = Settings::SERVER_DB;
            $usersTable = Platform::USERS;
            $usersTableColumns = Platform::USERS_COLUMNS;
            $adminTable = Platform::ADMINS;
            $adminTableColumns = Platform::ADMINS_COLUMNS;

            $newMigration = new Migration($adminTableColumns, $adminTable); //pass the table columns and the table name as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->createTB();

        To insert/create data into table uniquely. That is if you want to insert into table but want to be sure no double entry. for example in the case of creating user accoun. you know one email should not be created more than once!
        So to insert/create such data uniquely, use the saveUnique() method in the Migration.php class
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $uniqueColName ="email";
            $uniqueValue ="useremail@gmail.com";
            $rowsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "fullname"=>"John Doe",
                "country"=>"Nigeria"
            ];
            //Note: the keys of the array must exist as column in the table

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->saveUnique($uniqueColName, $uniqueValue, $rowsInKeyValue);
        
        To insert/create data into table uniquely with multiple unique and multiple value. That is if you want to insert into table but want to be sure no double entry. for example in the case of creating user accoun. you know one email should not be created more than once!
        So to insert/create such data uniquely, use the saveUniqueMulti() method in the Migration.php class
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $uniqueColArray = ["email","id","phone"];
            $uniqueValueArray =["useremail@gmail.com", 10, 08010101010];
            $rowsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "fullname"=>"John Doe",
                "country"=>"Nigeria"
            ];
            //Note: the keys of the array must exist as column in the table
            //Note: The array of columns in the uniquecol must be in the table
            //Note: The array of values in the uniquevalue must follow the way you put the array of values in the unique columns

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->saveUniqueMulti($uniqueColArray, $uniqueValueArray, $rowsInKeyValue);
        
        To insert/create data into table without uniqueness. That is you don't mind even if there are duplicates. example is saving history or transaction records.
        To do this, use the save() method in the Migration.php class 
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $uniqueColName ="email";
            $uniqueValue ="useremail@gmail.com";
            $rowsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "fullname"=>"John Doe",
                "country"=>"Nigeria"
            ];
            //Note: the keys of the array must exist as column in the table

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->save($rowsInKeyValue);

        To select/fetch from table, use the get() method in Migration.php class
        The 3 arguments which are all OPTIONAL
        The first argument is the key=>value array of the condition to select
        The second argument is the offset, at which row should the selection start from.
        The third argument is the limit, the total number of rows to select/fetch
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $offset = 0;
            $limit = 50;
            $ConditionsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "password"=>"123456"
            ];
            //Note: the keys of the array must exist as column in the table

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->get($ConditionsInKeyValue, $offset, $limit);

            So under the hood, what happens is:
            SELECT * FROM $adminTable Where email=:email AND password=:password
            bindParam(':email', 'useremail@gmail.com');
            bindParam(':password', '123456');

            //note the arguments are all optional, so you can have something like:
            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->get();
        
        To select/fetch specific columns from table, use the getSpecific() method in Migration.php class
        The 4 arguments which are all OPTIONAL
        The first argument is the key=>value array of the condition to select
        The second argument is the array of the columns to select
        The third argument is the offset, at which row should the selection start from.
        The fouth argument is the limit, the total number of rows to select/fetch
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $offset = 0;
            $limit = 50;
            $ConditionsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "password"=>"123456"
            ];
            //Note: the keys of the array must exist as column in the table

            $columnsToSelect = [
                "email",
                "password",
                "country",
                "phone"
                "fullname"
            ];
            //Note: the array must exist as column in the table

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->getSpecific($ConditionsInKeyValue, $columnsToSelect, $offset, $limit);

            So under the hood, what happens is:
            SELECT email, password, country, phone, fullname FROM $adminTable Where email=:email AND password=:password
            bindParam(':email', 'useremail@gmail.com');
            bindParam(':password', '123456');

        To delete row from database table, use the remove() method in Migration.php class
        It takes one argument which is an array of condition to use in deleting the rows.
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $offset = 0;
            $limit = 50;
            $ConditionsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "password"=>"123456"
            ];
            //Note: the keys of the array must exist as column in the table

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->get($ConditionsInKeyValue);
            So under the hood, what happens is:
            DELETE FROM $adminTable Where email=:email AND password=:password
            bindParam(':email', 'useremail@gmail.com');
            bindParam(':password', '123456');
            //note: you must set the conditions for deleting the row.

        To update a row, use the edit() method in the Migration.php class.
        It takes 2 arguments, which are key=>value array of data to update, and the key=>value array of conditions to use in updating the row
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $updateDatakeyValue = [
                "fullname"=>"Samuel Idebi",
                "country"=>"Nigeria",
                "profession"=>"Software Engineering"
            ];
            //Note: the keys of the array must exist as column in the table

            $ConditionsInKeyValue = [
                "email"=>"useremail@gmail.com",
                "password"=>"123456"
            ];
            //Note: the keys of the array must exist as column in the table

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->edit($updateDatakeyValue, $ConditionsInKeyValue);
            So under the hood, what happens is:
            UPDATE $adminTable SET fullname=:fullname, country=:country, profession=:profession Where email=:email AND password=:password
            bindParam(':fullname', 'Samuel Idebi');
            bindParam(':country', 'Nigeria');
            bindParam(':profession', 'Software Engineering');
            bindParam(':email', 'useremail@gmail.com');
            bindParam(':password', '123456');
            //note: you must set both the data array and the conditions array
        
        To count table rowa, use the count() method in the Migration.php class.
        It takes 1 argument, which are key=>value array of conditions to use in counting the row
        example
            use NewdichSchema\Migration;
            use NewdichSchema\Platform;
            use NewdichSchema\Settings;
            $usersTable = Platform::USERS;
            $countDatakeyValue = [
                "status"=>"active"
            ];

            $newMigration = new Migration(null, $adminTable); //No table columns needed so just put null, only the table name is needed as contructor. check the Platform.php file to see how the table columns must be
            echo $newMigration->count($countDatakeyValue);
            
    RunMigration.php class :
        Once you configure your server in the Settings.php class
        And you have connected it to server in the Dealer.php class
        And you have set your tables and their columns in the Platform.php class
        Make sure you have set ROOT_DIRECTORY in the .env file
        You can then run migration to create all the Database structures
        To run migration, run this endpoint either on your browser or via an API call
            localhost/ROOT_DIRECTORY/apiadmin/run_migration
            Where ROOT_DIRECTORY is the ROOT_DIRECTORY you set in the .env file. e.g / , /ecommerce, etc..
        IMPORTANT NOTICE, ONLY ADMIN/PERSON WITH RIGHT ACCESS SHOULD BE ALLOWED TO RUN Migration
        -FOR SECURITY REASON, YOU CAN REMOVE run_migration ROUTE IN THE route/index.php BY JUST REMOVING THIS LINE
            elseif($url === $adminArea."/run_migration"){
                //Running the migration will create the admin database with details
                require_once $srcController."/RunMigration.php";
                exit();
            }
        YOU CAN ALSO REMOVE THIS LINE FROM THE Controller/Src/RunMigration.php
            namespace NewdichControllerSrc;
            require_once $serverDir.$rootDir."/Schema/RunMigration.php";

WHAT TO SET/CHANGE 
    SET YOUR .env FILE CORRECTLY.
    IF YOU ARE IN DEVELOPMENT, USE DEVELOPMENT Data
    IF YOU ARE IN PRODUCTION, USE PRODUCTION DATA.

src
    The src/ directory is the backend for admins.
    It can contain all the microservices for admins only
    it is scannable on Swagger framework(that is it works with swagger)
    It contains a docs directory which is holds the JSON documentation(newdichsrc.json) for Swagger framework
    It contains a swagger directory, the GUI for swagger documentation. This directory has an index.html file that can be loaded on a browser to show/see the API documentation for the whole app/ main directory
    It contains SrcSpecification.php which is the file that contains the Info Details of the app/ swagger documentation
    It contains an index.php file, which is just an empty file(do not touch it)
    It can contain as many microservices as you want.
    The namespace is NewdichSrc

Auth
    The Auth/ directory contains the classes that Authenticates and Authorizes All Roles(including Users and Admins)
    It contains Authentication and Authorization for Authenticating and Authorizing All Roles(including Users and Admins)
    NOTE: Authentication should be called once the user or admin has been Queried(that is logged in)
    NOTE: Authorization should be run on any request from user or admin to required endpoints.

Controller
    The Controller/ directory controls the routing of the software
    It takes request to the appropriate class in the right microservice in either Command or Query
    It is where Middleware should be run on incoming or outgoing requests
    It has 2 subdirectories(App and Src) which controls app(users) and src(admins) routing
    The App/ subdirectory has 2 classes Index.php and AppLanding.php.
    The Index.php loads the index.html file of the public(which is the landing page)
    The AppLanding.php loads the swagger UI of the app/(users api)
    The Src/ subdirectory also has 2 classes Index.php and RunMigration.php
    The RunMigration.php loads and executes Database Migration.

Cache
    The Cache/ directory handles caching. It uses Redis for caching
    It has Setup.php which connects the to your redis server. Do not touch this file
    It has RateLimit.php class that can be used for Rate limiting. It works with Redis, hence you must have your Redis server set up.
    The RateLimit.php class takes 3 arguments into its constructor which are: limit, window(in seconds), 1p
    Then you now call the process() function on it.
    example:
        use NewdichCache\RateLimit
        $newRateLimit = new RateLimit($limit, $window, $ip);
        $newRateLimit->process();
        //Note: $limit is the number of request per given period, $window is the duration of timeframe(in seconds), $ip is the IP address of the user.
    Note: make sure you have your redis installed on your server/machine and get the IP, Port, password
    Note: Open your .env file to update your redis server with the correct Ip, port, password.
    The Index.php class(Cache/Index.php) has methods you can use for caching and retrieveing:
    It has the following methods:
        setCache(): It is a method used to store cache, it takes 2 arguments, the key and the value to store.
            To use, include it in the file where you need it.
            example
            use NewdichCache\Index;
            $data ="data to save, it can be a string or an encoded array/object";
            $key ="mydata";
            $newobject = new Index();
            $newobject->setCache($key, $data);
        setExpireCache(): It is a method used to store cache with expiry time(in seconds), it takes 3 arguments, the key, the value to store and time in seconds.
            To use, include it in the file where you need it.
            example
            use NewdichCache\Index;
            $data ="data to save, it can be a string or an encoded array/object";
            $key ="mydata";
            $time = 60; //expires in 60 seconds
            $newobject = new Index();
            $newobject->setCache($key, $data, $time);
        setIncrease(): It is a method used to increase store values that are number(integer or float), it takes only 1 argument which is the key of the stored value
            To use, include it in the file where you need it.
            example
            use NewdichCache\Index;
            $key ="mynumber";
            $newobject = new Index();
            $newobject->setIncrease($key);
            //Note: you must have used setCache() or setExpireCache() to store the value before. And it must be number(integer or float).
        setDecrese(): It is a method used to decrease store values that are number(integer or float), it takes only 1 argument which is the key of the stored value
            To use, include it in the file where you need it.
            example
            use NewdichCache\Index;
            $key ="mynumber";
            $newobject = new Index();
            $newobject->setDecrease($key);
            //Note: you must have used setCache() or setExpireCache() to store the value before. And it must be number(integer or float).
        getCache(): It is a method used to retrieve stored values. it takes only 1 argument which is the key of the stored value
            To use, include it in the file where you need it.
            example
            use NewdichCache\Index;
            $key ="mynumber";
            $newobject = new Index();
            $newobject->getCache($key);
            //Note: you must have used setCache() or setExpireCache() to store the value before. 
Dto
    The Dto/ directory handles Data Transfer Object. It gets all the incoming data needed for computation
    Dto is passed through controller to the Classes where it's needed in the microservices in the command or queries
    It has 1 class which is AnsofraDto.php
    The AnsofraDto.php handles the incoming data needed

Files 
    The Files/ directory handles file(s) processing, such as file(s) uploading, file(s) downloading and more.
    To use it, the namespace is NewdichFiles.
    To upload file(s), you can check the Files/Upload.php class
    To download file(s), you can check the Files/Download.php class

Middleware
    The Middleware/ directory has all functions and methods that could be run on incoming or outgoing requests
    It has a class Index.php that contains all the functions

vendor
    The vendor/ directory contains all installed PHP libraries usable in your project

composer.json
    This file contains list of all installed PHP libraries
    It also contains autoload namespace declaration(psr-4) and other important PHP setups in your project in a JSON format
    Note: whenever you make any changes to your composer.json, always dump composer by running:
        composer dump-autoload
composer.lock
    It contains the locked of the composer.json file

ansofra-generator.sh 
    This is a shell file that generates the swagger annotation JSON documentation into the docs/ directory of /app and /src respectively.
    After you have made any changes to your Swagger/OpenApi annotations endponts, you must execute this file by running:
        ./ansofra-generator.sh

.env.example
    below are what should be in your .env file.
    in your root directory, create your .env file and add the following to it, don't forget to set the correct value to it.
    Note: if you are working in development, use development details, if in production, use production details.
    ROOT_DIRECTORY=The root directory of your project. e.g / , /fintech , /ecommerce , /vtu etc.
    APP_ENV=The environment you are currently working in.
    APP_VERSION=The version of your application e.g 2.1.0
    APP_NAME=The name of your application e.g newdich
    APP_TITLE=The title of your application
    APP_DESCRIPTION=Description of your application
    APP_SMTP=SMTP to use for sending email
    APP_PORT=port to use for sending email
    APP_OTP_EMAIL=email address for sending OTP e-mail
    APP_OTP_EMAIL_PASSWORD=email address for sending OTP password, usually App password(if using google gmail)
    APP_SENDING_EMAIL=email address for sending mails
    APP_SENDING_EMAIL_PASSWORD=email address password for sending mails

    #for annotations
    APP_ANNOTATION_TITLE=Users_Area_Endpoints
    SRC_ANNOTATION_TITLE=Admins_Area_Endpoints

    #set server configuration
    SERVER=Your server host e.g localhost or 127.0.0.1
    SERVER_USER=Your Server username e.g root
    SERVER_DB=Your Database name e.g myapp
    SERVER_PASS=Your very strong Server password e.g 1234556

    #other configuration
    DOMAIN_NAME=Your domain name e.g newdich.tech
    AUTH_KEY=Your JWT secret token

    #for redis caching
    REDIS_SERVER_IP=Your Redis server IP e.g 127.0.0.1
    REDIS_SERVER_PORT=Your Redis server Port e.g 6379
    REDIS_AUTH_PASSWORD=Your Strong Redis Server Authentication password e.g newdich_ansofra_12345

NOTE: DO NOT KEEP .env FILE IN THE public directory. keep it in a directory that cannot be accessed via web browser.
NOTE: MAKE SURE THAT IT'S ONLY THE public/ directory that is accessible via web browser.




USING ANSOFRA
TO USE ANSOFRA, YOU MUST INSTALL IT GLOBALLY ON YOUR DEVICE/MACHINE.
MAKE SURE YOU ALREADY HAVE composer INSTALLED.
THEN FOLLOW THESE STEPS.

STEP 1 : INSTALL ANSOFRA GLOBALLY
OPEN YOUR TERMINAL AND RUN:
    composer global require newdich/ansofra

STEP 2 : CONFIRM ANSOFRA IS INSTALLED
TO CONFIRM IT'S INSTALLED, OPEN YOUR TERMINAL AND RUN
    ansofra --version
YOU SHOULD SEE SOMETHING LIKE: ANSOFRA BY NEWDICH TECHNOLOGY
NOTE: IF YOU GET command not found ERROR, MAKE SURE TO ADD YOUR COMPOSER BIN TO YOUR ENVIRONMENT PATH

STEP 3 : CREATE YOUR PROJECT(APP/SOFTWARE) WITH ANSOFRA
NOW THAT YOU HAVE ANSOFRA INSTALLED ON YOUR MACHINE, YOU CAN NOW CREATE YOUR SOFTWARE FRAMEWORK WITH IT.
cd TO WHERE YOU WANT TO CREATE THE PROJECT AND RUN
    ansofra new name_of_your_project
EXAMPLE
    ansofra new myEcommerce
IT WILL CREATE A PROJECT NAMED myEcommerce WITH ALL THE ANSOFRA FRAMEWORKS(DIRECTORIES AND FILES) IN IT.
IT WILL ALSO START A SERVER AT http://localhost:8000
OPEN YOUR BROWSER AND LOAD https://localhost:8000 AND YOU SHOULD SEE THE ANSOFRA PAGE.
CONGRATULATIONS!! YOU CAN NOW START CODING AND USE..

STEP 4(OPTIONAL) : ALWAYS UPDATE YOUR ANSOFRA
WE REGULARLY MAINTAIN THE ANSOFRA FRAMEWORK, SO IT'S A GOOD PRACTICE TO ALWAYS UPDATE YOUR ANSOFRA ON YOUR MACHINE
TO UPDATE YOUR ANSOFRA, RUN
    composer global update newdich/ansofra

USING AND PASSING JWT ENCODED HASH FROM FRONTEND TO BACKEND.
    ONCE A USER HAS BEEN AUTHENTICATED, THE HASHED ARE STORED IN COOKIES, THEN FOR ANY
    FUTHER AUTHORIZATION, IT IS REQUIRED THAT THE USER IS CHECKED BEFORE BEING AUTHORIZED TO ACCESS SOME RESOURCES.
    SO, THE FRONT END SHOULD JUST ADD ANOTHER KEY VALUE NAMED credentials:"include" TO THE REQUEST COMING TO THE BACKED.
    SO THE FRONTEND API REQUEST WILL LOOK SOMETHING LIKE THIS:
    fetch("/link/to/backend/endpoint", {
        method:"POST",
        credentials:"include",
        headers:{
            'Content-Type':'application/json'
        }
    })


#NOTE: IN PRODUCTION ONLY GRANT PUBLIC ACCESS TO THE FOLDER/DIRECTORY NAMED ansofra
#MEANING THAT ON YOUR HOSTING SERVER, /ansofra will be the document root.
#NOTE: ENTERING POINT TO THE ANSOFRA IS /ansofra/index.php






ABOUT THE PROJECT (CBT) - README
================================================================================

WELCOME
-------
This is your personal exam board dashboard - your central hub for taking exams
and tracking your progress. Whether you're a student or instructor, everything
you need is right here.

GETTING STARTED
---------------

 LOGIN
To access the dashboard:
- Sign in using your Registration Number and Email Address
- Your credentials will be provided after registration

  REGISTRATION
1. Complete the registration form
2. You will receive your login details via email
3. Your exam schedule and allocated time slot will be included
4. Important: You can only access the exam during your scheduled time

TAKING EXAMS
------------
The exam process is simple and straightforward:

1. Login at your scheduled exam time
2. Select your exam from the dashboard
3. Review exam duration and question format
4. Answer all questions
5. Save your answers as you progress
6. Submit when complete

YOUR RESULTS
------------
- Results are automatically sent to your registered email address
- Allow 24-48 hours for result processing
- Check your inbox (and spam folder) for result notifications
- Results include your score and performance summary

FOR INSTRUCTORS
---------------
Instructors have additional capabilities:
- Create and manage exam questions
- Set exam durations and details
- View student performance analytics
- Manage subject materials
- Schedule exam time slots

HOW TO GET STARTED
------------------
1. Wait for your scheduled exam time
2. Login with your registration number and email
3. Begin your exam immediately
4. Complete all questions
5. Submit your answers
6. Check your email for results

IMPORTANT NOTES
---------------
Exam Access
- You can ONLY access the exam during your scheduled time slot
- Late arrivals may not be accommodated
- Early submission is allowed

 Email Notifications
- Registration confirmation
- Exam schedule and time slot
- Exam results
- System announcements

 Tips
- Ensure stable internet connection before starting
- Read all instructions carefully
- Save answers regularly
- Do not close browser during exam
- Contact support if technical issues arise

TECHNICAL REQUIREMENTS
----------------------
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Valid email address
- Registration number provided

SUPPORT
-------
For login issues: Contact your department administrator
For exam problems: Email examboard@university.edu
For result inquiries: Allow 48 hours before contacting support


Your Exam Board Dashboard - Simple, Secure, Reliable
Good luck with your exams!
