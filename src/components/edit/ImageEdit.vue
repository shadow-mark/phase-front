<template>
    <DropDown clickRight>
        <template #text>
            <div id="avatar_box" @dragover="fileDragover">
                <div class="img_content">
                    <WebImg v-if="item.img" :src="item.img" :caculation="caculation" alt="avatar"
                        :position="position" />
                    <div v-else-if="item.text" class="no_image">
                        {{ item.text[0].toUpperCase() }}
                    </div>
                    <WebImg v-else :caculation="caculation" alt="avatar" />
                </div>
                <label class="shadow" v-if="edit" @drop="fileDrop" @dragleave="fileDragleave">
                    <div class="tip">
                        <div class="tip_img">
                            <img class="img" src="../../assets/ic_edit.svg" alt="">
                        </div>
                        <div class="tip_text">选择图片</div>
                    </div>
                    <input id="upload" type="file" accept="image/*,.pdf" @change="handleFileChange">
                </label>
            </div>
        </template>

        <template #extend v-if="extend && item.position">
            <div id="image_edit_menu" @click.right.stop.prevent>
                <div class="form_item">
                    <span class="text">size</span>
                    <Slider class="slider" v-model="item.position.size" :minValue="100" :maxValue="200" dispersed
                        realTime />
                </div>
                <div class="form_item">
                    <span class="text">x</span>
                    <Slider class="slider" v-model="item.position.x" :minValue="0" :maxValue="100" dispersed realTime />
                </div>
                <div class="form_item">
                    <span class="text">y</span>
                    <Slider class="slider" v-model="item.position.y" :minValue="0" :maxValue="100" dispersed realTime />
                </div>
            </div>
        </template>
    </DropDown>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'

import WebImg from '@/components/WebImg.vue'
import DropDown from '@/components/DropDown.vue'
import Slider from '@/components/edit/Slider.vue';
import Button from '@/components/Button.vue';

export default {
    setup() {
        const appStore = useAppStore();
        const stateStore = useStateStore();
        return { appStore, stateStore };
    },
    props: {
        item: {},
        caculation: {
            type: Boolean,
            default: false
        },
        edit: {
            type: Boolean,
            default: false
        },
        extend: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            shadowVisible: false,
            position: {
                size: 100,
                x: 0,
                y: 0
            }
        }
    },
    emits: ["checkFile"],
    methods: {
        handleFileChange(e) {
            const file = e.target.files[0]
            this.$emit("checkFile", file)
        },
        fileDragover(e) {
            e.preventDefault()
            this.shadowVisible = true
        },
        fileDragleave(e) {
            e.preventDefault()
            if (e.target.className === 'shadow' && e.relatedTarget.className !== "img" && e.relatedTarget.className !== "tip_text") {
                this.shadowVisible = false
            }
        },
        fileDrop(e) {
            e.preventDefault()
            this.shadowVisible = false
            const file = e.dataTransfer.files[0] // 获取到第一个上传的文件对象
            this.$emit("checkFile", file)
        },
    },
    watch: {
        item: {
            handler(newVal) {
                if (newVal.position) {
                    this.position = { ...newVal.position }
                }
            },
            immediate: true,
            deep: true
        }
    },
    components: { WebImg, DropDown, Slider, Button }
}
</script>

<style scoped>
#avatar_box {
    width: 100%;
    height: 100%;
    cursor: v-bind("canEdit ? 'pointer' : ''");
    overflow: hidden;
    border-radius: v-bind("(item.type === 'collection' || item.type === 'resource') ? '10%' : '50%'");
    box-shadow: 0px 0px .75rem black;
    user-select: none;
}

.img_content {
    width: 100%;
    height: 100%;
    display: flex;
    background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}

.shadow {
    display: v-bind("shadowVisible ? 'flex' : 'none'");
    width: 100%;
    height: 100%;
    position: relative;
    bottom: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 0;
    cursor: pointer;
}

#upload {
    display: none;
}

.tip {
    width: 40%;
    margin: auto;
}

.tip_text {
    text-align: center;
}

#avatar_box:hover .shadow {
    display: flex;
}

.no_image {
    font-size: 9rem;
    margin: auto;
    line-height: 0;
}

img {
    width: 100%;
    height: 100%;
}

#image_edit_menu {
    position: relative;
    width: 100%;
    top: 1rem;
    padding: .5rem 1rem;
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--color-background-soft);
}

.form_item {
    display: flex;
    margin: .5rem 0;
}

.text {
    margin-right: 1rem;
    text-align: center;
    width: 2rem;
}

.slider {
    margin: auto;
}
</style>