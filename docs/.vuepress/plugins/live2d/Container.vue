  
<style scoped>
.container.right-container {
  position: fixed;
  right: 50px;
  bottom: 100px;
  color: #00adb5;
}
.container.left-container {
  position: fixed;
  left: 50px;
  bottom: 100px;
  color: #00adb5;
}
.container .live2d-left {
  position: fixed;
  /* opacity: 1; */
  left: 0px;
  bottom: 20px;
  z-index: 998;
  pointer-events: none;
}
.container .live2d-right {
  position: fixed;
  /* opacity: 1; */
  right: 0px;
  bottom: 20px;
  z-index: 998;
  pointer-events: none;
}
</style>

<template>
  <div class="container" v-show="isLoaded">
    <canvas id="live2d" width="210px" height="280px" :class="modelPosition"></canvas>
  </div>
</template>

<script>
  import live2dJSString from "./live2d";
  export default {
    name: "Container",
    data() {
      return {
        isLoaded: true,
        model: {
          'z16': "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-z16/assets/z16.model.json",
        },
        style: {
          width: '300px',
          height: '400px'
        }
      };
    },
    computed: {
      modelPosition() {
        return MODEL_POSITION === 'left' ? 'live2d-left' : 'live2d-right';
      },
      containerPosition() {
        return MODEL_POSITION === 'left' ? 'left-container ' : 'right-container';
      },
    },
    mounted() {
      this.init();
      this.$router.afterEach((to, from) => {
        if (to.path !== from.path) {
          this.init();
        }
      });
    },
    methods: {
      init() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!MOBILE_SHOW && isMobile) {
          this.isLoaded = false;
        }
        if (!window.loadlive2d && this.isLoaded) {
          const script = document.createElement("script");
          script.innerHTML = live2dJSString;
          document.body.appendChild(script);
        }
        this.style = isMobile ? {
                  width: (150 / 768) * document.body.clientWidth,
                  height: ((150 / 768) * document.body.clientWidth) / 0.8
                } :
                {
                  width: (150 / 1424) * document.body.clientWidth,
                  height: ((150 / 1424) * document.body.clientWidth) / 0.8
                };
        let live2d = '';
        if (MODEL_NAME === '' || MODEL_NAME.length === 0) {
          live2d = Math.random() > 0.5 ? this.model['z16'] : this.model['Epsilon2.1'];
        } else if (Array.isArray(MODEL_NAME) && MODEL_NAME.length > 0) {
          let index = Math.floor((Math.random() * MODEL_NAME.length));
          live2d = this.model[MODEL_NAME[index]];
        } else {
          live2d = this.model[MODEL_NAME];
        }
        setTimeout(() => {
          if (this.isLoaded) {
            window.loadlive2d("live2d", live2d);
          }
        });
      }
    }
  };
</script>