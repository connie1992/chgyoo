package com.chgyoo.barret.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.chgyoo.barret.model.TreeNode;


@Data
public class Menu extends TreeNode implements Serializable {
  private static final long serialVersionUID = 1L;

  // 名称
  private String name;
  // 页面路径
  private String pagePath;
  // 路由地址
  private String routeUrl;
  // 图标
  private String icon;
  // 排序
  private int menuOrder;
  // 创建时间
  private Date createTime;
  // 创建时间
  private Date updateTime;
  // 角色菜单按钮ID
  List<String> permission;
  // 带参数的路径处理过后的结果
  private String url;
  // router path
  private String routePath;
  private boolean param;
  // 菜单路径
  private String menuPath;
  // 路由完整地址
  private String routeFullPath;
}