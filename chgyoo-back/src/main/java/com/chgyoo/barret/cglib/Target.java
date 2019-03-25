package com.chgyoo.barret.cglib;

/**
 * @author genchun.xiong01
 * Date: 2019/3/11
 */
public class Target {

    public void eat() {
        System.out.println("I am eating");
    }

    public String hello(String name) {
        System.out.println("hello");
        return "hello " + name;
    }
}
