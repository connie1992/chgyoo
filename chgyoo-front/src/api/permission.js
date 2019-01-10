import {getRequest, postRequest} from './config';

//----------菜单管理--------------
const menuUrl = 'permission/menu/';
export const getMenuData = (params) => {
  return getRequest(`${menuUrl}getMenuData`, params);
};

export const saveMenu = (params) => {
  return postRequest(`${menuUrl}addOrUpdateMenu`, params);
};

export const menuUpDown = (params) => {
  return postRequest(`${menuUrl}menuUpDown`, params);
};

//--------------按钮-------------
export const getBtns = (id) => {
  return getRequest(`${menuUrl}getBtnData?menuId=${id}`);
};

export const saveBtn = (params) => {
  return postRequest(`${menuUrl}addOrUpdateBtn`, params);
};


// -----------角色--------------
const roleUrl = 'permission/role/';
export const getRoles = (params) => {
  return postRequest(`${roleUrl}getTableData`, params);
};

export const saveRole = (params) => {
  return postRequest(`${roleUrl}addOrUpdate`, params);
};

export const getRoleMenu =  (roleId) => {
  return getRequest(`${roleUrl}getMenuData?roleId=${roleId}`);
};

export const saveRoleMenu =  (params) => {
  return postRequest(`${roleUrl}saveMenu`, params);
};

export const getRoleMenuBtn = (roleId, menuId) => {
  return getRequest(`${roleUrl}getRoleBtn?roleId=${roleId}&menuId=${menuId}`);
};

export const saveRoleMenuBtn = (params) => {
  return postRequest(`${roleUrl}saveBtn`, params);
};



// -----------角色授权--------------
const userUrl = 'permission/user/';
export const getOrg = () => {
  return getRequest(`${userUrl}getDept`);
};

export const getGroupUser = (groupId, isCustom) => {
  return getRequest(`${userUrl}getGroupUser?groupId=${groupId}&custom=${isCustom}`);
};

export const getGroupUserPage = (params) => {
  return postRequest(`${userUrl}getGroupUserPage`, params);
};


export const getDeptByUser = (name) => {
  return getRequest(`${userUrl}getDeptByUser?name=${name}`);
};

export const getSelectRole = (id, type) => {
  return getRequest(`${userUrl}getSelectRole?id=${id}&type=${type}`);
};

export const saveSelectRole = (params) => {
  return postRequest(`${userUrl}saveSelectRole`, params);
};

export const getUserInfo = (userName) => {
  return getRequest(`${userUrl}getUserInfo?account=${userName}`);
};

export const getUserMenu = (userName) => {
  return getRequest(`${userUrl}getUserPermission?id=${userName}`);
};

// ----------自定义组--------------
export const getGroupTableData = (params) => {
  return postRequest(`${userUrl}getGroupTableData`, params);
};

export const saveGroup = (params) => {
  return postRequest(`${userUrl}addOrUpdateGroup`, params);
};

export const getUserTreeData = (key) => {
  return getRequest(`${userUrl}getUserTreeData?key=${key}&user=true`);
};

export const saveGroupUser = (params) => {
  return postRequest(`${userUrl}saveGroupUser`, params);
};

export const getRoleUser = (params) => {
  return postRequest(`${userUrl}getRoleUser`, params);
};
// ----------自定义用户--------------
export const getCusUser = (params) => {
  return postRequest(`${userUrl}getCusUser`, params);
};

export const addOrUpdateCusUser = (params) => {
  console.log(params);
  return postRequest(`${userUrl}addOrUpdateCusUser`, params);
};



