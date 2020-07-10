<?php
/* $where = explode(",", $_GET["where"]); */
$sql = "SELECT playerId, copper, silver, gold FROM ".$_GET["table"];
fetch_result($sql);

function fetch_result($query) {
    $servername = "localhost";
    $username = "root";
    $password = "secret";
    $db = "dnd 5e anno 1404";
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $db);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $json = fill_array($query, $conn);
    echo $json;
}

function fill_array($query, $conn){
    $return_arr = array();

    // Fetch result of SQL query
    $result = $conn->query($query);

    // Fill array with table data
    while(($row =  mysqli_fetch_assoc($result))){
        array_push($return_arr,$row);
    }

    // Encode array to JSON and respond
    return json_encode($return_arr);
}
?>