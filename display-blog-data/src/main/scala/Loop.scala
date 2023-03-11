package com.sustenage.menta.fontend.exercise.display.blog.data;

def loop[A](init: A)(f: A => Option[A]): A =
  var a = init
  var flag = true
  while flag do
    f(a) match
      case None => flag = false
      case Some(n) =>
        a = n
        flag = true
  a
