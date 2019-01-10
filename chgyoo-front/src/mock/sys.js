import Mock from 'mockjs';
import qs from 'qs';
import util from '../libs/util';

export const getParamsData = req => {
  let tableData = [];
  util.doCustomTimes(50, () => {
    tableData.push(Mock.mock({
      id: '@string("lower", 32)',
      code: '@string("upper", 6)',
      name: '@name',
      value: '@float(1, 100, 2, 4)',
      createTime: '@date',
      type: 'system',
      vtype: 'single'
    }));
  });
  tableData.unshift({
    id: 'u8e9349289utirtwer',
    code: 'range_cloumn',
    name: '权限字段',
    value: 'csotCenter,成本中心;accSubject,会计科目',
    createTime: '2018-11-26',
    type: 'system',
    vtype: 'dictionary'
  });
  tableData.unshift({
    id: 'u8e93492834549utirtwer',
    code: 'auth_state',
    name: '数据权限状态',
    value: '1,生效;0,失效',
    createTime: '2018-11-26',
    type: 'system',
    vtype: 'dictionary'
  });
  tableData.unshift({
    id: 'u8e9349283453423549utirtwer',
    code: 'sys_config_type',
    name: '系统参数类型',
    value: 'system,系统参数;business,业务参数',
    createTime: '2018-11-26',
    type: 'system',
    vtype: 'dictionary'
  });
  tableData.unshift({
    id: 'u8e9343483453423549utirtwer',
    code: 'sys_config_value_type',
    name: '系统参数值类型',
    value: 'single,单值;range,区间;dictionary,数据字典',
    createTime: '2018-11-26',
    type: 'system',
    vtype: 'dictionary'
  });
  return {
    code: 200,
    data: {
      dataList: tableData,
      totalSize: 100
    },
    msg: '查询成功'
  };
};

export const addOrUpdate = req => {
  let params = JSON.parse(req.body);
  return {
    code: 200,
    data: {
    },
    msg: params.id == ''  ? '新建成功' : '编辑成功'
  };
};

export const deleteParams = req => {
  return {
    code: 200,
    data: {
    },
    msg: '删除成功'
  };
};

//------------------数据权限-------------
export const getAuthData = req => {
  let tableData = [];
  util.doCustomTimes(50, () => {
    tableData.push(Mock.mock({
      id: '@string("lower", 32)',
      code: '@string("upper", 8)',
      name: '@string("upper", 8)',
      rangeColumn: 'csotCenter',
      user1Name: '@name',
      status: '1'
    }));
  });
  return {
    code: 200,
    data: {
      dataList: tableData,
      totalSize: 100
    },
    msg: '查询成功'
  };
};

//-------------模拟获取数据字典---------------
export const getDictionary = req => {
  console.log('模拟数据，获取数据字典');
  let params = qs.parse(req.body);
  let source = new Map([
    ['auth_state', '1,生效;0,失效'],
    ['range_cloumn', 'csotCenter,成本中心;accSubject,会计科目'],
    ['sys_config_value_type', 'single,单值;range,区间;dictionary,数据字典'],
    ['sys_config_type', 'system,系统参数;business,业务参数']
  ]);
  let data = [];
  params.keys.forEach(item => {
    data.push(source.get(item));
  });
  return {
    code: 200,
    data: data,
    msg: '成功'
  };
};
