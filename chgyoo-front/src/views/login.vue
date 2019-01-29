<style lang="less">
    @import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="账号">
                                <span slot="prepend">
                                    <Icon :size="18" type="ios-person-outline" />
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="密码">
                                <span slot="prepend">
                                    <Icon :size="18" type="ios-lock-outline" />
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long :loading="loading">登录</Button>
                        </FormItem>
                    </Form>
                    <!--<div id="qrcode" style="text-align: center; margin: auto; width: 80px"></div>
                    <p class="login-tip">微信扫码登录</p>-->
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
  import login from '@/libs/login';

  export default {
    data() {
      return {
        form: {
          userName: 'chenhuogu',
          password: 'test'
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        loading: false
      };
    },
    mounted() {
      this.qrcode();
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            // TODO 验证用户名密码是否正确

            // 根据用户名获取用户信息和菜单权限
            login(this.form.userName).then(ok => {
              this.loading = false;
            });
          }
        });
      },
      qrcode() {
        /*let qrcode = new QRCode('qrcode', {
          width: 80,
          height: 80,
          text: 'http://www.baidu.com'
        });*/
      }
    }
  };
</script>

<style>

</style>
