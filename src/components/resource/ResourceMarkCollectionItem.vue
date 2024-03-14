<template>
    <div id="collection_item">
        <div class="item_cover">
            <Cover :src="img" :alt="item.title" />
        </div>
        <div class="item_title">{{ item.title }}</div>
        <div class="item_option_box">
            <div class="img default_collection"></div>
            <div @click="select">
                <div class="img selected_true" v-if="show"></div>
                <div class="img selected_false" v-else></div>
            </div>
        </div>
    </div>
</template>

<script>
import Cover from '@/components/Cover.vue';

export default {
    props: {
        item: {},
        defaultCheck: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            change: false
        }
    },
    emits: ["add", "remove"],
    computed: {
        img() {
            const item = this.item
            if (item.cover === undefined || item.cover === '') return ''
            return `${this.$axios.defaults.baseURL}/collection/${item.id}/cover/download/${item.cover.split('~')[0]}`
        },
        show() {
            if (this.change) {
                return !this.defaultCheck
            } else {
                return this.defaultCheck
            }
        }
    },
    methods: {
        select() {
            if (this.disabled) return
            this.change = !this.change
            if (this.change) {
                this.$emit("add", this.item.id)
            } else {
                this.$emit("remove", this.item.id)
            }
        }
    },
    components: { Cover }
}
</script>

<style scoped>
#collection_item {
    display: flex;
    padding: .75rem 0;
}

#collection_item:hover {
    background-color: var(--color-background-mute);
    border-radius: .25rem;
}

.item_cover {
    margin: auto .5rem;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: .2rem;
    overflow: hidden;
}

.item_title {
    margin-left: .25rem;
    line-height: 1.75rem;
}

.item_option_box {
    display: flex;
    margin: auto .5rem auto auto;
}

.img {
    cursor: v-bind("disabled ? 'not-allowed' : 'pointer'");
    background-size: contain;
    background-repeat: no-repeat;
}

.default_collection {
    display: none;
    width: 1.25rem;
    height: 1.25rem;
}

.selected_true {
    width: 1.25rem;
    height: 1.25rem;
    background-image: url(@/assets/ic_resource_done.svg);
}

.selected_false {
    width: 1.25rem;
    height: 1.25rem;
    background-image: url(@/assets/ic_resource_add.svg);
}
</style>