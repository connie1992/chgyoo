package com.chgyoo.barret.model;

import lombok.Data;

/**
 * @author genchun.xiong01
 * Date: 2019/1/9
 */
@Data
public class RespEntity<T> {

    private static int SUCCESS = 200;
    private static int FAILED = 500;

    private Integer httpCode;
    private T data;
    private String message;

    public static <T> RespEntity<T> buildSuccessWithDataAndMsg(T data, String msg) {
        RespEntity<T> respEntity = new RespEntity<>();
        respEntity.setData(data);
        respEntity.setHttpCode(SUCCESS);
        respEntity.setMessage(msg);
        return respEntity;
    }

    public static <T> RespEntity<T> buildFailedWithDataAndMsg(T data, String msg) {
        RespEntity<T> respEntity = new RespEntity<>();
        respEntity.setHttpCode(FAILED);
        respEntity.setData(data);
        respEntity.setMessage(msg);
        return respEntity;
    }
}
