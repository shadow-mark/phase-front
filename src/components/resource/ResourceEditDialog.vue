import Dialog from '@/components/dialog/Dialog.vue';

<template>
    <Dialog v-bind="$attrs" :visible="visible" isMask v-if="visible">
        <Card id="item_edit_dialog">
            <div class="title_box">
                <div class="title">
                    编辑
                </div>
            </div>
            <div class="detail_box">
                <ImageEdit class="edit_img" :item="imageEditItem" @checkFile="checkFile" edit extend />
                <div class="data_box">
                    <EditText class="edit_text" v-model="item.title" placeholder="标题" />
                    <EditText class="edit_text" v-model="item.detail" placeholder="附述" />
                    <DropDownSelect class="select" v-model="item.type" :options="typeOptions" placeholder="类型" />
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
import Dialog from "@/components/dialog/Dialog.vue"
import Card from "@/components/Card.vue"
import EditText from "@/components/edit/EditText.vue";
import Button from "@/components/Button.vue";
import DropDownSelect from "@/components/DropDownSelect.vue";
import ImageEdit from "@/components/edit/ImageEdit.vue"

export default {
    props: {
        item: {
            type: Object,
            default: {}
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["save"],
    data() {
        return {
            imageEditItem: {},
            typeOptions: [
                {
                    text: "无",
                    disabled: true,
                },
                {
                    text: "图片",
                },
                {
                    text: "音频",
                },
                {
                    text: "视频",
                },
                {
                    text: "超链接",
                    disabled: true,
                }
            ],
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
            file: undefined,
            countResult: 2
        }
    },
    computed: {
        loading() {
            return this.countResult < 2
        },
    },
    methods: {
        getImageUrl(id, value) {
            if (this.file) return URL.createObjectURL(this.file)
            if (id === undefined || value === undefined || value === "") return undefined
            return `${this.$axios.defaults.baseURL}/resource/${id}/cover/download/${value.split("~")[0]}`
        },
        checkFile(file) {
            this.file = file
            this.imageEditItem.img = URL.createObjectURL(file)
            this.imageEditItem.position = {
                size: 100,
                x: 0,
                y: 0
            }
        },
        modify() {
            let data = { ...this.item }
            let position = this.imageEditItem.position
            data.position = `${position.size};${position.x};${position.y}`
            this.$axios({
                method: "POST",
                url: "/resource/modify",
                data: data
            }).then((res) => {
                if (res.data.status) {
                    this.$emit("save", res.data.data)
                }
                this.countResult++
            })
        },
        uploadCover() {
            if (!this.file) {
                this.countResult++
                return
            }
            let position = this.imageEditItem.position
            let data = new FormData()
            data.append("file", this.file)
            data.append("position", `${position.size};${position.x};${position.y}`)
            this.$axios({
                method: "POST",
                url: `/resource/${this.item.id}/cover/upload`,
                data: data
            }).then((res) => {
                if (res.data.status) {
                    this.item.cover = res.data.data
                    this.$emit("save", this.item)
                }
                this.countResult++
            })
        },
        save() {
            this.countResult = 0
            this.modify()
            this.uploadCover()
        }
    },
    watch: {
        visible(newVal) {
            if (!newVal) {
                this.file = undefined
            } else {
                let position = [100, 0, 0]
                let item = { ...this.item }
                if (item.cover && item.cover != "") {
                    position = item.cover.split("~")[1].split(";").map((it) => {
                        return parseInt(it)
                    })
                }
                this.imageEditItem = {
                    type: "resource",
                    text: item.title,
                    img: this.getImageUrl(item.id, item.cover),
                    position: {
                        size: position[0],
                        x: position[1],
                        y: position[2]
                    }
                }
            }
        }
    },
    components: { Dialog, Card, EditText, Button, DropDownSelect, ImageEdit }
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

.detail_box {
    display: flex;
}

.data_box {
    margin: 0 1rem 0 2rem;
}

.edit_img {
    margin: auto;
    width: 20rem;
    height: 20rem;
}

.edit_text {
    margin-top: 1rem;
}

.select {
    margin-top: 2rem;
    margin-bottom: 1rem;
}
</style>