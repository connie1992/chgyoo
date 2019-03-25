package com.chgyoo.barret.jdkProxy;

/**
 * @author genchun.xiong01
 * Date: 2019/3/11
 */
public class Client {

    public static void main(String[] args) {
        MyInvocationHandler myInvocationHandler = new MyInvocationHandler();

        Subject subject = (Subject) myInvocationHandler.setProxy(new SubjectImpl());

        subject.hello();
    }
}
