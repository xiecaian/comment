<?php
namespace Home\Controller;
use Think\Controller;

header("Access-Control-Allow-Origin: *");

class LfcoursesController extends Controller {
  public function getCourses(){
    $page = I('post.page');

    $course = D('Lfcourses');
    
    $this -> ajaxReturn($course -> getCourses($page));
  }
}