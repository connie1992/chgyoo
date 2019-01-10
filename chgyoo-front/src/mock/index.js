import Mock from 'mockjs';
import {getJessionid} from './data';
import {getParamsData, addOrUpdate, deleteParams, getAuthData, getDictionary} from './sys';
import {getTableData, del, save} from '@/mock/demo';


// 生成token
Mock.mock(/\/getJessionid/, getJessionid);
// demo
Mock.mock(/\/demo\/getTableData/, getTableData);
Mock.mock(/\/demo\/save/, save);
Mock.mock(/\/demo\/delete/, del);
// ----------系统参数设置--------------
Mock.mock(/\/sysConfig\/pageQuery/, getParamsData);
Mock.mock(/\/sysConfig\/addOrUpdate/, addOrUpdate);
Mock.mock(/\/sysConfig\/delete/, deleteParams);
// ----------数据权限设置--------------
Mock.mock(/\/authData\/pageQuery/, getAuthData);
Mock.mock(/\/getDictionary/, getDictionary);


export default Mock;
