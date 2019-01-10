<template>
    <div v-if="show" :style="{padding: '1px 0 1px 0px',background:bgColor}">
        <ButtonGroup v-if="show" ref="toolBarGroup" id="testGroup">
            <template v-for="item in btnList">
                <Button v-if="item.permission" type="text" :key="item.funcName" size="small" @click="toolClick(item.funName)"
                        v-haspermission="item.permission" :style="{height: height}">
                    <!-- 彩色图标 -->
                    <SvgIcon :iconText="item.icon"></SvgIcon><span style="font-size: 10px">{{item.text}}</span>
                </Button>
                <Button v-else type="text"  :key="item.funcName" size="small" @click="toolClick(item.funName)"
                        :style="{height: height}">
                    <SvgIcon :iconText="item.icon"></SvgIcon><span style="font-size: 10px">{{item.text}}</span>
                </Button>
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
      }
    },
    data() {
      return {
        show: true
      };
    },
    methods: {
      toolClick(funName) {
        this.$emit(funName);
      },
      getHeight() {
        return this.show ? Number(this.height.substring(0, this.height.length - 2)) + 4 : 0;
      }
    },

    mounted() {
      // 这段是处理如果在工具栏一个按钮都没有的时候，将buttongroup隐藏掉，因为高度还在那里，看着就是一个灰色的条
      // 获取按钮操作权限
      let routers = this.$store.state.user.routers;
      let permissions = findRoute(routers, this.$route.name);
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
  };
</script>

<style scoped>

</style>
