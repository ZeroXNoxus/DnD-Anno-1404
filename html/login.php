<?php
    $form_type = $_POST["form-type"];
    $dark_mode = $_COOKIE["darkmode"];
    if($form_type == 'login'){
        $user = $_POST["login"];
        $password = $_POST["password"];
        $connection = get_connection();
        if($connection){
            $hashed_password = hash('sha512', $password);
            $query = "SELECT `userId`, `username`, `hashed_pw`, `language` FROM user WHERE `hashed_pw` = '".$hashed_password."' AND `username` = '".$user."';";
            $result = $connection->prepare($query);
            $result->execute();
            $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
            
            foreach($return_arr as $x => $x_value) {
                foreach($x_value as $v => $v_value){
                    if($v == 'userId'){
                        $id = $v_value;
                    }
                    if($v == 'language'){
                        $lang = $v_value;
                    }
                }
            }
            $connection=null;
        }
        if(empty($return_arr)){
            echo get_login_form('danger','Username oder Passwort flasch! Bitte versuchen Sie es erneut oder kontaktieren Sie den System Administrator!');
        } else {
            //User existiert in der Datenbank, beginne Login
            echo website($id, $lang);
        }
    } else {
        //Anfrage Registrierung
        $user = $_POST["user"];
        $name = $_POST["name"];
        $password = $_POST["password_reg"];
        $re_password = $_POST["re_pass"];
        if($password == $re_password){
            $hashed_password = hash('sha512', $password);
            $connection = get_connection();
            $query = "SELECT `userId`, `username` FROM user WHERE `username` = '".$user."'";
            $result = $connection->prepare($query);
            $result->execute();
            $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
            if(empty($return_arr)){
                $query = "INSERT INTO `user` (`username`, `hashed_pw`, `full_name`) VALUES ('".$user."','".$hashed_password."','".$name."');";
                $result = $connection->prepare($query);
                $result->execute();
                $query = "SELECT * FROM `user` WHERE `username` = `".$user."`;";
                $result = $connection->prepare($query);
                $result->execute();
                $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
                foreach($return_arr as $x => $x_value) {
                    foreach($x_value as $v => $v_value){
                        if($v == 'userId'){
                            $id = $v_value;
                        }
                        if($v == 'language'){
                            $lang = $v_value;
                        }
                    }
                }
                echo get_login_form('success','Sie haben sich erfolgreich registriert! Sie können sich hier nun anmelden.');
            } else{
                //Username ist schon vergeben
                echo get_login_form('danger','Der angegebene Benutzername ist schon vergeben. Bitte versuchen Sie einen anderen Benutzernamen!');
            }
        } else{
            //Passwort ist ungleich
            echo get_login_form('danger','Die Passw&ouml;rter treffen nicht &uuml;berein. Bitte &uuml;berpr&uuml;fen Sie Ihre Eingabe!');
        }
        $connection = NULL;
    }

    function get_connection(){
        $servername = "localhost";
        $db = "dnd 5e anno 1404";
        try {
            $conn = new PDO('mysql:host='.$servername.';dbname='.$db.';charset=utf8mb4', 'DnD', 'TiamatIsALittleBitch');
        } catch(PDOException $e){
            return 'Connection failed: ' . $e->getMessage();
        }
        return $conn;
    }
    function get_login_form($state, $string){
        $form_state = 'fehlgeschlagen';
        if($state == 'success'){
            $form_state = 'erfolgreich';
        }
        if(!empty($_POST["login"])){
            $user = $_POST["login"];
        }else{
            $user = $_POST["user"];
        };
        if(!empty($_POST["password"])){
            $password = $_POST["password"];
        }else{
            $password = $_POST["password_reg"];
        };
        $form_type = $_POST["form-type"];
        $reg_hide = '';
        $log_hide = '';
        if($form_type == 'login') { $type = 'Anmeldung'; $reg_hide = 'hidden'; }
        if($form_type == 'register') { 
            if($state == 'success'){
                $type = 'Registrierung'; $reg_hide = 'hidden'; 
            } else {
                $type = 'Registrierung'; $log_hide = 'hidden'; 
            }
        }
        return $return = '
        <html>
            <head>
                <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Zilla+Slab"/>
                <link rel="stylesheet" href="css/bootstrap.min.css"/> <link rel="stylesheet" href="css/style.css"/>
                <script type="text/javascript" src="js/jQuery-3.4.1.min.js"></script>
                <script type="text/javascript" src="js/bootstrap.bundle.min.js"></script>
                <script type="text/javascript" src="js/darkmode.js"></script>
                <title>'.$type.' '.$form_state.'</title>
            </head>
        <body class="login '.$dark_mode.'">
            <div class="dialog">
            <div>
            <div class="alert alert-'.$state.'">'.$string.'</div>
            <form class="login-form '.$log_hide.'" action="login.php" method="post">
                <h4>Login</h4>
                <input id="form-type" name="form-type" type="hidden" value="login"/>
                <div class="form-group">
                    <label for="login">Benutzer</label>
                    <input id="login" class="form-control" name="login" value="'.$user.'" type="text" required/>
                </div>
                <div class="form-group">
                    <label for="password">Passwort</label>
                    <input id="password" class="form-control" name="password" type="password" value="'.$password.'" required/>
                </div>
                <div class="row">
                    <div class="col-4 col-md-6">
                        <button class="btn btn-success">Login</button>
                    </div>
                    <div class="col-8 col-md-6 ta-right">
                        <button class="btn btn-primary switch_form md-hide">Registrierung</button>
                        <button class="btn btn-primary switch_form md-show">Zur Registrierung</button>
                    </div>
                </div>
            </form>
            <form class="register-form '.$reg_hide.'" action="login.php" method="post">
                <h4>Registrierung</h4>
                <input id="form-type" name="form-type" type="hidden" value="register"/>
                <div class="form-group">
                    <label for="user">Benutzer</label>
                    <input id="user" class="form-control" name="user" value="'.$user.'" type="text" required/>
                </div>
                <div class="form-group">
                    <label for="name">Vor- und Nachname</label>
                    <input id="name" class="form-control" name="name" placeholder="Vor- und Nachname" value="'.$_POST["name"].'" type="text" required/>
                </div>
                <div class="form-group">
                    <label for="password_reg">Passwort</label>
                    <input id="password_reg" class="form-control" name="password_reg" type="password" title="Es muss mindestens ein Gro&szlig;- und Kleinbuchstabe angegeben werden. Au&szlig;erdem muss das Passwort mindestens 8 Zeichen lang sein" placeholder="Passwort" value="'.$password.'" minlength="8" pattern="(?=.*[a-z])(?=.*[A-Z]).{8,}" required/>
                    <input id="re_pass" class="form-control" name="re_pass" type="password" title="Es muss mindestens ein Gro&szlig;- und Kleinbuchstabe angegeben werden. Au&szlig;erdem muss das Passwort mindestens 8 Zeichen lang sein" placeholder="Passwort wiederholen" minlength="8" pattern="(?=.*[a-z])(?=.*[A-Z]).{8,}" required/>
                </div>
                <div class="row">
                    <div class="col-6">
                        <button class="btn btn-success md-show">Benutzer registrieren</button>
                        <button class="btn btn-success md-hide">Registrieren</button>
                    </div>
                        <div class="col-6 ta-right">
                            <button class="btn btn-primary switch_form md-show">Zur&uuml;ck zum Login</button>
                            <button class="btn btn-primary switch_form md-hide">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </body>
        <script>$(".switch_form").off("click"); $(".switch_form").on("click", function(e){e.stopPropagation(); e.preventDefault(); $("form").toggleClass("hidden");}); </script> </html>';
    }

    function website($id, $lang){
        return 
        '<html>
            <head> 
                <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"> 
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Zilla+Slab"> 
                <link rel="stylesheet" href="css/font.css"> 
                <link rel="stylesheet" href="css/bootstrap.min.css"> 
                <link rel="stylesheet" href="css/dataTables.bootstrap4.min.css"> 
                <link rel="stylesheet" href="css/style.css"> 
                <link rel="stylesheet" href="css/loader.css">
                <script src="https://kit.fontawesome.com/7acfe39345.js" crossorigin="anonymous"></script> 
                <script type="text/javascript" src="js/jQuery-3.4.1.min.js"></script> 
                <script type="text/javascript" src="js/bootstrap.bundle.min.js"></script> 
                <script type="text/javascript" src="js/jquery.dataTables.min.js"></script> 
                <script type="text/javascript" src="js/dataTables.bootstrap4.min.js"></script>
                <script type="text/javascript" src="js/loader.js"></script>
                <script type="text/javascript" src="js/response.js"></script>
                <script type="text/javascript" src="js/script.js"></script>
                <title>DnD 5e City Control</title> 
            </head> 
            <body class="'.$dark_mode.'">
                <div class="hidden"><span class="userId">'.$id.'</span><span class="language">'.$lang.'</span></div>
                <div class="content-container container-fluid"> 
                    <div class="row"> 
                        <div class="col-12"> 
                            <div class="row justify-content-end h-100"> 
                                <div id="navbar" class="col-4 col-md-12 no-select no-break bold show"> 
                                    <div class="row mobile d-flex d-md-none"> 
                                        <div class="col-12 img-container"></div>
                                        <div class="col-12 dropright">
                                            <div class="row">
                                                <div class="col-10 label" id="character" data-where="userId,`'.$id.'`">Charakter</div>
                                                <button type="button" class="col-2 btn label btn-label btn-secondary dropdown-toggle dropdown-toggle-split" id="mobile_characterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="sr-only">Toggle Dropdown</span></button>
                                                <div class="dropdown-menu" aria-labelledby="mobile_characterDropdown">
                                                    <div class="dropdown-item label" id="character.resource" data-where="userId,`'.$id.'`">Charakter-Inventar</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 dropright">
                                            <div class="row">
                                                <button type="button" class="col-10 btn label" id="resource">Ressourcen</button>
                                                <button type="button" class="col-2 btn label btn-label btn-secondary dropdown-toggle dropdown-toggle-split" id="mobile_resourceDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="sr-only">Toggle Dropdown</span></button>
                                                <div class="dropdown-menu" aria-labelledby="mobile_resourceDropdown">
                                                    <div class="dropdown-item label" id="count.resource">Ressourcen gesamt</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 label" id="company">Unternehmen</div>
                                        <div class="col-12 label" id="city">Stadt</div>
                                        <div class="col-12 label" id="storage">Lager</div>
                                        <div class="col-12 label mt-auto" id="user" data-where="userId,`'.$id.'`"><i class="fas fa-user"></i> Profil</div>
                                        <div class="col-12 mt-auto link"><a data-ajax="false" href="index.html?aktion=logout">Logout <i class="fas fa-sign-out-alt"></i></a></div>
                                    </div>
                                    <div class="row desktop d-none d-md-flex"> 
                                        <div class="col-12"> 
                                            <div class="row"> 
                                                <div class="col-2 col-lg-1 img-container"></div>
                                                <div class="col-2 col-lg-1">
                                                    <div class="row">
                                                        <button type="button" class="col-10 btn label" id="character" data-where="userId,`'.$id.'`">Charakter</button>
                                                        <button type="button" class="col-2 btn label btn-label btn-secondary dropdown-toggle dropdown-toggle-split" id="characterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="sr-only">Toggle Dropdown</span></button>
                                                        <div class="dropdown-menu" aria-labelledby="characterDropdown">
                                                            <div class="dropdown-item label" id="character.resource" data-where="userId,`'.$id.'`">Charakter-Inventar</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-2 col-lg-1">
                                                    <div class="row">
                                                        <button type="button" class="col-10 btn label" id="resource">Ressourcen</button>
                                                        <button type="button" class="col-2 btn label btn-label btn-secondary dropdown-toggle dropdown-toggle-split" id="resourceDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="sr-only">Toggle Dropdown</span></button>
                                                        <div class="dropdown-menu" aria-labelledby="resourceDropdown">
                                                            <div class="dropdown-item label" id="count.resource">Ressourcen gesamt</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-2 col-lg-1 label" id="company">Unternehmen</div>
                                                <div class="col-2 col-lg-1 label" id="city">Stadt</div>
                                                <div class="col-2 col-lg-1 label" id="storage">Lager</div>
                                                <div class="col-2 col-lg-1 label" id="c">c</div>
                                                <div class="col-2 col-lg-1 label" id="d">d</div>
                                                <div class="col-2 col-lg-1 label" id="e">e</div>
                                                <div class="col-2 col-lg-1 label" id="f">f</div>
                                                <div class="col-2 col-lg-1 ml-auto">
                                                    <div class="row">
                                                        <button type="button" class="col-10 btn label" id="user" data-where="userId,`'.$id.'`"><i class="fas fa-user"></i> Profil</button>
                                                        <button type="button" class="col-2 btn label btn-label btn-secondary dropdown-toggle dropdown-toggle-split" id="userDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="sr-only">Toggle Dropdown</span></button>
                                                        <div class="dropdown-menu" aria-labelledby="userDropdown">
                                                            <div class="dropdown-item"><a data-ajax="false" href="index.html?aktion=logout">Logout <i class="fas fa-sign-out-alt"></i></a></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-2 col-lg-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-md-none nav-close-btn">
                                    <div class="btn btn-danger"><i class="fas fa-times-circle fa-2x"></i></div>
                                </div>
                                <div class="col-8 col-md-12 toolbar">
                                    <button class="btn btn-danger delete-btn disabled"><i class="fas fa-trash"></i></button>
                                    <button class="btn btn-primary mass-edit-btn"><i class="icon-list-pen"></i></button> 
                                    <button class="btn btn-primary edit-btn disabled"><i class="fas fa-pen"></i></button> 
                                    <button type="button" class="btn btn-primary insert-btn"><i class="fas fa-plus"></i></button> 
                                </div>
                                <div class="col-8 col-md-12 response-area"> 
                                    <div id="response-container" class="resp-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="popup-insert" class="popup">
                    <div class="popup-insert container-fluid"></div>
                </div>
                <div id="popup-update" class="popup">
                    <div class="popup-update container-fluid"></div>
                </div>
                <div id="popup-map" class="popup">
                    <div class="popup-map container-fluid"></div>
                </div>
                <div class="dialog load-dialog" style="display: none;">
                    <section class="cube-container">
                        <div id="cube" class="show-20">
                        <figure class="face01">1</figure>
                        <figure class="face02">2</figure>
                        <figure class="face03">3</figure>
                        <figure class="face04">4</figure>
                        <figure class="face05">5</figure>
                        <figure class="face06">6</figure>
                        <figure class="face07">7</figure>
                        <figure class="face08">8</figure>
                        <figure class="face09">9</figure>
                        <figure class="face10">10</figure>
                        <figure class="face11">11</figure>
                        <figure class="face12">12</figure>
                        <figure class="face13">13</figure>
                        <figure class="face14">14</figure>
                        <figure class="face15">15</figure>
                        <figure class="face16">16</figure>
                        <figure class="face17">17</figure>
                        <figure class="face18">18</figure>
                        <figure class="face19">19</figure>
                        <figure class="face20">20</figure>
                        </div>
                    </section>
                </div>
            </body> 
        </html>';
    }
   ?>