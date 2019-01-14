<template>
    <!-- 彩色图标 -->
    <span>
    <template v-if="tip.length > 0">
        <Tooltip :content="tip" transfer theme="dark">
            <Button :size="btnSize" @click="btnClick" :style="{height: height}" :type="type" :disabled="disabled" :loading="loading">
                <SvgIcon :icon-text="iconText"></SvgIcon>
                <span :style="{fontSize: fontSize}"> {{btnText}}</span>
            </Button>
        </Tooltip>
    </template>
    <template v-else>
        <Button :size="btnSize" @click="btnClick" :style="{height: height}" :type="type" :disabled="disabled" :loading="loading">
            <SvgIcon :icon-text="iconText"></SvgIcon>
            <span :style="{fontSize: fontSize}"> {{btnText}}</span>
        </Button>
    </template>
    </span>

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
        default: ''
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
      },
      tip: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      };
    },
    methods: {
      btnClick() {
        this.$emit('click');
      }
    },
    watch: {

    },
    computed: {
      iconID: function () {
        return `#icon-${this.iconText}`;
      }
    }
  };
</script>
