package com.chgyoo.barret.system.shiro;

import com.alibaba.fastjson.JSON;
import com.chgyoo.barret.entity.User;
import com.chgyoo.barret.mapper.UserMapper;
import com.chgyoo.barret.model.Command;
import com.chgyoo.barret.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;

/**
 * @author genchun.xiong01
 * Date: 2019/1/9
 */
@Slf4j
public class MyShiroRealm extends AuthorizingRealm {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserService userService;

    /**
     * 主要是用来进行身份认证的，即验证用户输入的账号和密码是否正确
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        log.info("身份认证，用户信息，token={}", JSON.toJSONString(token));
        String username = (String) token.getPrincipal();
        // 通过username从数据库中查找
        User user = userMapper.getUserByAccount(username);
        if (user == null) {
            return null;
        }
        if (user.getStatus() == User.Status.DISABLED.getCode()) {
            throw new LockedAccountException();
        }
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user,
                user.getPassword(), getName()
        );

        return authenticationInfo;

    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        log.info("权限认证，从登录凭证中获取用户信息，principals={}", JSON.toJSONString(principals));
        Command command = (Command) principals.getPrimaryPrincipal();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        // 查询角色信息
//        Collection<String> roles = userService.getSelectRole(command);
//        log.info("查询用户角色信息并添加到shiro权限验证器中，一个用户可以对应多个角色");
//        info.addRoles(roles);
        // 查询权限信息
//        Collection<String> permissions = userService.getUserPermission(command);
//        log.info("把用户权限信息添加到shiro权限过滤器中");
//        info.addStringPermissions(permissions);
        return info;
    }

}
