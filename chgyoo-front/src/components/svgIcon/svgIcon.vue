<template>
    <!-- 彩色图标 -->
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="iconID"></use>
    </svg>
</template>

<script>
  export default {
    name: 'svgIcon',
    props: {
      iconText: {
        type: String
      }
    },
    data() {
      return {};
    },
    methods: {
    },
    watch: {},
    computed: {
      iconID: function () {
        return `#icon-${this.iconText}`;
      }
    },

  };
</script>

<style scoped>
    .icon {
        width: 1.4em; height: 1.4em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
