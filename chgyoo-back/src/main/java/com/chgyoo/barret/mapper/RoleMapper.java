package com.chgyoo.barret.mapper;

import com.chgyoo.barret.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author genchun.xiong01
 * Date: 2019/1/14
 */
@Mapper
public interface RoleMapper {

    List<Role> selectAllRole();

    Role selectByRoleId(@Param("roleId") String roleId);
}
