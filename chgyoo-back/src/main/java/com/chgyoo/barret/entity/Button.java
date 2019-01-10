package com.chgyoo.barret.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class Button implements Serializable {
  private static final long serialVersionUID = 1L;
  private String id;
  private String code;
  private String name;
}
