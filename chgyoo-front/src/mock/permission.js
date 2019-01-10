export const getMenuData = req => {
  let menu = [
    {
      id: 'jhdfhuisdfhais873204u',
      title: '采购审核',
      order: 1,
      icon: 'iconfont icon-fenlei',
      children: [
        {
          id: 'jhdfhuisdfhais873204udfw',
          title: '采购订单',
          url: 'demo/check',
          order: 1
        },
        {
          id: 'jhdfh5547sdfhais873204u',
          title: '材料类收退货审核',
          url: 'demo/material',
          order: 2
        }
      ]
    },
    {
      id: 'jhdf56tryrtisdfhais873204u',
      title: '系统设置',
      order: 2,
      icon: 'iconfont icon-shezhi1',
      children: [
        {
          id: 'jh53457huisdfhais873204u',
          title: '权限设置',
          icon: 'iconfont icon-ic_opt_feature',
          children: [{
            id: 'jrewr56245huisdfhais873204u',
            title: '菜单管理',
            url: 'demo/material',
            order: 1
          },{
            id: 'jhdfhuis57567tfhais873204u',
            title: '角色管理',
            url: 'demo/material',
          },{
            id: '54tryjhdfhuisdfhais873204u',
            title: '角色授权',
            url: 'demo/material',
            order: 3
          }]
        },
        {
          id: 'rterthdfhuisdfhais873204u',
          title: '定时任务',
        }
      ]
    }
  ];
  return {
    code: 200,
    data: menu,
    msg: ''
  };
};

export const getMenuDataByRole = req => {
  let params = req.body;
  let menu = [
    {
      id: 'jhdfhuisdfhais873204u',
      title: '采购审核',
      children: [
        {
          id: 'jhdfhuisdfhais873204udfw',
          title: '采购订单',
        },
        {
          id: 'jhdfh5547sdfhais873204u',
          title: '材料类收退货审核',
        }
      ]
    },
    {
      id: 'jhdf56tryrtisdfhais873204u',
      title: '系统设置',
      children: [
        {
          id: 'jh53457huisdfhais873204u',
          title: '权限设置',
          children: [{
            id: 'jrewr56245huisdfhais873204u',
            title: '菜单管理',
          },{
            id: 'jhdfhuis57567tfhais873204u',
            title: '角色管理',
          },{
            id: '54tryjhdfhuisdfhais873204u',
            title: '角色授权',
          }]
        },
        {
          id: 'rterthdfhuisdfhais873204u',
          title: '定时任务',
        }
      ]
    }
  ];
  let selected = ['jhdfhuisdfhais873204udfw', '54tryjhdfhuisdfhais873204u'];
  selected.push(params == 'rgethryh675645tryrety' ? 'rterthdfhuisdfhais873204u' : 'jh53457huisdfhais873204u');
  return {
    code: 200,
    data: menu,
    selected: selected,
    msg: ''
  };
};

export const saveMenu = req => {
  console.log('i am in save menu mock');
  return {
    msg: 'success',
    success: true
  };
};

export const getBtns = req => {
  return {
    msg: 'success',
    success: true,
    data: [
      {
        id: 'huiefhwuefh78324',
        opName: '批量删除',
        opCode: 'delete',
        checked: true
      },
      {
        id: 'huiefhwu57672h78324',
        opName: '录入',
        opCode: 'add',
        checked: true
      },{
        id: 'huiefhwuefh78324',
        opName: '编辑',
        opCode: 'edit',
        checked: false
      },{
        id: 'huiefhwuef46548324',
        opName: '审核通过',
        opCode: 'checkYes',
        checked: false
      },{
        id: 'huiefhtryrty5efh78324',
        opName: '取消审核',
        opCode: 'checkNo',
        checked: false
      }
    ]
  };
};

export const deleteItems = req => {
  console.log('i am in delete items mock');
  return {
    msg: '删除成功',
    success: true
  };
};

export const getRoles = req => {
  return {
    msg: 'success',
    success: true,
    data: {
      total: 4,
      data: [
        {
          id: 'rgethryh6786jtyjety',
          code: 'viewer',
          name: '查看'
        },
        {
          id: 'rgethryh4645tr786jtyjety',
          code: 'admin',
          name: '管理员'
        },
        {
          id: 'rgethryh6786jty45ertty',
          code: 'normal',
          name: '普通用户'
        },
        {
          id: 'rgethryh675645tryrety',
          code: 'financial',
          name: '财务人员'
        }
      ]
    }
  };
};

export const getOrg = req => {
  return {
    msg: 'success',
    data: [
      {
        id: 'ifowequf980293',
        title: '深圳市华星光电技术有限公司',
        children: [
          {
            id: 'ierfowequf980293',
            title: '财务中心',
            children: [
              {
                id: 'ierfoweq5465uf980293',
                title: '财务部',
                children: [
                  {
                    id: 'ierfoweq5465uf964876293',
                    title: '会计核算科',
                    children: []
                  },
                  {
                    id: 'ierfow5464gr5465uf980293',
                    title: '税务与专案科',
                    children: []
                  },
                  {
                    id: 'ierfow45eq5465uf980293',
                    title: '信用与往来管理科',
                    children: []}
                ]
              },
              {
                id: 'ierfo234wequf980293',
                title: '管控部',
                children: [

                ]
              },
              {
                id: 'ierfow46456equf980293',
                title: '资金管理部',
                children: [
                ]
              }
            ]
          }
        ]
      }
    ]
  };
};

export const getGroupUser = req => {
  return {
    msg: 'success',
    data: [
      {
        id: 'ifowequf980293',
        title: '深圳市华星光电技术有限公司',
        disabled: false,
        children: [
          {
            id: 'ierfowequf980293',
            title: '财务中心',
            disabled: false,
            children: [
              {
                id: 'ierfoweq5465uf980293',
                title: '财务部',
                disabled: false,
                children: [
                  {
                    id: 'ierfoweq5465uf964876293',
                    title: '会计核算科',
                    disabled: false,
                    children: [
                      {
                        id: 'ierfofdgq5465uf964876293',
                        title: '张三',
                        number: '18505',
                        userName: 'zhangsan',
                        disabled: false,
                        children: []
                      },
                      {
                        id: 'ier5436q5465uf964876293',
                        title: '李四',
                        number: '21480',
                        userName: 'lisi',
                        disabled: false,
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
};

