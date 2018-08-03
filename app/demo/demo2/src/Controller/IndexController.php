<?php
namespace App\Demo\Demo2\Controller;

class IndexController extends Controller
{
    
    protected function init()
    {
        parent::init();
    }
    
	protected function doGet()
	{
	    echo 'flexible module: ' . __METHOD__;
	}
	
	protected function a()
	{
	    echo __METHOD__;
	}
}