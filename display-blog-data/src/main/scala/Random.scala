package com.sustenage.menta.fontend.exercise.display.blog.data;

import scala.scalajs.js

class Random(seed: Int = 88675123):
  private var x = 123456789
  private var y = 362436069
  private var z = 521288629
  private var w = seed
  private val max = 1000000;

  def next: Double = {

    val t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    (js.Math.abs(this.w) % (max + 1)) / max.toDouble
  }

object Random:
  val global = new Random()
  def next = global.next
