package com.chgyoo.barret.service.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.chgyoo.barret.entity.Button;
import com.chgyoo.barret.entity.Menu;
import com.chgyoo.barret.mapper.MenuMapper;
import com.chgyoo.barret.model.TreeNode;
import com.chgyoo.barret.service.MenuService;
import com.chgyoo.barret.util.TreeUtil;
import com.chgyoo.barret.util.Utils;

@Service
public class MenuServiceImpl implements MenuService {

  @Resource
  MenuMapper menuMapper;

  private void setLast (List<?> menuList) {
    for (int j = 0; j < menuList.size(); j++) {
      TreeNode menu = (Menu) menuList.get(j);
      if (j == menuList.size() - 1) {
        menu.setLast(true);
      }
      if (menu.getChildren().size() > 0) {
        setLast(menu.getChildren());
      }
    }
  }


  @Override
  public List<TreeNode> getMenuData() {
    List<Menu> data = menuMapper.getMenuData();
    // 处理路径参数
    for (Menu menu : data) {
      String[] pathArr = menu.getRouteUrl().split("/");
      if (menu.getRouteUrl().indexOf(':') >= 0) {
        int paramIndex = menu.getRouteUrl().lastIndexOf('/');
        String[] paramArr = pathArr[pathArr.length - 1].split("&");
        String url = menu.getRouteUrl().substring(0, paramIndex);
        String paramPath = pathArr[pathArr.length - 2];
        for (int i = 0; i < paramArr.length; i++) {
          int index = paramArr[i].indexOf('=');
          paramPath = paramPath + "/" + paramArr[i].substring(0, index);
          url = url + "/" + paramArr[i].substring(index + 1);
        }
        menu.setRoutePath(paramPath);
        menu.setUrl(url);
        menu.setParam(true);
        menu.setRouteFullPath(menu.getRouteUrl().substring(0, paramIndex));
      } else {
        menu.setParam(false);
        menu.setUrl(menu.getRouteUrl());
        menu.setRoutePath(pathArr[pathArr.length - 1]);
        menu.setRouteFullPath(menu.getRouteUrl());
      }
    }
    List<TreeNode> re = TreeUtil.convertTreeData(data);
    setLast(re);
    return re;
  }

  @Override
  @Transactional
  public void addOrupdate(Menu menu, String oldPid) {
    boolean pidChange = !menu.getParentId().equals(oldPid);
    if (!StringUtils.isEmpty(menu.getId()) && pidChange) {
      // 如果是更新操作，而且修改了父菜单，则需要修改原来的父节点下的子节点顺序，将排在它后面的全部往前挪一位
      menuMapper.updateOrderByPid(oldPid, menu.getMenuOrder());
    }
    // 设置排序
    if (StringUtils.isEmpty(menu.getId()) || pidChange) {
      // 新增菜单，自动增长
      Integer order = menuMapper.getOrder(menu.getParentId());
      menu.setMenuOrder(order != null ? order + 1 : 1);
    }
    // 判断是否是传参的路由
    if (!"root".equals(menu.getParentId())) {
      if (menu.getRouteUrl().indexOf(':') > 0) {
        if (StringUtils.isEmpty(menu.getId()) || pidChange) {
          Menu parentMenu = menuMapper.getMenuById(menu.getParentId());
          menu.setMenuPath(parentMenu.getMenuPath());
        }
      } else {
        menu.setMenuPath(menu.getRouteUrl());
      }
    } else {
      String[] pathArr = menu.getRouteUrl().split("/");
      if (pathArr.length == 3 && menu.getRouteUrl().indexOf(":") > 0) {
        menu.setMenuPath("/");
      } else {
        menu.setMenuPath(menu.getRouteUrl());
      }
    }
    if (StringUtils.isEmpty(menu.getId())) {
      menu.setId(Utils.createUUID());
      menu.setCreateTime(new Date());
      menuMapper.insertMenu(menu);
    } else {
      menu.setUpdateTime(new Date());
      menuMapper.updateMenu(menu);
    }
  }

  @Override
  @Transactional
  public void menuUpDown(Menu menu, boolean isUp) {
    if (isUp) {
      Menu exchangeMenu = menuMapper.getMenuByPid(menu.getParentId(), menu.getMenuOrder() - 1);
      menuMapper.updateOrderDesc(menu.getId());
      menuMapper.updateOrderInc(exchangeMenu.getId());
    } else {
      Menu exchangeMenu = menuMapper.getMenuByPid(menu.getParentId(), menu.getMenuOrder() + 1);
      menuMapper.updateOrderDesc(exchangeMenu.getId());
      menuMapper.updateOrderInc(menu.getId());
    }
  }

  @Override
  public void delete(String id, boolean isMenu) {
    if (isMenu) {
      List<TreeNode> menuList = this.getMenuData();
      List<String> childrenIds = TreeUtil.getChildrenIds(menuList, id);
      childrenIds.add(id);
      menuMapper.deleteMenu(childrenIds);
    } else {
      menuMapper.deleteBtn(id);
    }
  }

  @Override
  public List<Button> getBtns(String menuId) {
    return menuMapper.getBtns(menuId);
  }

  @Override
  @Transactional
  public void addOrupdateBtn(Button btn, String menuId) {
    if (StringUtils.isEmpty(btn.getId())) {
      btn.setId(Utils.createUUID());
      menuMapper.insertBtn(btn);
      menuMapper.insertMenuBtn(Utils.createUUID(), menuId, btn.getId());
    } else {
      menuMapper.updateBtn(btn);
    }
  }
}
