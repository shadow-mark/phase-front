import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useHudStore = defineStore("hud", {
    state: () => ({
        routerScroll: Object,
        // keyframesHight: 20 * 16,
        keyframesHight: {
            option: 24 * 16,
            opacity: {
                start: 4 * 16,
                end: 16 * 16,
            },
        },
        themeColor: "",
    }),
    actions: {
        setThemeColor(value) {
            this.themeColor = value;
        },
        setRouterScroll(value) {
            this.routerScroll = {
                scrollTop: value.scrollTop,
                offsetHeight: value.offsetHeight,
                scrollHeight: value.scrollHeight,
            };
        },
        linearMap(fromX, fromY, toX, toY, now) {
            if (now < fromX) return toX;
            else if (now > fromY) return toY;
            let weight = (now - fromX) / (fromY - fromX);
            return (toY - toX) * weight;
        },
    },
    getters: {
        hudOpacity() {
            return this.routerScroll.scrollTop
                ? this.linearMap(
                      this.keyframesHight.opacity.start,
                      this.keyframesHight.opacity.end,
                      0,
                      1,
                      this.routerScroll.scrollTop
                  )
                : 0;
        },
        hudBackgroundColor() {
            return this.themeColor !== ""
                ? "rgb(" + this.themeColor + ")"
                : "none";
        },
        hudOptionShow() {
            return this.routerScroll.scrollTop >= this.keyframesHight.option;
        },
    },
});
