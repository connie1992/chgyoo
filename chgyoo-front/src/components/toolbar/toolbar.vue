<template>
    <div v-show="show" :style="{padding: '1px 0 1px 0px',background:bgColor}">
        <ButtonGroup ref="toolBarGroup" id="testGroup">
            <template v-for="(item, index) in btnList">
                <SvgIconBtn v-if="item.permission" type="text" :key="index" :height="height" v-haspermission="`${item.permission}${permissionPath}`"
                            :icon-text="item.icon" :btn-text="item.text" @click="toolClick(index)"></SvgIconBtn>
                <SvgIconBtn v-else type="text" :key="index" @click="toolClick(index)" :height="height"
                            :icon-text="item.icon" :btn-text="item.text"></SvgIconBtn>
            </template>
        </ButtonGroup>
    </div>
</template>

<script>
  import {findRoute} from '@/libs/tools';

  export default {
    name: 'ToolBar',
    props: {
      btnList: {
        type: Array,
        default() {
          return [];
        }
      },
      height: {
        type: String,
        default: '26px'
      },
      bgColor: {
        type: String,
        // ,borderTop: '#d2d9e4 1px solid', borderLeft: '#d2d9e4 1px solid', borderRight: '#d2d9e4 1px solid'
        default: '#e9eff7'
        // default: '#fff'
      },
      multi: {
        type: Boolean,
        default: false
      },
      permissionPath: {
        type: String,
        default: ''
      }
     /* multiUrl: {
        type: Array,
        default() {
          return [];
        }
      }*/
    },
    data() {
      return {
        show: true,
        path: ''
      };
    },
    methods: {
      toolClick(index) {
        this.$emit(`click${index + 1}`);
      },
      getHeight() {
        return this.show ? Number(this.height.substring(0, this.height.length - 2)) + 4 : 0;
      },
      checkShow() {
        // 检查按钮权限，控制工具栏的可见性
        let routers = this.$store.state.user.routers;
        let permissions = findRoute(routers, this.$route.name, this.$route.path);
        if (permissions) {
          let show = false;
          for (let i = 0; i < this.btnList.length; i++) {
            if (this.$util.ifUndefined(this.btnList[i].permission) || permissions.includes(this.btnList[i].permission)) {
              show = true;
              break;
            }
          }
          this.show = show;
        }
      }
    },
    watch: {
      /*'$route': function (newRoute) {
        if (this.multiUrl.length && this.multiUrl.includes(newRoute.path)) {
          this.path = newRoute.path;
        }
      }*/
    },
    mounted() {
      // 这段是处理如果在工具栏一个按钮都没有的时候，将buttongroup隐藏掉，因为高度还在那里，看着就是一个灰色的条
      // 获取按钮操作权限
      this.checkShow();
      this.path = this.$route.path;
    }
  };
</script>

<style scoped>

</style>
