<style lang="less">
    @import "./index.less";
</style>
<template>
    <div class="index">
        <Layout>
            <iHeader :pagesize="pageSize"
                     v-on="{popConf: popConf, logout: logout}">
                <sider-trigger :collapsed="isCollapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
            </iHeader>
            <Layout :style="{padding: '0 2px'}">
                <Layout>
                    <Sider hide-trigger :style="{background:'#f9fafc'}" collapsible :width="230" :collapsed-width="64" v-model="isCollapsed">
                        <side-menu :collapsed="isCollapsed" :menu-list="menuList" theme="light">
                        </side-menu>
                    </Sider>
                    <Content :style="{padding: '8px 8px'}">
                        <Card>
                            <div class="single-page-con">
                                <div style="padding-bottom: 5px">
                                <custom-bread-crumb show-icon style="margin-left: 0px;" :list="breadCrumbList"
                                                    :fontSize="12"></custom-bread-crumb>
                                </div>
                                <Divider/>
                                <!--<transition name="fade">-->
                                <keep-alive>
                                   <!--页面切换动画效果-->
                                   <router-view></router-view>
                                </keep-alive>
                                <!--</transition>-->
                                <!--<keep-alive>
                                    <router-view v-if="$route.meta.keepAlive"></router-view>
                                </keep-alive>
                                <router-view v-if="!$route.meta.keepAlive"></router-view>-->
                            </div>
                        </Card>
                    </Content>
                </Layout>
                <!--/Content-->
                <transition name="slide-right" :duration="{ enter: 500, leave: 800 }">
                    <aside v-show="popConfig"
                           style="position:absolute; padding-top: 10px; z-index: 1010;border-left: 1px solid #d2d6de;
                        background-color: #f9fafc;width:340px; height:100%;right:0px;top:50px;z-index: 1010;">
                        <ul id="csot" style="padding-left:10px">
                            <Card style="width:320px; padding-left:5px">
                                <p slot="title">
                                    <Icon type="ios-film-outline"></Icon>
                                    {{ $t('language_setting') }}
                                </p>
                                <a href="#" slot="extra" @click.prevent="changeLimit">
                                    <Icon type="ios-loop-strong"></Icon>
                                </a>

                                <ul>
                                    <RadioGroup v-model="language" vertical>
                                        <Radio label="zh-CN">
                                            <span>中文</span>
                                        </Radio>
                                        <Radio label="en-US">
                                            <span>English</span>
                                        </Radio>
                                    </RadioGroup>
                                </ul>
                            </Card>
                            <ul style="margin-top: 20px">
                                <Card style="width:320px; padding-left:5px">
                                    <p slot="title">
                                        <Icon type="ios-search"></Icon>
                                        {{ $t('company_setting') }}
                                    </p>
                                    <a href="#" slot="extra" @click.prevent="changeLimit">
                                        <Icon type="ios-loop-strong"></Icon>
                                    </a>
                                    <ul>
                                        <Select v-model="book">
                                            <Option v-for="item in books" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </ul>
                                </Card>
                            </ul>
                           <!-- <ul style="margin-top: 20px">
                                <Card style="width:320px; padding-left:5px">
                                    <p slot="title">
                                        <Icon type="ios-search"></Icon>
                                        {{ $t('pagesize_setting') }}
                                    </p>
                                    <a href="#" slot="extra">
                                        <Icon type="ios-loop-strong"></Icon>
                                    </a>
                                    <ul>
                                        <RadioGroup v-model="pageSize" vertical>
                                            <Radio label="5">
                                                <span>每页 5 条信息</span>
                                            </Radio>
                                            <Radio label="10">
                                                <span>每页 10 条信息</span>
                                            </Radio>
                                            <Radio label="15">
                                                <span>每页 15 条信息</span>
                                            </Radio>
                                        </RadioGroup>
                                    </ul>
                                </Card>
                            </ul>-->
                            <ul style="margin-top: 100px">
                                <Button type="success" long @click="popConfig=false;handleSetting()">SUBMIT</Button>
                            </ul>
                        </ul>
                    </aside>
                </transition>
            </Layout>
        </Layout>
    </div>
</template>
<script>
  import iHeader from './layout/header.vue';
  import SideMenu from 'ivew-side-menu-search-chg';
  import siderTrigger from './layout/sider-trigger';
  import customBreadCrumb from '../components/custom-bread-crumb';
  import Cookie from 'js-cookie';

  export default {
    data() {
      return {
        popConfig: false,
        isCollapsed: false,
        language: 'zh-CN',
        pageSize: '5',
        height: 500,
        // 用户信息
        book: '',
        userInfo: {},
        books: [],
        // 菜单
        menuList: []
      };
    },
    components: {
      iHeader,
      customBreadCrumb,
      SideMenu,
      siderTrigger
    },
    computed: {
      breadCrumbList() {
        // console.log('面包屑……');
        // console.log(this.$store.state.user.breadCrumbList);
        return this.$store.state.user.breadCrumbList;
      },
    },
    methods: {
      popConf() {
        this.popConfig = !this.popConfig;
      },
      logout() {
        this.$store.dispatch('logout').then(() => {
          this.$router.push({
            name: 'login',
          });
        });
      },
      handleCollpasedChange() {
        this.isCollapsed = !this.isCollapsed;
      },
      handleSetting() {
        this.$store.commit('setCurrentBook', this.book);
      }
    },
    watch: {
      '$route'(newRoute) {
        console.log('路由改变……');
        // 路由切换时判断是否需要刷新数据
        let vmMap = this.$store.state.data.vmMap;
        if (vmMap[newRoute.path]) {
          vmMap[newRoute.path].forEach(vm => {
            vm.search();
          });
        }
        this.$store.commit('setBreadCrumb', {matched: this.$route.matched, route: newRoute});
      },
      language() {
        this.$i18n.locale = this.language;
        //写入cookie
        Cookie.set('csotlanguage', this.$i18n.locale);
      },
      pageSize() {
        Cookie.set('tddopagesize', this.pageSize);
      }
    },
    mounted() {
      this.$store.commit('setBreadCrumb', {matched: this.$route.matched, route: this.$route});
    },
    created() {
      // console.log('index界面create……');
      if (Cookie.get('csotlanguage')) {
        this.$i18n.locale = Cookie.get('csotlanguage');
        this.language = Cookie.get('csotlanguage');
      }
      if (Cookie.get('tddopagesize')) {
        this.pageSize = Cookie.get('tddopagesize');
      }
      // 这些变量没有设置成计算属性是因为，index界面所在的router-view是不缓存的，每一次重新登录进来都会重新create一次
      this.menuList = this.$store.getters.getMenuTree;
      this.userInfo = this.$store.getters.getUserInfo;
      this.book = this.userInfo.book;
      this.books = this.$store.getters.getAccounts;
    }
  };
</script>

