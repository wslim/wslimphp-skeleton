<?php
/*******************************************************
 * section: system init
 ******************************************************/
// error setting
error_reporting(E_ALL);
//error_reporting(E_ALL & ~E_NOTICE);

// timezone setting
//echo ini_get('date.timezone');exit;
//date_default_timezone_set('Asia/Shanghai');
//date_default_timezone_set('PRC');
//ini_set('date.timezone','Asia/Shanghai');
ini_set('date.timezone','PRC');

// post_data 生产环境直接设置php.ini，否则每次都会占用时间
//ini_set('always_populate_raw_post_data', -1);

// xdebug 开始trace，如要生成 profiler 报告，访问页面时使用 ?XDEBUG_PROFILE= 参数
//xdebug_start_trace();

/**
 * must set ROOT_PATH
 */
define('ROOT_PATH', realpath(__DIR__) . '/');

/**
 * composer loader, set into Ioc and can be used in code: Ioc::loader()
 */
$loader = require ROOT_PATH . 'vendor/autoload.php';
\Wslim\Ioc::setLoader($loader);
//print_r($loader);exit;


