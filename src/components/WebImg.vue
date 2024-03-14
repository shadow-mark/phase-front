<template>
    <div id="img_box" v-if="src">
        <div class="img" :alt="alt"></div>
        <div v-show="false">
            <img :src="src" :alt="alt" ref="img" @load="getThemeColor">
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import ColorThief from "colorthief";

import { useAppStore } from "../stores/appStore";

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    props: {
        src: {
            type: String,
            default: new URL("@/assets/media_surface.jpg", import.meta.url).href
        },
        alt: {
            type: String,
            default: ""
        },
        caculation: {
            type: Boolean,
            default: false
        },
        position: {
            type: Object,
            default: {
                size: 100,
                x: 0,
                y: 0
            }
        }
    },
    data() {
        return {
            divSrc: "",
            themeColor: [],
            ratio: 1
        }
    },
    methods: {
        getThemeColor() {
            let img = this.$refs.img
            this.ratio = img.height / img.width
            if (this.caculation) {
                this.$nextTick(() => {
                    let colorthief = new ColorThief()
                    let canvas = this.$refs.canvas
                    let ctx = canvas.getContext("2d")
                    let quality = 1
                    let pixel = img.width * img.height / 1024 / 1024
                    if (pixel < 3) quality = 1
                    else if (pixel < 10) quality = .5
                    else quality = .1
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    let data = canvas.toDataURL("image/jpeg", quality)
                    this.divSrc = data
                    this.themeColor = colorthief.getColor(img)
                    this.appStore.setThemeColor(this.themeColor)
                })
            }
        }
    },
    watch: {
        src: {
            handler(newVal) {
                this.divSrc = newVal
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
#img_box {
    height: 100%;
    width: 100%;
}

.img {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: v-bind("ratio >= 1 ? position.size + '% auto' : 'auto ' + position.size + '%'");
    background-position-x: v-bind("position.x + '%'");
    background-position-y: v-bind("position.y + '%'");
    background-image: v-bind("'url(' + divSrc + ')'");
}
</style>