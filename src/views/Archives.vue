<template>
    <ContentTemplate :loading="!appStore.isLogin">
        <template #head="headProps">
            <ImageEdit class="img_edit" :item="item" edit caculation @checkFile="checkFile" />
            <div id="detail_box">
                <div class="detail_title">个人档案</div>
                <div class="detail_username" @click="openDialog">{{ appStore.profile.nickname }}</div>
                <div class="detail_other">关注数 {{ appStore.follows.filter((item) => {
        return item.type === "user"
    }).length
                    }}</div>
            </div>
            <ItemEditDialog :visible="visible" :item="itemTemp" :loading="loading" @clickMaskListen="closeDialog"
                @checkFile="checkFile" @save="save" />
        </template>

        <template #option>
            {{ appStore.profile.nickname }}
        </template>

        <template #content>
            <div style="height: 100rem;">
                {{ countResult }}
            </div>
        </template>
    </ContentTemplate>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore';
import { useHudStore } from '@/stores/hudStore'

import Dialog from '@/components/dialog/Dialog.vue';
import ImageEdit from '@/components/edit/ImageEdit.vue';
import ContentTemplate from '@/components/ContentTemplate.vue'
import ItemEditDialog from '@/components/dialog/ItemEditDialog.vue';

export default {
    setup() {
        const appStore = useAppStore();
        const stateStore = useStateStore()
        const hudStore = useHudStore();
        return { appStore, stateStore, hudStore };
    },
    data() {
        return {
            visible: false,
            item: {},
            itemTemp: {},
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
        getImageUrl(userId, value) {
            if (userId === undefined || value === undefined || value === "") return undefined
            return `${this.$axios.defaults.baseURL}/profile/${userId}/avatar/download/${value.split("~")[0]}`
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
    watch: {
        "appStore.profile": {
            handler(newVal) {
                let position = [100, 0, 0]
                if (newVal.avatar && newVal.avatar != "") {
                    position = newVal.avatar.split("~")[1].split(";")
                }
                this.item = {
                    type: "user",
                    id: newVal.userId,
                    text: newVal.nickname,
                    img: this.getImageUrl(newVal.userId, newVal.avatar),
                    position: {
                        size: parseInt(position[0]),
                        x: parseInt(position[1]),
                        y: parseInt(position[2])
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    components: { Dialog, ImageEdit, ContentTemplate, ItemEditDialog }
}
</script>

<style scoped>
.img_edit {
    width: 13rem;
    height: 13rem;
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
    cursor: pointer;
}
</style>