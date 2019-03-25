package com.chgyoo.barret.jdkProxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * @author genchun.xiong01
 * Date: 2019/3/11
 */
public class MyInvocationHandler implements InvocationHandler {

    private Object object;

    public Object setProxy(Object o) {
        this.object = o;
        return Proxy.newProxyInstance(o.getClass().getClassLoader(), o.getClass().getInterfaces(), this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        System.out.println("begin jdkProxy");

        Object object = method.invoke(this.object, args);

        System.out.println("end jdkProxy");

        return object;
    }

}
