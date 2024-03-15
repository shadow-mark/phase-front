<template>
  <div @contextmenu.prevent>
    <div id="main" :class="mainClass" ref="main">
      <div id="nav_bar" :class="{ animation: isAnimation }">
        <Card>
          <OptionItem v-for="option in options.filter((item) => { return item.href != undefined })" :option="option" />
        </Card>
        <Library />
      </div>
      <div id="resize" ref="resize"></div>
      <div id="main_content" :class="{ animation: isAnimation }" ref="mainContent">
        <Card id="main_card" @scroll="handleScroll">
          <HudDetail />
          <RouterView class="router" />
        </Card>
      </div>
    </div>
    <Media v-show="mediaStore.show" />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'

import { useMediaStore } from '@/stores/mediaStore';
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'
import { useHudStore } from '@/stores/hudStore'

import Card from '@/components/Card.vue';
import OptionItem from '@/components/navbar/OptionItem.vue';
import Library from "@/components/navbar/Library.vue";
import Media from '@/components/Media.vue';
import LibraryItem from '@/components/navbar/LibraryItem.vue';
import HudDetail from '@/components/hud/HudDetail.vue';

export default {
  setup() {
    const appStore = useAppStore()
    const mediaStore = useMediaStore()
    const stateStore = useStateStore()
    const hudStore = useHudStore()
    return { appStore, mediaStore, stateStore, hudStore }
  },
  mounted() {
    this.appStore.axios = this.$axios
    this.reconnection()
    this.appStore.setRouter(this.$router, this.$route);
    let resize = this.$refs.resize;
    const that = this;
    document.onmousedown = this.appStore.mouseListent;
    resize.onmousedown = function (e) {
      var startX = e.clientX;
      resize.left = resize.offsetLeft - 7;
      document.onmousemove = function (e) {
        that.moveLen = resize.left + (e.clientX - startX);
        resize.style.left = that.moveLen;
        if (that.moveLen < 10 * 16 && that.stateStore.layoutExtendState) {
          that.moveLen = 4.5 * 16
          that.stateStore.closeLayoutExtend()
        } else if (that.moveLen > 12 * 16 && !that.stateStore.layoutExtendState) {
          that.moveLen = 16 * 16
          that.stateStore.openLayoutExtend()
        }
        if (that.moveLen > 16 * 16) {
          that.isAnimation = false
        }
        if (that.stateStore.layoutExtendState && that.moveLen < 16 * 16) {
          that.moveLen = 16 * 16
        } else if (!that.stateStore.layoutExtendState && that.moveLen > 4.5 * 16) {
          that.moveLen = 4.5 * 16
        }
      }
      document.onmouseup = function (evt) {
        document.onmousemove = null;
        document.onmouseup = null;
        resize.releaseCapture && resize.releaseCapture();
      }
      resize.setCapture && resize.setCapture();
    }
  },
  data() {
    return {
      options: [
        {
          position: true,
          title: "主页",
          true: new URL("./assets/ic_home_true.svg", import.meta.url).href,
          false: new URL("./assets/ic_home_false.svg", import.meta.url).href,
          href: "/"
        },
        {
          position: false,
          title: "搜索",
          true: new URL("./assets/ic_search_true.svg", import.meta.url).href,
          false: new URL("./assets/ic_search_false.svg", import.meta.url).href,
          href: "/search"
        }
      ],
      moveLen: 16 * 16,
      isAnimation: true,
    }
  },
  methods: {
    reconnection() {
      this.$axios({
        method: "POST",
        url: "/user/reconnection",
      }).then((res) => {
        if (res.data.status) {
          this.appStore.setProfile(res.data.data)
        }
      });
    },
    handleScroll(e) {
      let srcE = e.srcElement
      this.hudStore.setRouterScroll(srcE)
    }
  },
  computed: {
    mainClass() {
      return {
        'main_full': !this.mediaStore.show,
        'main_filter_media': this.mediaStore.show
      }
    }
  },
  watch: {
    'stateStore.layoutExtendState': function (newVal) {
      this.isAnimation = true
      if (newVal && this.moveLen < 16 * 16) {
        this.moveLen = 16 * 16
      } else if (!newVal && this.moveLen > 4.5 * 16) {
        this.moveLen = 4.5 * 16
      }
    }
  },
  components: { RouterView, Card, OptionItem, Library, Media, LibraryItem, HudDetail }
}
</script>

<style scoped>
* {
  user-select: none;
}

#main {
  width: 100vw;
  min-width: 62rem;
  display: flex;
  padding: 0.5rem;
  transition: all .2s linear;
}

#resize {
  width: 2px;
  margin-right: 1px;
  margin-left: 0.25rem;
  cursor: w-resize;
}

#resize:hover {
  background-color: #4c4c4c;
}

.main_full {
  height: 100vh;
}

.main_filter_media {
  height: calc(100vh - 5rem);
}

.animation {
  transition: ease-in-out .25s;
}

#nav_bar {
  width: 16rem;
  min-width: 4.5rem;
  width: v-bind("moveLen + 'px'");
}

#main_content {
  width: v-bind("'calc(100% - 7px - ' + moveLen + 'px)'");
  min-width: 40vw;
}

#main_card {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.router {
  position: relative;
  z-index: 0;
}
</style>
