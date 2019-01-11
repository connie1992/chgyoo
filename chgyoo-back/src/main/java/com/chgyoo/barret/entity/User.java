package com.chgyoo.barret.entity;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

@Data
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String code;
    private String id;
    private String account;
    private String name;
    private String password;
    private String post;
    // 公司
    private String book;
    private String bookName;
    private Department department;
    private String custom;
    private int status;
    private Date interfaceTime;

    public enum Status {

        ACTIVED(1, "已激活"),
        DISABLED(0, "已冻结");

        private int code;
        private String desc;

        public int getCode() {
            return code;
        }

        public String getDesc() {
            return desc;
        }

        Status(int code, String desc) {
            this.code = code;
            this.desc = desc;
        }
    }
}
