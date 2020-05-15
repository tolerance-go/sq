<template>
  <main class="page">
    <slot name="top" />

    <Content v-bind:class="{ 'qa-page': isQaPage, 'theme-default-content': true }" />

    <ContributorsList :key="$title + 'ContributorsList'" />

    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />
    <Vssue :title="$title" :key="$title" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue';
import PageNav from '@theme/components/PageNav.vue';

let prePage;

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems'],
  data() {
    return {};
  },
  updated() {
    // if (prePage !== this.$page.relativePath) {
    //   if (this.isQaPage) {
    //     if (document && document.getElementsByClassName) {
    //       const content = document.getElementsByClassName(
    //         'content__default',
    //       )[0];

    //       if (content) {
    //         content.classList.remove('qa-page');
    //         content.classList.add('qa-page');

    //         Array.from(
    //           content.querySelectorAll(
    //             '.content__default > p, .content__default > ul > li, .content__default > ol > li, .content__default > div > pre',
    //           ),
    //         ).filter(node => {
    //           return !(node.tagName.toLowerCase() === 'li' 
    //           && node.parentElement 
    //           && node.parentElement.previousElementSibling 
    //           && node.parentElement.previousElementSibling.id === '参考资源' 
    //           || node.textContent === '点击显示隐藏内容')
    //         }).forEach((node) => {
    //           node.classList.remove('qa', 'hidden');
    //           node.classList.add('qa', 'hidden');
    //           node.onclick = () => {
    //             node.classList.toggle('hidden');
    //           };
    //         });
    //       }
    //     }
    //   }

    //   prePage = this.$page.relativePath;
    // }
  },
  computed: {
    isQaPage() {
      return (
        this.$page.relativePath.startsWith('晓问题') 
      );
    },
  },
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page {
  padding-bottom: 2rem;
  display: block;
}

@keyframes mova {
  0% {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

.qa-page {
  > h2 {
    margin-top: 0 !important;
  }
}

.qa {
  cursor: pointer;

  &.hidden {
    z-index: 999;
    border-radius: 5px;
    transition: width, height 0.15s ease-out;
    background-image: linear-gradient(
      270deg,
      #fafafa,
      #eaeaea,
      #eaeaea,
      #fafafa
    ) !important;
    background-size: 400% 100% !important;
    animation: mova 8s ease-in-out infinite;
    display: block;
    width: auto;
    color: transparent;

    > * {
      visibility: hidden;
    }
  }
}
</style>
