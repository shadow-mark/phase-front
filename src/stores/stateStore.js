import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStateStore = defineStore("state", {
    state: () => ({
        layoutExtendState: true,
        signDialogState: false
    }),
    actions: {
        reversalLayoutExtend() {
            this.layoutExtendState = !this.layoutExtendState;
        },
        openLayoutExtend() {
            this.layoutExtendState = true;
        },
        closeLayoutExtend() {
            this.layoutExtendState = false;
        },
        reversalSignDialog() {
            this.signDialogState = !this.signDialogState;
        },
        openSignDialog() {
            this.signDialogState = true;
        },
        closeSignDialog() {
            this.signDialogState = false;
        },
    },
});
