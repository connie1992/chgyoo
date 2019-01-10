export const showTitle = (item, vm) => {
  return vm.$config.useI18n ? vm.$t(item.meta.title) : ((item.meta && item.meta.title) || item.name);
};
