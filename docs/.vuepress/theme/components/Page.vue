<template>
  <main class="page">
    <slot name="top" />

    <Content class="theme-default-content" />

    <ContributorsList />

    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />
    <Vssue :title="$title" :key="$title" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue';
import PageNav from '@theme/components/PageNav.vue';

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems'],
  updated(a, b) {
    console.log('asdfasf');
  },
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block
</style>
