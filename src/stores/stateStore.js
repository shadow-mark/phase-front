import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStateStore = defineStore("state", {
    state: () => ({
        layoutExtendState: true,
        signDialogState: false,
        resourceMarkDialog: {
            state: false,
            item: undefined,
            selected: [],
            callback: () => {},
        },
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
        openResourceMarkDialog() {
            this.resourceMarkDialog.state = true;
        },
        closeResourceMarkDialog() {
            this.resourceMarkDialog.state = false;
        },
        setResourceMarkDialogItem(value) {
            this.resourceMarkDialog.item = value;
        },
        setResourceMarkDialogSelected(value) {
            this.resourceMarkDialog.selected = value;
        },
        setResourceMarkDialogCallback(callback) {
            this.resourceMarkDialog.callback = callback;
        },
    },
});
