<template>
    <div id="library_item_option_menu">
        <div v-if="!item.edit">
            <MenuButton text="播放" :clickListen="play" />
            <MenuButton class="tip" text="取消关注" :clickListen="remove" longTouch />
        </div>
        <div v-else>
            <MenuButton text="播放" :clickListen="play" />
            <MenuButton text="编辑" :clickListen="edit" />
            <MenuButton class="tip" text="删除" :clickListen="remove" longTouch />
        </div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'

import MenuButton from '@/components/menu/MenuButton.vue'
import ItemEditDialog from '@/components/dialog/ItemEditDialog.vue'

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    props: {
        item: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            visible: false,
            itemTemp: {},
            file: Object
        }
    },
    methods: {
        play() {

        },
        edit() {
            this.visible = true
            this.itemTemp = { ...this.item }
            this.file = undefined
        },
        closeDialog() {
            this.visible = false
        },
        checkFile(file) {
            this.file = file
            this.itemTemp.img = URL.createObjectURL(file)
        },
        save() {
            this.closeDialog()
        },
        remove() {
            this.$axios({
                url: `/follow/${this.item.type}/${this.item.id}`,
            }).then((res) => {
                if (res.data.status && res.data.data === "取消成功") {
                    this.appStore.removeItemOfLabrarys(this.item)
                }
            })
        },
    },
    components: { MenuButton,ItemEditDialog }
}
</script>

<style scoped>
#library_item_option_menu {
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