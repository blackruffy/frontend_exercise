package com.sustenage.menta.fontend.exercise.display.blog.data;

extension [A](self: A) def |>[B](f: A => B): B = f(self)
