import Mock from 'mockjs';
import util from '../libs/util';

export const getJessionid = req => {
  return {
    code: 200,
    msg: '',
    data: 'jidsasjdsfjasdfkopjidasfj'
  };
};
export const getPoData = req => {
  console.log('i am in demo data mock');
  let params = JSON.parse(req.body);
  console.log(params);
  let result = {};
  let tableData = [];
  util.doCustomTimes(params.pageSize, () => {
    tableData.push(Mock.mock({
      id: '@string("lower", 32)',
      poNo: '@string("lower", 8)',
      companyCode: '@string("lower", 5)',
      supplierCode: '@string("upper", 8)',
      purchaseCode: '@date',
      purchaseName: '@date',
      currency: 'rmb',
      poDate: '@date'
    }));
  });
  result.dataList = tableData;
  result.totalSize = 1992;
  result.pageIndex = params.pageIndex;
  result.pageSize = params.pageSize;
  return result;
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
