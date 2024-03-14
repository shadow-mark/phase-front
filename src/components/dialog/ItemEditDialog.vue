<template>
    <Dialog :visible="visible" v-bind="$attrs" isMask>
        <Card id="item_edit_dialog">
            <div class="title_box">
                <div class="title">
                    资料
                </div>
            </div>
            <div class="detail_box">
                <ImageEdit class="img_edit" :item="item" @checkFile="checkFile" edit extend />
                <div class="data_box" v-if="item.type === 'user'">
                    <EditText class="edit_text" v-model="item.text" placeholder="用户名" />
                    <Button @click="save" :loading="loading">
                        储存
                    </Button>
                </div>
                <div class="data_box" v-else>
                    <EditText class="edit_text" v-model="item.text" placeholder="标题" />
                    <DropDownSelect class="select" v-model="item.level" :options="levelOptions" placeholder="隐私" />
                    <Button @click="save" :loading="loading">
                        储存
                    </Button>
                </div>
            </div>
        </Card>
    </Dialog>
</template>

<script>
import { useStateStore } from '@/stores/stateStore';
import { useAppStore } from '@/stores/appStore';

import ImageEdit from '@/components/edit/ImageEdit.vue'
import Card from '@/components/Card.vue';
import EditText from '@/components/edit/EditText.vue';
import ContextMenu from '@/components/menu/ContextMenu.vue'
import Dialog from '@/components/dialog/Dialog.vue';
import Button from '@/components/Button.vue';
import DropDownSelect from "@/components/DropDownSelect.vue";

export default {
    setup() {
        const stateStore = useStateStore()
        const appStore = useAppStore()
        return { stateStore, appStore }
    },
    props: {
        item: {},
        visible: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ["save", "checkFile"],
    data() {
        return {
            levelOptions: [
                {
                    text: "私有",
                },
                {
                    text: "好友",
                },
                {
                    text: "公开",
                }
            ],
        }
    },
    methods: {
        save() {
            this.$emit("save")
        },
        checkFile(file) {
            this.$emit("checkFile", file)
        }
    },
    components: { ImageEdit, Card, EditText, ContextMenu, Dialog, Button, DropDownSelect }
}
</script>

<style scoped>
#item_edit_dialog {
    margin: auto;
    padding: 2rem;
    background-color: var(--color-background-soft);
}

.title_box {
    margin-bottom: 1rem;
}

.title {
    font-size: 2rem;
}

.img_edit {
    width: 13rem;
    height: 13rem;
}

.detail_box {
    display: flex;
}

.data_box {
    margin: auto 1rem 2rem 2rem;
}

.edit_text {
    margin-bottom: 2rem;
}

.btn {
    position: relative;
    height: 2.5rem;
    text-align: center;
    border-radius: 2rem;
    background-color: var(--color-button);
    line-height: 2.5rem;
    cursor: pointer;
    overflow: hidden;
    transition: background-color .25s;
}

.btn::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-image: radial-gradient(circle, #ccc 10%, transparent 10.1%);
    transform: scale(10);
    opacity: 0;
    transition: all .6s;
}

.btn:active::after {
    transform: scale(0);
    opacity: .5;
    transition: 0s;
}

.btn:hover {
    background-color: var(--color-button-hover);
}
</style>