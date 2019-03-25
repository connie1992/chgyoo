package com.chgyoo.barret.cglib;

import org.springframework.cglib.proxy.Enhancer;

/**
 * @author genchun.xiong01
 * Date: 2019/3/11
 */
public class Client {

    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setCallback(new Interceptor());
        enhancer.setSuperclass(Target.class);

        Target target = (Target) enhancer.create();
        target.eat();
        target.hello("world");

    }
}
