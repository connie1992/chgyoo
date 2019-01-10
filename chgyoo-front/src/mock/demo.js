import Mock from 'mockjs';
import util from '../libs/util';
import qs from 'qs';

export const getTableData = req => {
  console.log('i am in demo data mock');
  let params = qs.parse(req.body);
  console.log(params);
  let result = {};
  let tableData = [];
  util.doCustomTimes(params.pageSize, () => {
    tableData.push(Mock.mock({
      id: '@string("lower", 32)',
      name: '@cname',
      school: '北京理工大学',
      address: '@province' + '@city',
      jobDate: '@date'
    }));
  });
  result.dataList = tableData;
  result.totalSize = 1992;
  return {
    code: 200,
    data: result,
    msg: '查询成功'
  };
};


export const del = req => {
  return {
    code: 200,
    msg: '删除成功！'
  };
};


export const save = req => {
  return {
    msg: '保存成功！',
    code: 200
  };
};
