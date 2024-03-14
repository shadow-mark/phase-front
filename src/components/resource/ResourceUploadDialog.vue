<template>
    <Dialog v-bind="$attrs" :visible="visible" isMask>
        <Card id="resource_upload_dialog">
            <div class="title_box">
                <div class="title">
                    上传
                </div>
            </div>
            <div class="detail_box" v-if="inited">
                <div class="button">
                    <Button v-if="files.length < fileMax || fileMax === -1" @click="create" :loading="loading">
                        <div class="icon_plus"></div>
                    </Button>
                </div>
                <ResourceUploadItem v-for="(file, index) in files" @click.right.prevent="check(index)" :file="file"
                    :type="item.type" :key="file" :check="checkIndex === index" />
            </div>
            <div class="detail_box" v-else>
                <div class="loading"></div>
            </div>
            <div class="file_show_box" v-if="checkIndex !== -1">
                <img v-if="item.type === 1 && files[checkIndex].filename"
                    :src="`${$axios.defaults.baseURL}/file/${item.id}/download/${files[checkIndex].filename}`" />
                <audio ref="media" v-else-if="item.type === 2"
                    :src="`${$axios.defaults.baseURL}/file/${item.id}/download/${files[checkIndex].filename}`"
                    controls></audio>
                <Button class="remove_btn" @click="remove" :loading="removeLoading">
                    删除
                </Button>
            </div>
        </Card>
    </Dialog>
</template>

<script>
import Dialog from '@/components/dialog/Dialog.vue';
import Card from '@/components/Card.vue'
import ResourceUploadItem from '@/components/resource/ResourceUploadItem.vue'
import Button from '@/components/Button.vue';
import WebImg from '@/components/WebImg.vue';

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
            inited: false,
            files: [],
            loading: false,
            removeLoading: false,
            checkIndex: -1
        }
    },
    computed: {
        fileMax() {
            let num = 0
            if (this.item.type === 1) {
                num = -1
            } else if (this.item.type === 2 || this.item.type === 3) {
                num = 1
            }
            return num
        },
    },
    methods: {
        init() {
            this.$axios({
                url: `/file/list/${this.item.id}`
            }).then((res) => {
                if (res.data.status) {
                    this.files = res.data.data
                }
                this.inited = true
            })
        },
        create() {
            this.loading = true
            this.$axios({
                url: `/file/generate/${this.item.id}`
            }).then((res) => {
                if (res.data.status) {
                    this.files.push(res.data.data)
                }
                this.loading = false
            })
        },
        check(index) {
            if (this.checkIndex !== index) {
                this.checkIndex = index
            } else {
                this.checkIndex = -1
            }
        },
        remove() {
            const index = this.checkIndex
            this.removeLoading = true
            this.$axios({
                url: `/file/delete/${this.files[index].id}`
            }).then((res) => {
                this.files.splice(index, 1)
                this.removeLoading = false
                if (this.checkIndex === index) {
                    this.checkIndex = -1
                }
            })
        }
    },
    watch: {
        "item.id": function () {
            this.inited = false
            this.checkIndex = -1
            this.init()
        },
        visible(newVal) {
            if (!newVal && this.$refs.media) {
                this.$refs.media.pause()
            }
        }
    },
    components: { Dialog, Card, ResourceUploadItem, Button, WebImg }
}
</script>

<style scoped>
#resource_upload_dialog {
    margin: auto;
    padding: 2rem;
    background-color: var(--color-background-soft);
}

.button {
    position: sticky;
    top: 0;
    background-color: var(--color-background-soft);
    z-index: 1;
}

.title_box {
    margin-bottom: 1rem;
}

.title {
    font-size: 2rem;
}

.detail_box {
    width: 18.75rem;
    max-height: 20rem;
    overflow-y: auto;
}

.loading {
    margin: auto;
    width: 1.5rem;
    height: 1.5rem;
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

.icon_plus {
    height: 1rem;
    width: 1rem;
    background-image: url(@/assets/ic_plus.svg);
    background-size: 100%;
    background-repeat: no-repeat;
}

.file_show_box {
    width: 18.75rem;
    border-top: 1px solid var(--color-edit);
    padding-top: 1rem;
}

.remove_btn {
    margin-top: 1rem;
}

img {
    width: 100%;
    height: 100%;
}
</style>