<?php
$user = $_POST["login"];
$password = $_POST["pass"];
$encrypted_password = password_hash($password, PASSWORD_DEFAULT);

if (isset($user) 
    and isset($password)
    and $user == 'root'
    and $password == 'secret')
{
    $_SESSION['loggedIn'] = date("H:i:s");
}

if ( isset($_SESSION['loggedIn']) )
   {
      // eingeloggt, daher Möglichkeit zum Ausloggen geben
      //<p><a data-ajax="false" href="index.html?aktion=ausloggen">ausloggen</a></p>
      echo 
      '<html>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Zilla+Slab">
                <link rel="stylesheet" href="css/bootstrap.min.css">
                <link rel="stylesheet" href="css/dataTables.bootstrap4.min.css">
                <link rel="stylesheet" href="css/style.css">
                <script type="text/javascript" src="js/jQuery-3.4.1.min.js"></script>
                <script type="text/javascript" src="js/bootstrap.bundle.min.js"></script>
                <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
                <script type="text/javascript" src="js/dataTables.bootstrap4.min.js"></script>
                <script type="text/javascript" src="js/script.js"></script>
                <title>DnD 5e City Control</title>
            </head>
            <body>
                <div class="content-container container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="row justify-content-end h-100">
                                <div id="navbar" class="col-4 col-md-12 no-select no-break bold show">
                                    <div class="row mobile d-flex d-md-none">
                                        <div class="col-12 label" id="Spieler" data-where="" data-row="" data-value="">City</div>
                                        <div class="col-12 label" id="people">people</div>
                                        <div class="col-12 label" id="companies">companies</div>
                                        <div class="col-12 label" id="resources">resources</div>
                                        <div class="col-12 mt-auto link"><a data-ajax="false" href="index.html?aktion=logout">logout</a></div> 
                                    </div>
                                    <div class="row desktop d-none d-md-flex">
                                        <div class="col-2 col-lg-1 label" id="Spieler" data-where="" data-row="" data-value="">City</div>
                                        <div class="col-2 col-lg-1 label" id="people">people</div>
                                        <div class="col-2 col-lg-1 label" id="companies">companies</div>
                                        <div class="col-2 col-lg-1 label" id="resources">resources</div>
                                        <div class="col-2 col-lg-1 ml-auto"><a data-ajax="false" href="index.html?aktion=logout">logout</a></div> 
                                    </div>
                                    
                                </div>
                                <div class="col-8 col-md-12">Current script owner:  '. get_current_user() .'</div>
                                <div class="col-8 col-md-12 response-area">
                                    <div id="response-container" class="resp-container">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>';
   }
   else
   {
    echo 
    '<html>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Zilla+Slab">
                <link rel="stylesheet" href="css/bootstrap.min.css">
                <link rel="stylesheet" href="css/style.css">
                <script type="text/javascript" src="js/jQuery-3.4.1.min.js"></script>
                <script type="text/javascript" src="js/bootstrap.bundle.min.js"></script>
                <script type="text/javascript" src="js/script.js"></script>
                <title>Anmeldung erforderlich</title>
            </head>

            <body>
                <div class="dialog">
                    <div>
                        <div class="alert alert-danger">Benutzername und/oder Passwort falsch. Bitte versuchen Sie es erneut.</div>
                        <form class="login-form" action="login.php" method="post">
                            <div class="form-group">
                                <label for="login">Benutzer</label>
                                <input id="login" class="form-control" name="login" placeholder="Benutzername">
                            </div>
                            <div class="form-group">
                                <label for="pass">Passwort</label>
                                <input id="pass" class="form-control" name="pass" type="password" placeholder="Passwort">
                            </div>
                            <button>Login</button>
                        </form>
                    </div>
                </div>
            </body>
        </html>';
   }