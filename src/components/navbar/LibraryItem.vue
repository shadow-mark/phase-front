<template>
    <div class="library-item" :class="libraryItemClass" @click="go">
        <div class="library-item-img-box">
            <div id="upload_img_box" :class="playImgClass" v-if="item.type === 'upload'">
                <img class="upload_img" :src="item.img" :alt="item.text">
            </div>
            <div class="img" :class="playImgClass" v-else-if="item.img !== ''">
                <WebImg :src="imgUrl" :position="position" alt="cover" />
            </div>
            <div :class="playImgClass" class="img empty" v-else-if="item.img === ''">
                <div class="empty_text" v-if="item.text">
                    {{ item.text[0].toUpperCase() }}
                </div>
            </div>
        </div>
        <div class="library-item-title">
            {{ item.text }}
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'

import { getPosition } from '@/utils/PathConversion';

import WebImg from '@/components/WebImg.vue'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    props: {
        item: {
            type: Object,
            default: {}
        },
        isDrag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            href: "#",
            show: false
        }
    },
    mounted() {
        this.init()
    },
    computed: {
        libraryItemClass() {
            return {
                "head": this.item.position && this.item.position != undefined,
                "foot": !this.item.position && this.item.position != undefined,
                "check": this.show
            }
        },
        playImgClass() {
            return {
                'collection-img': this.item.type === 'collection' || this.item.type === 'upload',
                'user-img': this.item.type === 'user',
            }
        },
        imgUrl() {
            if (this.item.img === '') return ""
            const img = this.item.img.split("~")[0]
            if (this.item.type === "user") {
                return `${this.$axios.defaults.baseURL}/profile/${this.item.id}/avatar/download/${img}`
            } else if (this.item.type === "collection") {
                return `${this.$axios.defaults.baseURL}/collection/${this.item.id}/cover/download/${img}`
            } else if (this.item.type === "upload") {
                return this.item.img
            }
        },
        position() {
            return getPosition(this.item.img)
        }
    },
    methods: {
        init() {
            if (this.item.type === "user") {
                this.href = `/user/${this.item.id}`
            } else if (this.item.type === "collection") {
                this.href = `/collection/${this.item.id}`
            } else if (this.item.type === "upload") {
                this.href = `/resource/upload`
            }
            this.check(this.$route.fullPath)
        },
        go() {
            this.appStore.routerPush(this.href)
        },
        check(value) {
            if (this.href === "#") this.show = false
            else if (value === this.href) {
                this.show = true
            } else {
                this.show = false
            }
        }
    },
    watch: {
        "$route.fullPath": function (newVal) {
            this.check(newVal)
        },
        item: function () {
            this.init()
        }
    },
    components: { WebImg }
}
</script>

<style scoped>
.library-item {
    /* margin: 0 .25rem; */
    height: 4rem;
    /* line-height: 4rem; */
    display: flex;
    overflow: hidden;
    cursor: pointer;
    border-radius: .7rem;
}

.head {
    border-radius: .7rem .7rem 0 0;
}

.foot {
    border-radius: 0 0 .7rem .7rem;
}

.library-item-img-box {
    padding: .5rem;
}

.library-item-title,
.empty {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    margin-block: 0px;
    padding-left: 1rem;
    font-size: 1.2rem;
    font-weight: 700;
    font-family: var(--font-family, CircularSp, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif));
    color: inherit;
    line-height: 4rem;
}

.check {
    background-color: var(--color-background-soft);
}

.img {
    width: 3rem;
    height: 3rem;
}

#upload_img_box {
    width: 3rem;
    height: 3rem;
    padding: .5rem;
    /* background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); */
    background-image: linear-gradient(-225deg, #A8BFFF 0%, #884D80 100%);
}

.upload_img {
    width: 2rem;
    height: 2rem;
}

.empty {
    /* line-height: 4rem; */
    text-align: center;
    font-size: 1.75rem;
    padding: 0;
    display: flex;
    background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}

.collection-img {
    border-radius: .3rem;
    overflow: hidden;
}

.user-img {
    border-radius: 50%;
    overflow: hidden;
}

.library-item:hover {
    background-color: v-bind("isDrag ? '' : 'var(--color-background-soft)'");
}

.empty_text {
    margin: auto;
    line-height: 0;
}
</style>