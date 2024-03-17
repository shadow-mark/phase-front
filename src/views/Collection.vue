<template>
    <ContentTemplate :loading="loading">
        <template #head>
            <ImageEdit class="img_edit" :item="item" caculation :edit="edit" @checkFile="checkFile" />
            <div id="detail_box">
                <div class="detail_title">播放清单</div>
                <div class="detail_username" @click="openDialog">{{ collection.title }}</div>
                <div class="detail_other">受{{ collection.followCount }}人关注
                </div>
            </div>
            <ItemEditDialog v-if="edit" :visible="visible" :item="itemTemp" :loading="updateLoading"
                @clickMaskListen="closeDialog" @checkFile="checkFile" @save="save" />
        </template>
        <template #option>
            {{ id }}
        </template>
        <template #content>
            <div id="resource_item_box">
                <ResourceItem v-for="(item, index) in resources" :item="item" :index="index" :key="item" />
            </div>
        </template>
    </ContentTemplate>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'

import ContentTemplate from '@/components/ContentTemplate.vue';
import ImageEdit from '@/components/edit/ImageEdit.vue';
import ItemEditDialog from '@/components/dialog/ItemEditDialog.vue'
import ResourceItem from '@/components/resource/ResourceItem.vue'

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    mounted() {
        this.visit()
        this.getResources()
    },
    beforeRouteUpdate(to, from) {
        this.resources = {}
        this.id = to.params.id
        this.visit()
        this.getResources()
    },
    data() {
        return {
            id: this.$route.params.id,
            collection: {},
            resources: [],
            itemTemp: {},
            visible: false,
            loading: true,
            file: undefined,
            countResult: 2
        }
    },
    computed: {
        item() {
            return {
                type: "collection",
                id: this.collection.id,
                text: this.collection.title,
                img: this.getImageUrl(this.collection.id, this.collection.cover),
                position: this.getImagePosition(this.collection.cover),
                level: this.collection.level
            }
        },
        edit() {
            const index = this.appStore.collections.findIndex((it) => it.id === this.collection.id);
            return index !== -1
        },
        updateLoading() {
            return this.countResult < 2
        }
    },
    methods: {
        visit() {
            this.loading = true
            let url = `/collection/get/${this.id}`
            this.$axios({
                url: url
            }).then(res => {
                if (res.data.status) {
                    this.collection = res.data.data
                    this.loading = false
                }
            })
        },
        getResources() {
            this.$axios({
                url: `/collection/get/${this.id}/resource`
            }).then(res => {
                if (res.data.status) {
                    this.resources = res.data.data
                }
            })
        },
        getImageUrl(id, value) {
            if (id === undefined || value === undefined || value === "") return undefined
            return `${this.$axios.defaults.baseURL}/collection/${id}/cover/download/${value.split("~")[0]}`
        },
        getImagePosition(value) {
            let position = [100, 0, 0]
            if (value && value !== "") {
                position = value.split("~")[1].split(";").map((it) => parseInt(it))
            }
            return {
                size: position[0],
                x: position[1],
                y: position[2]
            }
        },
        openDialog() {
            this.visible = true
            this.itemTemp = { ...this.item }
            this.itemTemp.position = { ...this.item.position }
        },
        closeDialog() {
            this.file = undefined
            this.visible = false
        },
        checkFile(file) {
            this.openDialog()
            this.file = file
            this.itemTemp.img = URL.createObjectURL(file)
            this.itemTemp.position = {
                size: 100,
                x: 0,
                y: 0
            }
        },
        uploadImg() {
            if (!this.file) {
                this.countResult++
                return
            }
            const position = this.itemTemp.position
            let data = new FormData()
            data.append("file", this.file);
            data.append("position", `${position.size};${position.x};${position.y}`)
            this.$axios({
                method: "POST",
                url: `/collection/${this.item.id}/cover/upload`,
                data: data
            }).then((res) => {
                if (res.data.status) {
                    this.collection.cover = res.data.data
                    this.appStore.addCollection(this.collection)
                }
                this.countResult++
            })
        },
        modify() {
            const position = this.itemTemp.position
            this.$axios({
                method: "POST",
                url: "/collection/modify",
                data: {
                    id: this.itemTemp.id,
                    title: this.itemTemp.text,
                    level: this.itemTemp.level,
                    position: `${position.size};${position.x};${position.y}`
                }
            }).then((res) => {
                if (res.data.status) {
                    this.collection = res.data.data
                    this.appStore.addCollection(this.collection)

                }
                this.countResult++
            })
        },
        save() {
            this.countResult = 0
            this.uploadImg()
            this.modify()
            this.closeDialog()
        },
        remove() {

        }
    },
    components: { ContentTemplate, ImageEdit, ItemEditDialog, ResourceItem }
}
</script>

<style scoped>
.img_edit {
    width: 13rem;
    height: 13rem;
}

#detail_box {
    margin: auto 0 2rem 1.5rem;
}

.detail_title {
    font-weight: 400;
    margin-bottom: 1rem;
}

.detail_username {
    font-size: 5rem;
    line-height: 5.5rem;
    margin-bottom: 1rem;
    margin-top: -.5rem;
    word-break: break-word;
    cursor: pointer;
}

#resource_item_box {
    padding: 0 1rem;
}
</style>