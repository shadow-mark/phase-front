<template>
    <ContentTemplate :isLoad="appStore.isLogin">
        <template #head="headProps">
            <div id="img_box">
                <img class="img" :src="item.img" :alt="item.text">
            </div>
            <div id="detail_box">
                <div class="detail_title"></div>
                <div class="detail_username">{{ item.text }}</div>
                <div class="detail_other"></div>
            </div>
        </template>

        <template #option>
            {{ item.text }}
        </template>

        <template #content>
            <div @click="create">创建</div>
            <div @click="play">播放全部</div>
            <div>
                <ResourceItem v-for="(item, index) in resources" :item="item" :index="index" :key="item" @edit="edit"
                    @remove="remove" @upload="upload" isUpload ref="resourceItem" />
            </div>
            <ResourceEditDialog :item="resource" :visible="editVisible" @clickMaskListen="close" @save="save" />
            <ResourceUploadDialog :item="resource" :visible="uploadVisible" @clickMaskListen="close" @save="save" />
        </template>
    </ContentTemplate>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore';
import { useMediaStore } from '@/stores/mediaStore';
import { useHudStore } from '@/stores/hudStore'

import ContentTemplate from '@/components/ContentTemplate.vue'
import ContextMenu from '@/components/menu/ContextMenu.vue';
import ResourceMenu from '@/components/resource/ResourceMenu.vue'
import ResourceEditDialog from '@/components/resource/ResourceEditDialog.vue';
import ResourceUploadDialog from '@/components/resource/ResourceUploadDialog.vue';
import ResourceItem from '@/components/resource/ResourceItem.vue'

export default {
    setup() {
        const appStore = useAppStore();
        const stateStore = useStateStore()
        const mediaStore = useMediaStore()
        const hudStore = useHudStore();
        return { appStore, stateStore, mediaStore, hudStore };
    },
    mounted() {
        this.appStore.setThemeColor([145, 110, 164])
        this.init()
    },
    data() {
        return {
            item: {
                text: "上传的资源",
                img: new URL("@/assets/ic_upload.svg", import.meta.url).href,
            },
            resource: {},
            index: 0,
            resources: [],
            editVisible: false,
            uploadVisible: false
        }
    },
    methods: {
        init() {
            // this.stateStore.setResourceMarkDialogCallback((res) => {
            //     const id = res.id
            //     const selected = res.selected
            //     const index = this.resources.findIndex((it) => it.id === id)
            //     const el = this.$refs["resourceItem"][index]
            //     el.setSelected(selected)
            // })
            this.$axios({
                url: "/resource/list/own"
            }).then((res) => {
                this.resources = res.data.data
            })
        },
        create() {
            this.$axios({
                url: "/resource/generate"
            }).then((res) => {
                if (res.data.status) {
                    this.resources.push(res.data.data)
                }
            })
        },
        play() {
            this.mediaStore.set("upload", -1, this.resources)
        },
        edit(index) {
            this.index = index
            this.resource = { ...this.resources[index] }
            this.editVisible = true
        },
        upload(index) {
            this.index = index
            this.resource = { ...this.resources[index] }
            this.uploadVisible = true
        },
        save(resource) {
            this.resources[this.index] = resource
            this.close()
        },
        remove(index) {
            this.resources.splice(index, 1)
        },
        close() {
            this.editVisible = false
            this.uploadVisible = false
        }
    },
    components: { ContentTemplate, ContextMenu, ResourceMenu, ResourceEditDialog, ResourceUploadDialog, ResourceItem }
}
</script>

<style scoped>
#img_box {
    width: 13rem;
    height: 13rem;
    padding: 2.5rem;
    border-radius: 10%;
    background-image: linear-gradient(-225deg, #A8BFFF 0%, #884D80 100%);
    box-shadow: 0px 0px .75rem black;
}

.img {
    width: 8.5rem;
    height: 8.5rem;
}

#detail_box {
    margin: auto 0 2rem 2rem;
}

.detail_tiitle {
    font-weight: 400;
}

.detail_username {
    font-size: 5rem;
    line-height: 5.5rem;
    margin-bottom: 1rem;
    margin-top: -.5rem;
    word-break: break-word;
}
</style>