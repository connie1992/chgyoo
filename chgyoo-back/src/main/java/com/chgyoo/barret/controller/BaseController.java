package com.chgyoo.barret.controller;

import com.alibaba.fastjson.JSON;
import com.chgyoo.barret.entity.User;
import com.chgyoo.barret.system.shiro.MySessionManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.subject.support.DefaultSubjectContext;
import org.apache.shiro.web.util.WebUtils;
import org.crazycake.shiro.RedisSessionDAO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.ServletRequest;

/**
 * @author genchun.xiong01
 * Date: 2019/1/9
 */
public class BaseController {

    @Autowired
    private RedisSessionDAO redisSessionDAO;

    public User getUserByHeader(ServletRequest request) throws Exception{
        //前端ajax的headers中必须传入Authorization的值
        String id = WebUtils.toHttp(request).getHeader(MySessionManager.AUTHORIZATION);
        Session session = redisSessionDAO.readSession(id);
        Object obj = session.getAttribute(DefaultSubjectContext.PRINCIPALS_SESSION_KEY);
        SimplePrincipalCollection coll = (SimplePrincipalCollection) obj;
        String userStr = JSON.toJSON(coll.getPrimaryPrincipal()).toString();
        User user = JSON.parseObject(userStr, User.class);
        return user;
    }

}
