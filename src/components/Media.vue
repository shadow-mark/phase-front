<template>
    <div id="media_bar">
        <div id="media_surface" v-if="mediaStore.show">
            <div class="img_clip">
                <Cover :src="img" :position="position" :alt="nowMedia.title" />
            </div>
            <div id="media_detail">
                <div class="media_title" @click="test">{{ nowMedia.title }}</div>
                <div class="media_author">null</div>
            </div>
            <div class="add_box" @click="openDialog">
                <div v-if="nowMedia.selected.length === 0" class="img add_img"></div>
                <div v-else class="img done_img"></div>
            </div>
        </div>
        <div id="media-controller-box">
            <div id="media-button-box">
                <div class="center">
                    <img src="../assets/ic_media_back.svg" @click="back" alt="上一首">
                    <img src="../assets/ic_pause.svg" :hidden="state.paused" alt="暂停" @click="pause">
                    <img src="../assets/ic_play.svg" :hidden="!state.paused" alt="播放" @click="play">
                    <img src="../assets/ic_media_next.svg" @click="next" alt="下一首">
                </div>
            </div>
            <div id="media-meter-box">
                <div class="center">
                    <div>{{ currentTimeText }}</div>
                    <input class="media-time" type="range" @change="timeChange" min="0" max="100"
                        :value="state.currentTime / state.duration * 100">
                    <div>{{ durationText }}</div>
                </div>
            </div>
        </div>
        <div id="media-other">

        </div>
        <audio @timeupdate="timeUpdate" @canplay="canPlay" @pause="state.paused = true" @play="state.paused = false"
            @ended="overAudio" ref="media" />
        <ResourceMarkDialog />
    </div>
</template>

<script>
import { useStateStore } from "../stores/stateStore";
import { useMediaStore } from "../stores/mediaStore"

import { getPosition, getResourceCover, getMediaFile } from '@/utils/PathConversion';
import { setSelected } from "../utils/ResourceUtil";

import Cover from '@/components/Cover.vue';
import ResourceMarkDialog from "./resource/ResourceMarkDialog.vue";

export default {
    setup() {
        const stateStore = useStateStore()
        const mediaStore = useMediaStore()
        return { stateStore, mediaStore }
    },
    mounted() {
        this.$nextTick(() => {
            this.media = this.$refs.media
        })
    },
    data() {
        return {
            media: Object,
            option: {
                mode: 1,
                volume: 1,
                full: false
            },
            state: {
                paused: false,
                currentTime: -1,
                duration: -1
            },
            indexs: [],
        }
    },
    computed: {
        currentTimeText() {
            return this.timeTextFormat(this.state.currentTime);
        },
        durationText() {
            return this.timeTextFormat(this.state.duration);
        },
        nowMedia() {
            if (this.mediaStore.index !== -1) {
                return this.mediaStore.list[this.mediaStore.index]
            }
        },
        img() {
            return getResourceCover(this.nowMedia.id, this.nowMedia.cover, this.$axios)
        },
        position() {
            return getPosition(this.nowMedia.cover)
        },
        progress() {
            if (this.state.duration === -1) return 0;
            else return (this.state.currentTime / this.state.duration) * 100 + 0.2;
        },
    },
    methods: {
        setMedia(value) {
            this.media.src = getMediaFile(value, this.$axios)
            this.play()
        },
        canPlay() {
            this.state.duration = this.media.duration;
        },
        timeUpdate() {
            this.state.currentTime = this.media.currentTime;
        },
        timeTextFormat(value) {
            if (value === -1) {
                return "-:--";
            } else {
                let hour = parseInt(value / 60 / 60);
                let min = parseInt(value / 60 - hour * 60);
                let second = parseInt(value % 60);
                return (
                    (hour != 0 ? hour + ":" : "") +
                    (min < 10 && hour != 0 ? "0" + min : min) +
                    ":" +
                    (second < 10 ? "0" + second : second)
                );
            }
        },
        play() {
            this.media.play()
        },
        pause() {
            this.media.pause()
        },
        next() {
            if (this.mediaStore.index < this.mediaStore.list.length) {
                this.pause()
                this.mediaStore.index++
                this.indexs.push(this.mediaStore.index)
            }
        },
        back() {
            if (this.indexs.length <= 0) return
            this.pause()
            this.mediaStore.index = this.indexs.pop()
        },
        timeChange(event) {
            this.state.currentTime = (event.target.value / 100) * this.state.duration
            this.media.currentTime = this.state.currentTime
        },
        overAudio() {
            if (this.mode === 1 || this.mode === 2) {
                this.next();
            } else if (this.mode === 0) {
                this.state.currentTime = 0
                this.media.currentTime = 0
                this.play()
            }
        },
        openDialog() {
            this.stateStore.setResourceMarkDialogCallback((res) => {
                setSelected(this.nowMedia, res)
            })
            this.stateStore.setResourceMarkDialogItem(this.nowMedia)
            this.stateStore.openResourceMarkDialog()
        }
    },
    watch: {
        "mediaStore.list": {
            handler(newVal) {
                if (newVal.length === 0) {
                    this.mediaStore.index = -1
                    this.indexs = []
                }
                else this.next()
            },
            immediate: true,
        },
        nowMedia: {
            handler(newVal) {
                if (newVal.status === undefined || newVal.status === false) {
                    this.$axios({
                        url: `/media/get/resource/${newVal.id}`
                    }).then((res) => {
                        if (res.data.status) {
                            this.mediaStore.setFileById(newVal.id, res.data.data.files)
                            this.setMedia(newVal)
                        }
                    })
                } else {
                    this.setMedia(newVal)
                }
            },
            deep: false
        }
    },
    components: { Cover, ResourceMarkDialog }
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

.img_clip {
    border-radius: .25rem;
    height: 3.5rem;
    width: 3.5rem;
    overflow: hidden;
}

#media_detail {
    line-height: 1.75rem;
    padding: .75rem 0 .75rem .75rem;
    max-width: calc(100% - 7rem);
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

.add_box {
    width: 4rem;
    display: flex;
    height: 3.5rem;
}

.loading {
    margin: auto;
    width: 1.25rem;
    height: 1.25rem;
    border: 3px solid #fff;
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

.img {
    margin: auto;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
}

.add_img {
    width: 1.15rem;
    height: 1.15rem;
    background-image: url(@/assets/ic_resource_add.svg);
}

.done_img {
    width: 1rem;
    height: 1rem;
    background-image: url(@/assets/ic_resource_done.svg);
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
    background-size: v-bind("progress + '%'");
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