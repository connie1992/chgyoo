<template>
    <div>
        主页
    </div>
</template>

<script>
  export default {
    name: 'home',
    methods: {
      backPage() {
        this.$router.go(-1);
      },
      goHome() {
        this.$router.push({
          name: 'home_index'
        });
      }
    }
  };
</script>
