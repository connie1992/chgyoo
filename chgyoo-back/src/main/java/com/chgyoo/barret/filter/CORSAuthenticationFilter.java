package com.chgyoo.barret.filter;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * @author genchun.xiong01
 * Date: 2019/1/29
 * <p>
 * 前后端分离项目中，由于跨域，会导致复杂请求，即会发送preflighted request，
 * 这样会导致在GET／POST等请求之前会先发一个OPTIONS请求，
 * 但OPTIONS请求并不带shiro的'Authorization'字段（shiro的Session），
 * 即OPTIONS请求不能通过shiro验证，会返回未认证的信息。
 * <p>
 * 解决方法：给shiro增加一个过滤器，过滤OPTIONS请求
 */
@Slf4j
public class CORSAuthenticationFilter extends FormAuthenticationFilter {

    public CORSAuthenticationFilter() {
        super();
    }

    @Override
    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        //Always return true if the request's method is OPTIONS
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;
            if (httpRequest.getMethod().equals(RequestMethod.OPTIONS.name())) {
                setHeader(httpRequest, httpResponse);
                return true;
            }
        return super.isAccessAllowed(request, response, mappedValue);
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletResponse res = (HttpServletResponse) response;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setStatus(HttpServletResponse.SC_OK);
        res.setCharacterEncoding("UTF-8");
        PrintWriter writer = res.getWriter();
        Map<String, Object> map = new HashMap<>();
        map.put("code", 200);
        map.put("msg", "未登录");
        writer.write(JSON.toJSONString(map));
        writer.close();
        return false;
    }

    /**
     * 该方法会在验证失败后调用，这里由于是前后端分离，后台不控制页面跳转
     * 因此重写改成传输JSON数据
     */
//    @Override
//    protected void saveRequestAndRedirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
//        saveRequest(request);
//        setHeader((HttpServletRequest) request,(HttpServletResponse) response);
//        PrintWriter out = response.getWriter();
//        out.println(JSONObject.toJSONString(ResultUtil.error(ExceptionEnum.IS_NOT_LOGIN)));
//        out.flush();
//        out.close();
//    }


    /**
     * 为response设置header，实现跨域
     */
    private void setHeader(HttpServletRequest request,HttpServletResponse response){
        //跨域的header设置
        response.setHeader("Access-control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Methods", request.getMethod());
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"));
        //防止乱码，适用于传输JSON数据
        response.setHeader("Content-Type","application/json;charset=UTF-8");
        response.setStatus(HttpStatus.OK.value());
    }

}
