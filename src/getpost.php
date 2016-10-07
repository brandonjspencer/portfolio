<?php
header('Content-Type: text/xml');
$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
);
echo file_get_contents('https://medium.com/feed/@brandonjspencer', false, stream_context_create($arrContextOptions));