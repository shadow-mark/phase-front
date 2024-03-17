<template>
    <ContextMenu class="test" ref="menu">
        <template #text>
            <div id="resource_item_content">
                <div class="masking"></div>
                <div class="item_detail">
                    <div class="item_index">
                        {{ index + 1 }}
                    </div>
                    <div class="item_title">
                        <div class="title_img">
                            <Cover :src="img" :position="position" :alt="item.title" />
                        </div>
                        <div class="title_text">{{ item.title }}</div>
                    </div>
                </div>
                <div class="item_user">
                    {{ profile.nickname }}
                </div>
                <div class="space"></div>
                <div class="add_box" @click="openDialog">
                    <div v-if="item.selected.length === 0" class="img add_img"></div>
                    <div v-else class="img done_img"></div>
                </div>
                <div class="item_time">
                    {{ date }}
                </div>
                <DropDown class="option_box" ref="option" closeAfterSelection>
                    <template #text>
                        <div class="img option_img"></div>
                    </template>
                    <template #extend>
                        <ResourceMenu class="option_menu" :resource="item" :index="index" :isUpload="isUpload"
                            v-bind="$attrs" @mark="mark" />
                    </template>
                </DropDown>
            </div>
        </template>
        <template #menu>
            <ResourceMenu :resource="item" :index="index" :isUpload="isUpload" v-bind="$attrs" @mark="mark" />
        </template>
    </ContextMenu>

</template>

<script>
import { useAppStore } from "../../stores/appStore";
import { useStateStore } from "../../stores/stateStore";
import { useMediaStore } from "../../stores/mediaStore";

import { setSelected } from "../../utils/ResourceUtil";

import Cover from "@/components/Cover.vue"
import DropDown from '@/components/DropDown.vue';
import ResourceMenu from '@/components/resource/ResourceMenu.vue'
import ContextMenu from '@/components/menu/ContextMenu.vue';


export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        const mediaStore = useMediaStore()
        return { appStore, stateStore, mediaStore }
    },
    props: {
        item: {},
        index: 0,
        isUpload: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            profile: {}
        }
    },
    computed: {
        img() {
            return this.item.cover && this.item.cover !== ""
                ? `${this.$axios.defaults.baseURL}/resource/${this.item.id
                }/cover/download/${this.item.cover.split("~")[0]}`
                : undefined;
        },
        position() {
            let position = [100, 0, 0]
            let item = this.item
            if (item.cover && item.cover != "") {
                position = item.cover.split("~")[1].split(";").map((it) => {
                    return parseInt(it)
                })
            }
            return {
                size: position[0],
                x: position[1],
                y: position[2],
            }
        },
        focus() {
            return this.$refs.menu.realTextFocus || this.$refs.option.realTextFocus
        },
        date() {
            let timeStr = this.item.time
            const updateTime = new Date(timeStr)
            const nowTime = new Date()
            let diff = (nowTime.getTime() - updateTime.getTime()) / 1000
            const mode = [1, 60, 60, 24, 7, 4]
            const suffix = ["秒","分", "时", "天", "周", "月"]
            let index = 0
            for (; diff > mode[index]; index++) {
                diff /= mode[index]
            }
            return `${Math.round(diff)}${suffix[index - 1]}前`
        }
    },
    methods: {
        openDialog() {
            this.stateStore.setResourceMarkDialogCallback((res) => {
                setSelected(this.item, res)
                this.mediaStore.setSelectedById(this.item.id, this.item.selected)
            })
            this.stateStore.setResourceMarkDialogItem(this.item)
            this.stateStore.openResourceMarkDialog()
        },
        mark() {
            this.openDialog()
        },
    },
    watch: {
        "item": {
            handler(newVal) {
                if (newVal.userId === undefined) return
                this.profile = this.appStore.getUserById(newVal.userId)
            },
            immediate: true
        }
    },
    components: { Cover, DropDown, ResourceMenu, ContextMenu }
}
</script>

<style scoped>
#resource_item_content {
    position: relative;
    height: 4rem;
    display: flex;
}

.test:focus .masking {
    background-color: aliceblue;
}

#resource_item_content:hover .masking {
    display: flex;
}

#resource_item_content:hover .img {
    display: flex;
}

.masking {
    display: v-bind("focus ? 'flex' : 'none'");
    position: absolute;
    width: 100%;
    height: 4rem;
    border-radius: .35rem;
    background-color: v-bind("focus ? 'rgba(0, 0, 0, .6)' : 'rgba(0, 0, 0, .2)'");
    z-index: -1;
}

.item_detail {
    display: flex;
    width: 40%;
}

.item_index,
.item_title {
    margin: auto 0;
    display: flex;
    line-height: 4rem;
}

.item_index {
    width: 2.5rem;
    text-align: center;
    display: block;
}

.item_title {
    width: calc(100% - 2.5rem)
}

.title_img {
    border-radius: .25rem;
    overflow: hidden;
    width: 2.5rem;
    height: 2.5rem;
}

.title_text {
    width: calc(100% - 3rem);
    line-height: 2.5rem;
    margin-left: .5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.item_user {
    margin: auto 0;
    margin-left: 1rem;
    width: 20%;
}

.space {
    margin-left: auto;
}

.item_time {
    margin: auto 0;
    width: 6rem;
    text-align: center;
}

.add_box,
.option_box {
    display: flex;
    height: 4rem;
}

.add_box {
    width: 2rem;
}

.option_box {
    width: 2.5rem;
}

.loading {
    margin: auto;
    width: 1.25rem;
    height: 1.25rem;
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

.img {
    display: v-bind("focus ? 'flex' : 'none'");
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

.option_img {
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(@/assets/ic_options_horizontal.svg);
}

.mark_menu {
    position: absolute;
    right: 5rem;
}

.option_menu {
    position: absolute;
    top: 3rem;
    right: .25rem;
}
</style>