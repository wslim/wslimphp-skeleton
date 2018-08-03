<?php
namespace App\Demo\Demo2\Controller\A;

/**
 * 如果不继承Controller，需要将方法定义为 public
 * 
 * @author 28136957@qq.com
 * @link   wslim.cn
 */
class B
{
    public function index()
    {
        echo __METHOD__;
    }
    
    public function c()
    {
        echo __METHOD__;
    }
}