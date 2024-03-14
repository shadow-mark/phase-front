<template>
    <div id="resource_option_menu" @click.right.stop.prevent>
        <MenuButton v-if="resource.type === 1" text="阅读" :clickListen="play" />
        <MenuButton v-else-if="resource.type === 2 || resource.type === 3" text="播放" :clickListen="play" />
        <div v-if="isUpload">
            <MenuButton text="编辑" :clickListen="edit" />
            <MenuButton text="上传" :disabled="uploadDisabled" :clickListen="upload" />
            <MenuButton class="tip" text="删除" :clickListen="remove" longTouch />
        </div>
        <div v-else>
            <MenuButton text="新增至专辑" :clickListen="mark" />
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useMediaStore } from '@/stores/mediaStore'

import MenuButton from '@/components/menu/MenuButton.vue'
import ItemEditDialog from '@/components/dialog/ItemEditDialog.vue'

export default {
    setup() {
        const appStore = useAppStore()
        const mediaStore = useMediaStore()
        return { appStore, mediaStore }
    },
    props: {
        resource: {
            type: Object,
            default: {}
        },
        index: {
            type: Number,
            default: -1
        },
        isUpload: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        uploadDisabled() {
            return this.resource.type === 0
        }
    },
    emits: ["edit", "remove", "upload", "mark"],
    methods: {
        play() {
            this.mediaStore.addByResourceId(this.resource.id)
        },
        edit() {
            this.$emit("edit", this.index)
        },
        upload() {
            this.$emit("upload", this.index)
        },
        remove() {
            this.$axios({
                url: `/resource/delete/${this.resource.id}`,
            }).then((res) => {
                if (res.data.status) {
                    this.$emit("remove", this.index)
                }
            })
        },
        mark() {
            this.$emit("mark")
        }
    },
    components: { MenuButton, ItemEditDialog }
}
</script>

<style scoped>
#resource_option_menu {
    width: 10rem;
    padding: .2rem;
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--color-background-soft);
}

.tip {
    color: brown;
    transition: all .2s;
}
</style>