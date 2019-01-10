<template>
    <!-- 彩色图标 -->
    <Button :size="btnSize" @click="btnClick" :style="{height: height}" :type="type" :disabled="disabled" :loading="loading">
        <SvgIcon :icon-text="iconText"></SvgIcon>
        <span :style="{fontSize: fontSize}"> {{btnText}}</span>
    </Button>
</template>

<script>
  export default {
    name: 'svgIconBtn',
    props: {
      iconText: {
        type: String
      },
      btnText: {
        type: String,
        default: '彩色图标按钮'
      },
      btnSize: {
        type: String,
        default: 'small'
      },
      btnName: {
        type: String,
        default: ''
      },
      fontSize: {
        type: String,
        default: '12px'
      },
      height: {
        type: String,
        default: '25px'
      },
      type: {
        type: String,
        default: 'default'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    methods: {
      btnClick() {
        this.$emit(`${this.btnName}-click`);
      }
    },
    watch: {},
    computed: {
      iconID: function () {
        return `#icon-${this.iconText}`;
      }
    }
  };
</script>
