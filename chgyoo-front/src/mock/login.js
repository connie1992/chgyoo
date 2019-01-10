import util from '../libs/util';

const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
};

export const login = req => {
  req = JSON.parse(req.body);
  return {
    code: 200,
    data: {token: USER_MAP[req.userName].token},
    msg: ''
  };
};

export const getUserInfo = req => {
  const params = util.getParams(req.url);
  return {
    code: 200,
    data: USER_MAP[params.token],
    msg: ''
  };
};

export const logout = req => {
  return {
    code: 200,
    data: null,
    msg: ''
  };
};

export const getCurrentUser = req => {
  return {
    code: 200,
    msg: '成功',
    data: {
      user: {
        id: '21480',
        name: '陈火姑',
        code: '21480',
        deptName: '营运系统科',
        account: 'chenhuogu',
        book: '1000',
        bookName: '深圳市华星光电技术有限公司'
      },
      books: [
        {key: '1000', label: '深圳市华星光电技术有限公司'},
        {key: '5000', label: '武汉华星光电技术有限公司'}
      ]
    }

  };
};

export const getAccounts = req => {
  return {
    data: []
  };
};
