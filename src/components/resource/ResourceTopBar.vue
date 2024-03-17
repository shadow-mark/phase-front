<template>
    <div id="resource_top_bar" :class="resourceTopBarClass" ref="topBar">
        <div class="sync_box">
            <div class="item_detail">
                <div class="item_index">#</div>
                <div class="item_title">标题</div>
            </div>
            <div class="item_user">用户</div>
            <div class="space"></div>
            <div class="item_time">新增日期</div>
        </div>
    </div>
</template>

<script>
import { useHudStore } from '@/stores/hudStore';

export default {
    setup() {
        const hudStore = useHudStore()
        return { hudStore }
    },
    props: {
        keyframesHight: 0
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        resourceTopBarClass() {
            return {
                "show": this.show
            }
        }
    },
    watch: {
        "hudStore.routerScroll": {
            handler() {
                if (this.$refs.topBar.offsetTop > this.keyframesHight) {
                    this.show = true
                } else {
                    this.show = false
                }
            }
        }
    }
}
</script>

<style scoped>
#resource_top_bar {
    position: sticky;
    top: 4rem;
    z-index: 1;
    padding: 0 1rem;
}

.show {
    background-color: var(--color-background-soft);
    border-bottom: 1px solid #444444;
}

.sync_box {
    display: flex;
}

.item_detail {
    display: flex;
    width: 40%;
}

.item_index,
.item_title {
    margin: auto 0;
}

.item_index {
    padding: 0 1rem;
}

.item_user {
    margin-left: 1rem;
}

.space {
    margin-left: auto;
}

.item_time {
    margin-right: 2rem;
}
</style>