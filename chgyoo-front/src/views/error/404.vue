<style lang="less">
    @import './404.less';
</style>

<template>
    <div class="error404">
        <div class="error404-body-con">
            <Card>
                <div class="error404-body-con-title">4<span><Icon type="ios-navigate-outline"></Icon></span>4</div>
                <p class="error404-body-con-message">页&nbsp;&nbsp;面&nbsp;&nbsp;不&nbsp;&nbsp;存&nbsp;&nbsp;在</p>
                <div class="error404-btn-con">
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
                </div>
            </Card>
            <Button @click="test">测试路由</Button>
            <router-view>

            </router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error404',
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({
                name: '/'
            });
        },
      test() {
        this.$router.push({path: '/error/404/404-1'});
      }
    }
};
</script>
