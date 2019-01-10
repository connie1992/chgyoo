<template>
    <div>
        <Icon :custom="custom"></Icon>
        <span>{{title}}</span>
    </div>
</template>

<script>
  export default {
    name: 'ModalTitle',
    props: {
      custom: {
        type: String,
        default: 'ios-albums-outline'
      },
      title: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped>

</style>