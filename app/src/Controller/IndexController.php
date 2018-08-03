<?php
namespace App\Controller;

class IndexController extends Controller
{
    protected function init()
    {
        parent::init();
    }
    
	protected function doGet()
	{
	    //print_r(\Wslim\Ioc::loader());
	    
	    static::getView()->setLayout('layout');
	    
	    static::render();
	}
	
	protected function a()
	{
	    echo __METHOD__;
	}
}