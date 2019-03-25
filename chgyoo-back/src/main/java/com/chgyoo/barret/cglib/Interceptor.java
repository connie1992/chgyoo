package com.chgyoo.barret.cglib;

import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
 * @author genchun.xiong01
 * Date: 2019/3/11
 */
public class Interceptor implements MethodInterceptor {
    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {

        System.out.println("begin cglib proxy");

        Object object = methodProxy.invokeSuper(o, objects);

        System.out.println("end cglib proxy");

        return object;
    }
}
