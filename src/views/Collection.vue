<template>
    <ContentTemplate :loading="loading">
        <template #head>
            <!-- {{ collection }} -->
            <ImageEdit class="img_edit" :item="item" caculation :edit="edit"
                @checkFile="checkFile" />
            <div id="detail_box">
                <div class="detail_title">播放清单</div>
                <div class="detail_username" @click="openDialog">{{ collection.title }}</div>
                <div class="detail_other">受{{ collection.followCount }}人关注
                </div>
            </div>
            <ItemEditDialog v-if="edit" :visible="visible" :item="itemTemp" :loading="updateLoading" @clickMaskListen="closeDialog"
                @checkFile="checkFile" @save="save" />
        </template>
        <template #option>
            {{ id }}
        </template>
        <template #content>
            <div>
                111
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

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    mounted() {
        this.visit()
    },
    beforeRouteUpdate(to, from) {
        this.id = to.params.id
        this.visit()
    },
    data() {
        return {
            id: this.$route.params.id,
            collection: {},
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
                position: this.getImagePosition(this.collection.cover)
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
        getImageUrl(userId, value) {
            if (userId === undefined || value === undefined || value === "") return undefined
            return `${this.$axios.defaults.baseURL}/profile/${userId}/avatar/download/${value.split("~")[0]}`
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
                url: "/profile/avatar/upload",
                data: data
            }).then((res) => {
                if (res.data.status) {
                    this.appStore.setAvatar(res.data.data)
                }
                this.countResult++
            })
        },
        modifyProfile() {
            const position = this.itemTemp.position
            this.$axios({
                method: "POST",
                url: "/profile/modify",
                data: {
                    nickname: this.itemTemp.text,
                    position: `${position.size};${position.x};${position.y}`
                }
            }).then((res) => {
                if (res.data.status) {
                    this.appStore.setProfile(res.data.data)
                }
                this.countResult++
            })
        },
        save() {
            this.countResult = 0
            this.uploadImg()
            this.modifyProfile()
            this.closeDialog()
        }
    },
    components: { ContentTemplate, ImageEdit, ItemEditDialog }
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
</style>