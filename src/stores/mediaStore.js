import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { getPosition } from "../utils/Position";

export const useMediaStore = defineStore("media", {
    state: () => ({
        axios: Object,
        media: Object,
        paused: true,
        currentTime: -1,
        duration: -1,
        mode: 1, //0:循环播放;1:顺序播放;2:随机播放
        index: 0,
        playQueue: {
            type: undefined,
            id: undefined,
            list: [],
        },
    }),
    actions: {
        findMediaView(value) {
            this.media = value;
        },
        set(value) {
            this.playQueue = value;
            this.index = 0;
            this.media.src = "";
        },
        add(value) {
            this.playQueue.list.push(value);
        },
        addByResourceId(id) {
            const index = this.playQueue.list.findIndex((it) => it.id === id);
            if (index !== -1 && this.playQueue.list[index].file.length > 0)
                return;
            this.axios({
                url: `/media/get/resource/${id}`,
            }).then((res) => {
                if (res.data.status) {
                    if (index === -1) {
                        this.set({
                            list: [res.data.data],
                        });
                        this.playOrPause();
                    } else {
                        this.playQueue.list[index] = res.data.data;
                        this.media.play();
                    }
                }
            });
        },
        playOrPause() {
            if (this.media.paused) {
                if (this.nowMedia.file.length === 0) return;
                this.media.src = `${this.axios.defaults.baseURL}/file/${this.nowMedia.resourceId}/download/${this.nowMedia.file[0]}`;
                this.media.play();
            } else {
                this.media.pause();
            }
        },
        mediaNext() {
            if (this.mode === 0 || this.mode === 1) {
                this.index = (this.index + 1) % this.playQueue.list.length;
            } else if (this.mode === 2) {
                this.index = Math.floor(
                    Math.random() * this.playQueue.list.length
                );
            }
            if (!this.nowMedia.status) {
                this.addByResourceId(this.nowMedia.resourceId);
            } else {
                this.playOrPause();
            }
        },
        mediaBack() {
            this.index = this.index > 0 ? this.index - 1 : 0;
            this.playOrPause();
        },
        timeupdate() {
            this.currentTime = this.media.currentTime;
        },
        canplay() {
            this.duration = this.media.duration;
        },
        overAudio() {
            if (this.mode === 1 || this.mode === 2) {
                this.mediaNext();
            } else if (this.mode === 0) {
                this.playOrPause(false);
            }
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
        timeChange(event) {
            this.media.currentTime = (event.target.value / 100) * this.duration;
        },
    },
    getters: {
        currentTimeText() {
            return this.timeTextFormat(this.currentTime);
        },
        durationText() {
            return this.timeTextFormat(this.duration);
        },
        nowMedia() {
            return this.playQueue.list[this.index];
        },
        progress() {
            if (this.duration === -1) return 0;
            else return (this.currentTime / this.duration) * 100 + 0.2;
        },
        isShow() {
            return this.playQueue.list.length !== 0;
        },
        img() {
            return this.nowMedia.cover
                ? `${this.axios.defaults.baseURL}/resource/${
                      this.nowMedia.resourceId
                  }/cover/download/${this.nowMedia.cover.split("~")[0]}`
                : undefined;
        },
        position() {
            return getPosition(this.nowMedia.cover)
            let position = [100, 0, 0];
            let media = this.nowMedia;
            if (media.cover && media.cover != "") {
                position = media.cover
                    .split("~")[1]
                    .split(";")
                    .map((it) => {
                        return parseInt(it);
                    });
            }
            return {
                size: parseInt(position[0]),
                x: parseInt(position[1]),
                y: parseInt(position[2]),
            };
        },
    },
});
