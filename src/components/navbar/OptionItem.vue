<template>
    <div class="option-item" :class="optionItemClass" @click="go" @click.right="rightClickEvent">
        <div class="option-item-img-box">
            <img class="left_img" :src="option.true" :hidden="!show || !option.true" alt="选中">
            <img class="left_img" :src="option.false" :hidden="show || !option.false" alt="未选中">
        </div>
        <div class="option-item-title">
            {{ option.title }}
        </div>
        <DropDown class="right_box" v-if="option.title === '音乐库'" closeAfterSelection>
            <template #text>
                <div>
                    <div class="right_img"></div>
                </div>
            </template>
            <template #extend>
                <LibraryAddItemMenu class="extend" />
            </template>
        </DropDown>
    </div>
</template>

<script>
import { useAppStore } from '../../stores/appStore'
import { useStateStore } from '../../stores/stateStore'

import DropDown from '@/components/DropDown.vue'
import LibraryAddItemMenu from '@/components/navbar/LibraryAddItemMenu.vue'

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    props: {
        option: Object,
    },
    data() {
        return {
            show: false
        }
    },
    mounted() {
        this.check()
    },
    computed: {
        optionItemClass() {
            return {
                "head": this.option.position && this.option.position != undefined,
                "foot": !this.option.position && this.option.position != undefined,
                "nav": !this.option.type,
                "item": this.option.type,
                "focus": this.option.href !== undefined
            }
        }
    },
    methods: {
        go() {
            if (this.option.href === undefined) {
                this.stateStore.reversalLayoutExtend()
            }
            else this.appStore.routerPush(this.option.href)
        },
        check() {
            if (this.option.href === undefined) {
                this.show = this.stateStore.layoutExtend
            } else if (this.$route.fullPath === this.option.href) {
                this.show = true;
            } else {
                this.show = false;
            }
        },
    },
    watch: {
        "$route.fullPath": function () {
            this.check()
        },
        "stateStore.layoutExtend": function () {
            this.check()
        }
    },
    components: { DropDown, LibraryAddItemMenu }
}
</script>

<style scoped>
.option-item {
    height: 4rem;
    display: flex;
    overflow: hidden;
    cursor: pointer;
}

.head {
    border-radius: .7rem .7rem 0 0;
}

.foot {
    border-radius: 0 0 .7rem .7rem;
}

.option-item-img-box {
    padding: 1rem 1.25rem;
}

.option-item-title {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    margin-block: 0px;
    font-size: 1.2rem;
    font-weight: 700;
    font-family: var(--font-family, CircularSp, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif));
    color: inherit;
    line-height: 4rem;
}

.left_img {
    height: 2rem;
    width: 2rem;
}

.right_box {
    margin: auto 1.5rem auto auto
}

.right_img {
    height: 1.75rem;
    width: 1.75rem;
    background-image: url(../../assets/ic_plus.svg);
    background-repeat: no-repeat;
    background-size: 1rem;
    background-position: 50%;
    border-radius: 50%;
}

.extend {
    position: relative;
    top: .5rem;
    left: -0.5rem;
}

.right_box:hover .right_img {
    background-color: var(--color-background);
}

.focus:hover {
    background-color: var(--color-background-soft);
}
</style>