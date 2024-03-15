import { defineStore } from "pinia";

export const useMediaStore = defineStore("media", {
    state: () => ({
        index: -1,
        type: "",
        id: -1,
        list: [],
    }),
    actions: {
        clear() {
            this.type = "";
            this.id = -1;
            this.list.splice(0, this.list.length);
        },
        set(type, id, list) {
            if (this.type !== type || this.id !== id) {
                this.type = type;
                this.id = id;
            }
            this.list = list;
        },
        add(value) {
            const index = this.list.findIndex((it) => it.id === value.id);
            if (index === -1) {
                this.list = [value];
                this.list.push(value);
            } else {
                this.index = index;
            }
        },
        setFilesByIndex(index, value) {
            this.list[index].files = value;
            this.list[index].status = true;
        },
        setFileById(id, value) {
            const index = this.list.findIndex((it) => it.id === id);
            if (index === -1) return
            this.setFilesByIndex(index, value);
        },
        setSelectedByIndex(index, value) {
            this.list[index].selected = value;
        },
        setSelectedById(id, value) {
            const index = this.list.findIndex((it) => it.id === id);
            if (index === -1) return
            this.setSelectedByIndex(index, value);
        },
    },
    getters: {
        show() {
            return this.index !== -1;
        },
    },
});
