<template>
    <div class="loading_box" v-if="loading">
        <div class="loading"></div>
    </div>
    <div v-else>
        <div id="template_content">
            <div id="head" class="interval">
                <slot name="head"></slot>
            </div>
            <div class="gradient"></div>
            <teleport to='.hud_option_extend'>
                <slot name="option"></slot>
            </teleport>
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore';
import { useHudStore } from '@/stores/hudStore'

import ImageEdit from '@/components/edit/ImageEdit.vue';
import HudDetail from '@/components/hud/HudDetail.vue';

export default {
    setup() {
        const appStore = useAppStore();
        const stateStore = useStateStore()
        const hudStore = useHudStore();
        return { appStore, stateStore, hudStore };
    },
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        item() {
            return {
                type: "user",
                id: this.appStore.profile.uid,
                text: this.appStore.profile.nickname,
                img: this.appStore.profile.avatar
            }
        },
        themeColor() {
            let color = this.appStore.themeColor
            let values = color[0] + "," + color[1] + "," + color[2]
            this.hudStore.setThemeColor(values)
            return "rgb(" + values + ")"
        }
    },
    components: { ImageEdit, HudDetail }
}
</script>

<style scoped>
#template_content {
    transition: all;
}

#head {
    display: flex;
    height: 20rem;
    padding-top: 5rem;
    /* padding-bottom: 2rem; */
    background: v-bind("themeColor !== undefined ? 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%),' + themeColor : 'none'");
}

.gradient {
    height: 17rem;
    position: absolute;
    width: 100%;
    background: v-bind("themeColor !== undefined ? 'linear-gradient(rgba(0, 0, 0, .6) 0,var(--color-background-mute) 100%),' + themeColor : 'none'");
    z-index: -1;
}

.interval {
    padding: 0rem 1.5rem
}

#detail_box {
    margin: auto 0 0 1rem;
}

.detail_tiitle {
    font-weight: 400;
}

.detail_username {
    font-size: 5rem;
    line-height: 5.5rem;
    margin-bottom: 1rem;
    margin-top: -.5rem;
    word-break: break-word;
    cursor: pointer;
}

#avatar_box {
    width: 13rem;
    height: 13rem;
    box-shadow: 0px 0px .75rem black;
}

.loading_box {
    height: 100%;
    width: 100%;
    display: flex;
}

.loading {
    margin: auto;
    width: 3rem;
    height: 3rem;
    border: 3px solid #000;
    border-top-color: transparent;
    border-radius: 100%;
    animation: circle infinite 0.75s linear;
}

@keyframes circle {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>