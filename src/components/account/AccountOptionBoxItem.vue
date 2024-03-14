import { useAppStore } from '@/stores/appStore';
<template>
    <div class="slide" @click="go">
        <div class="button">
            <div class="icon_box left_icon_box">
                <img :src="img" alt="img">
            </div>
            <div class="title">{{ text }}</div>
            <div class="icon_box right_icon_box">
                <img src="../../assets/ic_right.svg" alt="go">
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from "@/stores/appStore"

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    props: {
        text: String,
        href: {
            type: String,
            default: "#"
        },
        img: {
            type: String,
            default: "#"
        }
    },
    methods: {
        go() {
            if (this.href !== "#" || this.href !== undefined) this.appStore.routerPush(this.href)
        }
    }
}
</script>

<style scoped>
.button {
    display: flex;
    padding: 1rem 1rem;
}

.slide {
    width: 100%;
    border-radius: .6rem;
    position: relative;
    overflow: hidden;
    z-index: 0;
    transition: .25s;
    cursor: pointer;
}

.slide::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 0;
    height: 100%;
    left: 0;
    border-radius: .6rem;
    background-color: #000000;
    transition: ease-in-out .25s;
}

.slide:hover::before {
    width: 100%;
}

.title {
    line-height: 2rem;
}

.icon_box {
    height: 2rem;
    width: 2rem;
    border-radius: 25%;
    display: flex
}

.left_icon_box {
    padding: .25rem;
    background-color: var(--color-background-soft);
    margin-right: .5rem;
}

.right_icon_box {
    margin-left: auto;
}

img {
    width: 1rem;
    margin: auto;
}

.right_icon_box>img {
    width: 2rem;
}
</style>