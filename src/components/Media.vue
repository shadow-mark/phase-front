<template>
    <div id="media_bar">
        <div id="media_surface" v-if="mediaStore.isShow">
            <div class="img_clip">
                <Cover :src="mediaStore.img" :position="mediaStore.position" :alt="mediaStore.nowMedia.title" />
            </div>
            <div id="media_detail">
                <div class="media_title">{{ mediaStore.nowMedia.title }}</div>
                <div class="media_author">null</div>
                <div class="masking"></div>
            </div>
        </div>
        <div id="media-controller-box">
            <div id="media-button-box">
                <div class="center">
                    <img src="../assets/ic_media_back.svg" @click="mediaStore.mediaBack" alt="上一首">
                    <img src="../assets/ic_pause.svg" :hidden="mediaStore.paused" alt="暂停"
                        @click="mediaStore.playOrPause(false)">
                    <img src="../assets/ic_play.svg" :hidden="!mediaStore.paused" alt="播放"
                        @click="mediaStore.playOrPause(false)">
                    <img src="../assets/ic_media_next.svg" @click="mediaStore.mediaNext" alt="下一首">
                </div>
            </div>
            <div id="media-meter-box">
                <div class="center">
                    <div>{{ mediaStore.currentTimeText }}</div>
                    <input class="media-time" type="range" @change="mediaStore.timeChange" min="0" :max="100"
                        :value="mediaStore.currentTime / mediaStore.duration * 100">
                    <div>{{ mediaStore.durationText }}</div>
                </div>
            </div>
        </div>
        <div id="media-other">
        </div>
        <audio @timeupdate="mediaStore.timeupdate" @canplay="mediaStore.canplay" @pause="mediaStore.paused = true"
            @play="mediaStore.paused = false" @ended="mediaStore.overAudio" ref="media" />
    </div>
</template>

<script>
import { useMediaStore } from "../stores/mediaStore"

import Cover from '@/components/Cover.vue';

export default {
    setup() {
        const mediaStore = useMediaStore()
        return { mediaStore }
    },
    mounted() {
        this.$nextTick(() => {
            this.mediaStore.findMediaView(this.$refs.media)
        })
    },
    components: { Cover }
}
</script>

<style scoped>
#media_bar {
    height: 5rem;
    min-width: 62rem;
    padding: .5rem 1rem 1rem 1rem;
    display: flex;
    user-select: none;
}

#media_surface {
    position: relative;
    width: 25%;
    display: flex;
}

.masking {
    position: absolute;
    width: .5rem;
    height: 100%;
    top: 0;
    right: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, .2), var(--color-background));
}

.img_clip {
    border-radius: .25rem;
    height: 3.5rem;
    width: 3.5rem;
    overflow: hidden;
}

#media_detail {
    line-height: 1.75rem;
    padding: .75rem 0 .75rem .75rem;
    width: calc(100% - 3.5rem);
}

.media_title {
    line-height: 1rem;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
}

.media_author {
    color: #b3b3b3;
    cursor: pointer;
    line-height: 1rem;
}

.media_author:hover {
    text-decoration: underline;
    color: var(--color-text);
}

#media-controller-box {
    width: 50%;
    margin: auto;
}

#media-button-box,
#media-meter-box {
    display: flex;
    margin: 0rem 0 0.25rem 0;
}

.center {
    display: flex;
    margin: auto;
}

.center img {
    height: 2rem;
    width: 2rem;
    margin: 0 .7rem;
    /* cursor: pointer; */
}

.center img:hover {
    transform: scale(1.05);
}

#media-other {
    width: 25%;
}

.media-time {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: -webkit-linear-gradient(#fff, #fff) no-repeat, #4d4d4d;
    border-radius: 0.2rem;
    width: 35vw;
    min-width: 22rem;
    height: 0.4rem;
    margin: 0.65rem 1rem 0 1rem;
    background-size: v-bind("mediaStore.progress + '%'");
}

.media-time:hover {
    background: -webkit-linear-gradient(#1db954, #1db954) no-repeat, #4d4d4d;
}

.media-time::-webkit-slider-thumb {
    -webkit-appearance: none;
}

.media-time:hover::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: .75rem;
    width: .75rem;
    background: #fff;
    border-radius: 50%;
    border: solid 1px #ddd;
}
</style>