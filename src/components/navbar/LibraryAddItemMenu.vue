<template>
    <div id="library_add_item_menu" @click.right.stop.prevent>
        <MenuButton text="建立清单" :clickListen="createCollection" />
        <MenuButton text="建立资料夹" :clickListen="createFolder" />
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'

import MenuButton from '@/components/menu/MenuButton.vue'

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    methods: {
        createCollection() {
            this.appStore.createCollection()
        },
        createFolder() {
        },
    },
    components: { MenuButton }
}
</script>

<style scoped>
#library_add_item_menu {
    width: 10rem;
    padding: .2rem;
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--color-background-soft);
}
</style>