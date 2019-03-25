package com.chgyoo.barret.jdkProxy;

/**
 * @author genchun.xiong01
 * Date: 2019/3/11
 */
public class SubjectImpl implements Subject {
    @Override
    public void hello() {
        System.out.println("hello world");
    }
}
