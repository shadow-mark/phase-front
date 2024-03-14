<template>
    <Card id="library_box">
        <ContextMenu>
            <template #text>
                <OptionItem :option="option" />
            </template>
            <template #menu>
                <div>
                    <LibraryAddItemMenu />
                </div>
            </template>
        </ContextMenu>
        <div id="library_list">
            <!-- <div @click="test">{{ appStore.librarys }}</div> -->
            <div class="upload_btn_box">
                <LibraryItem :item="uploadItem" />
            </div>
            <transition-group name="slide" v-if="appStore.librarys">
                <ContextMenu class="drag_item" v-for="(library, index) in appStore.librarys" @drop="drop" v-bind:key="item">
                    <template #text>
                        <LibraryItem :item="item(library)" draggable :isDrag="isDrag" @dragstart="drag(index)"
                            @dragover="allowDrop($event, index)" @dragend="drop" />
                    </template>
                    <template #menu>
                        <LibraryItemOptionMenu :item="item(library)" />
                    </template>
                </ContextMenu>
            </transition-group>
        </div>
    </Card>
</template>

<script>
import { useAppStore } from '@/stores/appStore'

import Card from '@/components/Card.vue'
import OptionItem from '@/components/navbar/OptionItem.vue'
import LibraryItem from '@/components/navbar/LibraryItem.vue'
import ContextMenu from '@/components/menu/ContextMenu.vue'
import LibraryAddItemMenu from '@/components/navbar/LibraryAddItemMenu.vue'
import LibraryItemOptionMenu from '@/components/navbar/LibraryItemOptionMenu.vue'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    data() {
        return {
            selected: undefined,
            stop: false,
            isDrag: false,
            option: {
                position: true,
                title: "音乐库",
                true: new URL("@/assets/ic_library_true.svg", import.meta.url).href,
                false: new URL("@/assets/ic_library_false.svg", import.meta.url).href,
                href: undefined
            },
            uploadItem: {
                type: "upload",
                text: "上传的资源",
                img: new URL("@/assets/ic_upload.svg", import.meta.url).href,
            },
        }
    },
    methods: {
        drag(index) {
            this.selected = index
            this.isDrag = true
        },
        allowDrop(event, index) {
            event.preventDefault()
            if (!this.stop) {
                this.stop = true
                setTimeout(() => {
                    this.stop = false
                }, 200)
                let librarys = this.appStore.librarys
                if (librarys[index].type === "upload") return
                let temp = librarys[index]
                librarys[index] = librarys[this.selected]
                librarys[this.selected] = temp
                this.selected = index
            }
        },
        drop() {
            this.isDrag = false
            this.selected = undefined
        },
        item(library) {
            let item = {
                type: library.type,
                edit: library.edit,
            }
            if (library.type === "collection") {
                item.id = library.id
                item.text = library.title
                item.img = library.cover
            }
            return item
        },
        test() {
            this.appStore.addCollection({
                id: 1,
                title: "sb"
            })
        },
    },
    components: { Card, OptionItem, LibraryItem, ContextMenu, LibraryAddItemMenu, LibraryItemOptionMenu }
}
</script>

<style scoped>
#library_box {
    margin: .5rem 0 0 0;
    height: calc(100% - 8.5rem);
}

#library_list {
    overflow: auto;
    height: calc(100% - 4rem);
}

.upload_btn_box {
    padding: 0 .25rem;
}

.drag_item {
    padding: 0 .25rem;
}

.slide-enter-active {
    animation: slide-in .2s ease-out;
}

.slide-leave-active {
    animation: slide-out .2s ease-out;
}

.slide-move {
    transition: all .2s;
}

@keyframes slide-in {
    from {
        transform: translateY(50px)
    }

    to {
        transform: translateY(0)
    }
}

@keyframes slide-out {
    from {
        transform: translateY(0)
    }

    to {
        transform: translateY(50px)
    }
}
</style>