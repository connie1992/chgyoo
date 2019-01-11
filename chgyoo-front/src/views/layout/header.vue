<style>
    #test .ivu-badge .ivu-badge-dot {
        top: 8px
    }
</style>
<template>
    <Header :style="{'z-index': '10001', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
            <span class="logo-title col-btn"><slot></slot></span>
            <span class="logo-title logo-lg"></span>
            <span class="logo-title" style="color: white;font-size: 19px;font-weight: bold">chgyoo</span>
        <nav>
            <div class="navbar-custom-menu">
                <!-- 登出-->
                <ul class="layout-avatar">
                    <li style="margin-top: -8px">
                        <a href="#" class="sidebar-toggle">
                            <Icon color="white" type=" iconfont icon-logout1" 　@click.native="logout" size="19" style="margin-top: 12px"/>
                        </a>
                    </li>
                </ul>
                <!-- 个人信息-->
                <ul class="layout-avatar">
                        <span style="color: #FFFFFF;font-weight: bold">
                            {{ userInfo.name + (userInfo.department ? ('-' + userInfo.department.name) : (userInfo.post ? '-' + userInfo.post : ''))}}
                        </span>
                </ul>
                <!-- 头像 -->
                <ul id="csot" class="layout-avatar">
                    <!--<Poptip placement="bottom" width="300">-->
                        <Avatar :src="avatarUrl" :title="$t('title_userinfo')"/>
                </ul>
                <!-- 小齿轮 -->
                <ul class="nav navbar-nav layout-avatar">
                    <li style="margin-top: -5px">
                        <a href="#" class="sidebar-toggle" :title="$t('title_config')">
                            <Icon color="white" type=" iconfont icon-shezhi" 　@click.native="popConfig" size="24" style="margin-top: 12px"/>
                        </a>
                    </li>
                </ul>
                <!-- 待办 -->
                <ul class="nav navbar-nav layout-avatar">
                    <li>
                        <Poptip placement="bottom" width="300">
                            <!-- 此处为什么要加一个span元素？ 因为在这个导航样式中，徽标的图标高度是整个导航的高度，相对于图标使用绝对定位的小红点就会飘高，
                            因为需要修改到自带的top样式，style加scope是无效的，为了不污染全局的徽标样式，因此包裹了一个指定id的父元素 -->
                            <span id="test">
                                <Badge dot>
                                    <!--<a href="#" class="sidebar-toggle" @click="todoListfunc">-->
                                    <!--<a href="#" class="sidebar-toggle" :title="$t('title_todolist')">-->
                                    <Icon color="white" type=" iconfont icon-bell" size="25"/>
                                    <!--</a>-->
                                </Badge>
                            </span>
                            <!-- 点击消息列表弹出来 -->
                            <ul class="drown-menu" slot="content">
                                <li class="todo-header">您有 {{ todoCount }} 条信息</li>
                                <li>
                                    <ul class="todo-menu">
                                        <li v-for="item in todoList">
                                            <a :href="item.notifyLink" target="_blank">
                                                <h4>
                                                    {{ item.notifySubject.split('：')[0].split('，')[0] }}
                                                    <small style="float: right; padding-right: 5px;">
                                                        <Icon type="clock"></Icon>
                                                        {{ item.docCreateDate }}
                                                    </small>
                                                </h4>
                                                <p>{{ item.notifySubject.split('：')[1] }}</p>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li style="text-align: center;"><a
                                        href="http://docenter.csot.tcl.com/?notifyType=T_TODO#all" target="_blank"
                                        style="color: #888888;">See All Messages</a></li>
                            </ul>
                        </Poptip>
                    </li>
                </ul>
            </div>
        </nav>
    </Header>
    <!--/div-->
