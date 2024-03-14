<template>
    <ContentTemplate :isLoad="isLoad">
        <template #head="headProps">
            <ImageEdit caculation />
            <div id="detail_box">
                <div class="detail_title">用户档案</div>
                <div class="detail_username" @click="openItemEditDialog">{{ user.text }}</div>
                <div class="detail_other">
                    粉丝数{{ user.followCount }}
                </div>
            </div>
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
            isLoad: false
        }
    },
    computed: {
        user() {
            return this.appStore.nowVisitItem
        }
    },
    methods: {
        visit() {
            let url = `/user/visit/${this.id}`
            this.$axios({
                url: url
            }).then(res => {
                if (res.data.status) {
                    this.appStore.setNowVisitItem(res.data.data)
                    this.isLoad = true
                }
            })
        },
    },
    components: { ContentTemplate, ImageEdit }
}
</script>

<style scoped>
#detail_box {
    margin: auto 0 0 1.5rem;
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