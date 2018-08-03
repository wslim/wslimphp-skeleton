<?php
// sys init
require "init.php";

// config use dev env
\Wslim\Common\Config::env('dev');

// app config
$config = [
    'basePath'  => ROOT_PATH . 'app',
];

// \Wslim\Web\App::launch($config);
$app = new \Wslim\Web\App($config);

//$app->setDefaultModule('demo');

$app->run();