</template>
<script>
  import {strToTimestamp, timeago} from '../../libs/tools';

  export default {
    name: 'HeaderBar',
    data() {
      return {
        todoList: [],
        todoCount: 0
      };
    },
    props: {
      pagesize: {  //待办条数
        type: String,
        default() {
          return '5';
        }
      }
    },
    computed: {
      userInfo() {
        return this.$store.getters.getUserInfo;
      },
      avatarUrl() {
        return `http://photo.csot.tcl.com/image/${this.userInfo.code}.jpg`;
      }
    },
    watch: {
      pagesize() {
        this.getTodoList();
      }
    },
    methods: {
      getTodoList() {
        let me = this,
          url = 'udpf/gtasks/pagingQuery?limit=' + this.pagesize + '&page=1';
        this.$fetch(url).then(res => {
          res.data.data.forEach(item => {
            item.docCreateDate = timeago(strToTimestamp(item.docCreateDate));
          });
          me.todoList = res.data.data;
          me.todoCount = res.data.resultCount;
        });
      },
      todoListfunc() {
        let me = this;
        this.$Notice.success({
          title: '请处理您的待办:',
          desc: 'The desc will hide when you set render.',
          duration: 0,
          render: h => {
            if (me.todoList.length) {
              return h('ul', {class: 'todo'}, me.todoList.map(function (item) {
                let content = item.notifySubject.split('：');
                return h('li', {
                  style: {
                    'list-style': 'none',
                    'padding': '10px 10px'
                  }
                }, [h('a', [h('h4', [content[0] + ':', h('p', {style: {'padding-left': '56px'}}, content[1])])])]);
              }));
            } else {
              return h('p', 'No items found.');
            }
          }
        });
      },
      popConfig() {
        this.$emit('popConf');
      },
      logout() {
        this.$Modal.confirm({
          title: '确认？',
          content: '确认退出系统吗？',
          onOk: () => {
            this.$emit('logout');
          },
          onCancel: () => {
          }
        });

      }
    },
    created() {
      // this.getTodoList();
    },
    components: {
    }
  };
</script>
<style scoped>
    .layout-avatar {
        float: right;
        padding-right: 10px;
        position: relative;
    }

    .ivu-layout-header {
        background: rgb(94, 135, 176); /*#6593e5;*/
        padding: 0 0px;
        height: 50px; /*60px;*/
        line-height: 50px; /*64px;*/
    }


    .ivu-poptip-body {
        padding: 2px 2px;
    }

    /* 设置头像以及弹出框 */
    #csot > .ivu-poptip-popper[x-placement^=bottom] .ivu-poptip-arrow {
        top: -6px;
        border-width: 0 5px 5px;
        border-bottom-color: hsla(0, 0%, 85%, .5);
    }

    .col-btn {
        margin-left: 30px;
    }

    .logo-title {
        display: block;
        height: 100%;
        float: left;
        position: relative;
    }

    .logo-lg {
        transition: width 0.3s;
        -moz-transition: width 0.3; /* Firefox 4 */
        -moz-transition: width 0.3; /* Firefox 4 */
        -webkit-transition: width 0.3s; /* Safari 和 Chrome */
        -o-transition: width 0.3s;
        width: 60px;
        background-image: url("../../assets/images/logo2.png");
        background-repeat: no-repeat;
        background-position: center center;
        border-radius: 3px;
    }

    .navbar-custom-menu {
        float: right;
        display: inline-block;
        padding-right: 30px;
    }

    .navbar-nav {
        float: right;
        margin: 0;
    }

    .nav {
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }

    .sidebar-toggle {
        float: left;
        height: 100%;
        background-color: transparent;
        background-image: none;
        color: #fff;
    }

    .todo-header {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        background-color: #ffffff;
        padding: 7px 10px;
        border-bottom: 1px solid #f4f4f4;
        color: #444444;
        font-size: 14px;
    }

    .todo-menu {
        max-height: 350px;
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-x: hidden;
    }

    .todo-menu li a {
        display: block;
        white-space: nowrap;
        border-bottom: 1px solid #f4f4f4;
        padding-top: 10px;
    }

    .todo-menu li a:hover {
        background: #f4f4f4;
        text-decoration: none;
    }

    .todo-menu li a h4 {
        padding: 0;
        margin: 0 0 0 15px;
        color: #444444;
        font-size: 14px;
        position: relative;
        font-weight: 500;
        line-height: 1.1;
        font-family: 'Source Sans Pro,sans-serif';
    }

    .todo-menu li a p {
        margin: 0 0 0 25px;
        font-size: 12px;
        color: #888888;
    }
</style>
