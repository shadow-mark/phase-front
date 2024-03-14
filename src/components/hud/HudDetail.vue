<template>
    <div id="hud_content">
        <div id="hud" ref="hud">
            <div id="gradient">
                <div class="after_color"></div>
            </div>
            <div class="main">
                <div class="icon_box" :class="{ disabled: !appStore.hasBack }" @click="appStore.routerBack">
                    <img src="../../assets/ic_left.svg" alt="back">
                </div>
                <span class="space" />
                <div class="icon_box" :class="{ disabled: !appStore.hasNext }" @click="appStore.routerNext">
                    <img src="../../assets/ic_right.svg" alt="front">
                </div>
                <span class="space" />
                <div class="hud_option_extend"></div>
                <HudAvatar />
            </div>
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'
import { useHudStore } from '@/stores/hudStore'

import HudAvatar from '@/components/hud/HudAvatar.vue'

export default {
    setup() {
        const appStore = useAppStore();
        const stateStore = useStateStore();
        const hudStore = useHudStore();
        return { appStore, stateStore, hudStore };
    },
    components: { HudAvatar }
}
</script>

<style scoped>
.hud_option_extend {
    transition: all .2s linear;
    opacity: v-bind("hudStore.hudOptionShow ? 1 : 0");
    pointer-events: v-bind("hudStore.hudOptionShow ? '' : 'none'");
    margin: auto 0;
    font-size: 2rem;
}

#gradient {
    /* height: v-bind(offsetHeight); */
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-color: v-bind("hudStore.hudBackgroundColor");
    opacity: v-bind("hudStore.hudOpacity");
}

.after_color {
    background-color: rgba(0, 0, 0, .6);
    height: 100%;
}


#hud_content {
    position: sticky;
    top: 0rem;
    width: 100%;
    height: 0;
    border-radius: .7rem .7rem 0 0;
    z-index: 1;
}

#hud {
    position: relative;
    width: 100%;
    margin: auto;
    padding: 0rem 1.5rem;
}

.main {
    width: 100%;
    height: 4rem;
    display: flex;
}

.icon_box {
    height: 2rem;
    width: 2rem;
    padding: .25rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .6);
    cursor: pointer;
    margin: auto 0;
}

.disabled {
    background-color: var(--color-background-soft);
    cursor: not-allowed;
}

img {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
}

.space {
    width: .5rem;
}
</style>