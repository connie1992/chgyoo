import axios from 'axios';

let util = {};
util.title = function (title) {
  title = title ? title + ' - Home' : '全面预算管理';
  window.document.title = title;
};

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  // debugger;
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.setCurrentPath = function (vm, name) {
  let title = '';
  let isOtherRouter = false;
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === 'otherRouter') {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
        path: '',
        name: 'home_index'
      }
    ];
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
        path: '/home',
        name: 'home_index'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ];
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      } else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index'
        }
      ];
    } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ];
    } else {
      let childObj = currentPathObj.children.filter((child) => {
        return child.name === name;
      })[0];
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    });
    tag = tag[0];
    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit('increateTag', tag);
    }
  }
  vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

util.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage');
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist');
  // 全屏相关
};

util.checkUpdate = function (vm) {
  axios.get('https://10.108.14.3/latest').then(res => {
    let version = res.data.tag_name;
    vm.$Notice.config({
      duration: 0
    });
    if (semver.lt(packjson.version, version)) {
      vm.$Notice.info({
        title: '薪酬系统更新啦',
        desc: '<p>薪酬系统更新到了' + version + ',清除浏览器缓存看看有哪些变化吧</p>'
      });
    }
  });
};

util.splitRoute = (menuUrl) => {
  let path = menuUrl.split('/');
  if (path[path.length - 1].indexOf(':') >= 0) {
    // 带参数的路由: /test/:name=chenhuogu&:id=21480
    let paramArr = path[path.length - 1].split('&');
    let paramPath = '';
    let last = menuUrl.lastIndexOf('/');
    let url = menuUrl.substring(0, last);
    paramArr.forEach(item => {
      let index = item.indexOf('=');
      paramPath = `/${item.substring(0, index)}`;
      url = url + `/${item.substring(index + 1)}`;
    });
    return {path: path[path.length - 2] + paramPath, url: url, isParam : true};
  }
  else {
    return {path: path[path.length - 1], url: menuUrl, isParam : false};
  }
};

util.doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

util.getParams = url => {
  const keyValueArr = url.split('?')[1].split('&');
  let paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split('=');
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

util.copyObject = (obj) => {
  if (!(obj instanceof Array)) {
    let newObj = Object.assign({}, obj);
    return newObj;
  } else {
    return obj.map((item) => {
      return Object.assign({}, item);
    })
  }
};

util.ifUndefined = (obj) => {
  return typeof (obj) === 'undefined';
};

util.timeOutUse = (callback, time) => {
  if (!time) {
    time = 800;
  }
  console.log(time);
  setTimeout(callback(), time);
};

util.makeIds = (arr) => {
  let ids = [];
  arr.forEach((item) => {
    ids.push(item.id);
  });
  return util.fmtIdArr(ids);
};

util.fmtIdArr = (ids) => {
  let fmt = JSON.stringify(ids);
  fmt = fmt.replace(new RegExp('"','gm'), '');
  fmt = fmt.substring(1, fmt.length - 1);
  return fmt;
}


util.getDictionry = (vm, arr) => {
  return new Promise(resolve => {
    vm.$post('getDictionary', {keys: arr}).then(res => {
      if (util.isSuccess(res)) {
        let dicArr = [];
        let data = res.data.data;
        data.forEach(dic => {
          let dicObj = [];
          dic.split(';').forEach(item => {
            let index = item.indexOf(',');
            dicObj.push({value: item.substring(0, index), label: item.substring(index + 1, item.length)})
          })
          dicArr.push(dicObj);
        });
        resolve(dicArr);
      } else {
        resolve(false);
      }
    });
  });
};

util.convertDic = (vm, value, dataKey) => {
  let dic = vm[dataKey];
  let item = dic.find(item1 => item1.value == value);
  return item ? item.label : '';
};

util.checkSelects = (vm, tableRef) => {
  let selects = vm.$refs[tableRef].getSelects();
  if (selects.length == 0) {
    vm.$Message.error('请选择一条记录操作！');
    return false;
  }
  return selects;
};

util.isSuccess= (res) => {
  if (res.message === 'request cancel') {
    return false;
  } else {
    return (res.data && res.data.code == 200) || (res.code == 200);
  }
};

util.calAddRemove = (oldArr, newArr) => {
  let add = [];
  let remove = [];
  // 和之前选择的相比，判断少了哪些，多了哪些
  let same = [];
  oldArr.forEach(item => {
    if (newArr.indexOf(item) < 0) {
      remove.push(item);
    } else {
      same.push(item);
    }
  });
  newArr.forEach(item => {
    if (same.indexOf(item) < 0) {
      add.push(item);
    }
  });
  return {add: add, remove : remove, changed: add.length > 0 || remove.length > 0};
};

util.makeRules = (columns) => {
  let rules = {};
  columns.forEach(item => {
    if (item.rule && item.rule.trigger) {
      rules[item.key] = {
        required: true,
        message: `${item.title}不能为空`,
        trigger: item.rule.trigger
      };
      if (item.rule.type) {
        rules[item.key].type = item.rule.type;
      }
    }
  });
  return rules;
};

util.focus = (vm, ref) => {
  setTimeout(() => {
    vm.$refs[ref].focus();
  }, 200)
};

util.checkSelect = (vm, ref) => {
  let select = vm.$refs[ref].getSelects();
  if (select.length == 0) {
    vm.$Message.error('请选择一条记录操作！');
    return false;
  } else {
    return select;
  }
};

util.formValid = (vm, formRef) => {
  return new Promise(resolve => {
    vm.$refs[formRef].validate(valid => {
      if (!valid) {
        vm.$Message.error('请填写完整！');
      }
      resolve(valid);
    });
  });
};

export default util;
