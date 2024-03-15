<template>
    <Dialog :visible="stateStore.resourceMarkDialog.state" isMask @clickMaskListen="clickMaskListen">
        <Card id="resource_mark_content">
            <div class="title">
                新增至播放清单
            </div>
            <div class="search_box">
                <div class="search_img"></div>
                <form onsubmit="return false">
                    <input :value="searchText" @input="handleInput" />
                </form>
            </div>
            <div class="add_collection_btn" @click="createCollection">
                建立新专辑
            </div>
            <div class="collection_option_box">
                <ResourceMarkCollectionItem v-if="collections.length && stateStore.resourceMarkDialog.state"
                    v-for="item in collections"
                    :item="item" :defaultCheck="getDefaultCheck(item)" @add="add" @remove="remove"
                    :disabled="loading" />
                <div v-else>
                    空
                </div>
            </div>
            <div class="footer">
                <div class="space"></div>
                <div class="btn cancel" @click="clickMaskListen">取消</div>
                <div class="btn done" v-if="change" @click="done">
                    <div v-if="loading" class="loading"></div>
                    <div v-else>完成</div>
                </div>
            </div>
        </Card>
    </Dialog>
</template>

<script>
import { useAppStore } from '../../stores/appStore';
import { useStateStore } from '../../stores/stateStore';

import Dialog from '@/components/dialog/Dialog.vue';
import Card from '@/components/Card.vue';
import ResourceMarkCollectionItem from './ResourceMarkCollectionItem.vue';

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    data() {
        return {
            searchText: "",
            collectionIdArray: [],
            loading: false
        }
    },
    computed: {
        change() {
            return this.collectionIdArray.length > 0
        },
        collections() {
            return this.appStore.collections.filter((item) => item.title.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
        },
    },
    methods: {
        getDefaultCheck(item) {
            return this.stateStore.resourceMarkDialog.item.selected.findIndex((it) => it === item.id) >= 0
        },
        clickMaskListen() {
            this.stateStore.closeResourceMarkDialog()
        },
        getImageUrl(item) {
            if (item.cover === '') return ''
            return `${this.$axios.defaults.baseURL}/collection/${item.id}/cover/download/${item.cover.split("~")[0]}`
        },
        handleInput($event) {
            this.searchText = $event.target.value
        },
        createCollection() {
            this.appStore.createCollection()
        },
        add(id) {
            this.collectionIdArray.push(id)
        },
        remove(id) {
            let index = this.collectionIdArray.indexOf(id);
            if (index !== -1) {
                this.collectionIdArray.splice(index, 1);
            }
        },
        done() {
            this.loading = true
            const data = new FormData()
            data.append("collections", this.collectionIdArray)
            this.$axios({
                method: "POST",
                url: `/collection/add/${this.stateStore.resourceMarkDialog.item.id}`,
                data: data
            }).then((res) => {
                if (res.data.state) {
                    console.log(res.data.data)
                }
                this.loading = false
                this.stateStore.resourceMarkDialog.callback(res.data.data)
                this.stateStore.closeResourceMarkDialog()
            })
        }
    },
    components: { Dialog, Card, ResourceMarkCollectionItem }
}
</script>

<style scoped>
#resource_mark_content {
    margin: auto;
    width: 17rem;
    border-radius: .75rem;
    padding: .5rem 1rem;
    background-color: var(--color-background-soft);
}

.title {
    font-size: .75rem;
    font-weight: 100;
    padding: .25rem .5rem;
}

.search_box {
    display: flex;
    background-color: #3a3a3a;
    padding: .5rem;
    border-radius: .25rem;
}

.search_img {
    margin: auto;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(@/assets/ic_search_true.svg);
    background-size: contain;
    background-repeat: no-repeat;
}

input {
    padding: 0;
    outline: none;
    background: transparent;
    border: none;
    outline: medium;
    font-size: 1rem;
    /* width: calc(100% - 1rem); */
    color: var(--color-edit);
    caret-color: var(--color-edit-focus);
}

input:focus {
    outline: none;
    background-color: transparent;
}

.add_collection_btn {
    position: sticky;
    top: 0;
    display: flex;
    padding: .75rem .5rem;
    border-bottom: 2px solid var(--color-background-mute);
    cursor: pointer;
    border-radius: .25rem;
    background-color: var(--color-background-soft);
    z-index: 1;
}

.add_collection_btn::before {
    content: "";
    position: relative;
    margin: auto 1rem auto .45rem;
    width: 1rem;
    height: 1rem;
    background-image: url(@/assets/ic_plus.svg);
    background-size: contain;
    background-repeat: no-repeat;
}

.add_collection_btn:hover {
    background-color: var(--color-background-mute);
}

.collection_option_box {
    max-height: 9.75rem;
    overflow-y: auto;
    position: relative;
}

.footer {
    padding: .5rem 0;
    display: flex;
}

.space {
    margin-left: auto;
}

.btn {
    cursor: pointer;
    padding: .5rem 1rem;
}

.btn:hover {
    scale: 1.05;
}

.done {
    background-color: #1dcf5c;
    border-radius: 1.25rem;
    color: var(--color-background-mute);
    font-weight: bold;
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
</style>