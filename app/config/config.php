<?php
return [
    // app
    'app'       => [
        'modules'	=> [
            'demo/demo2',
        ],
    ],
    // view
    'view'      => [
        'theme' => 'default',
    ],
    'router'    => [
        'module_level'  => 2,   // module_level, 1|2, 模块的深度，如果只支持一级设为1可提高解析性能
        'log'   => [
            'level' => 'debug'
        ]
    ],
];