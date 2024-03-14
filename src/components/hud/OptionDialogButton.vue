<template>
    <div class="button" @click="go">
        <div class="text">{{ text }}</div>
    </div>
</template>

<script>
import { useAppStore } from '@/stores/appStore'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    props: {
        img: {
            type: String,
            default: "#"
        },
        text: String,
        href: {
            type: String,
            default: "#"
        }
    },
    emits: ["clickListen"],
    methods: {
        go() {
            if (this.href !== "#" || this.href !== undefined) {
                this.appStore.routerPush(this.href)
            }
            this.$emit("clickListen")
        }
    }
}
</script>

<style scoped>
.button {
    padding: .5rem 1rem;
    width: 100%;
    border-radius: .25rem;
    cursor: pointer;
}

.text {
    margin-left: v-bind("img !== '#' ? '2rem' : '0'");
}

.text::before {
    content: "";
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    left: .75rem;
    background-image: v-bind("img !== '#' ? 'url(' + img + ')' : 'none'");
    background-repeat: no-repeat;
    background-size: cover;
}

.button:hover {
    background-color: var(--color-background-soft);
}
</style>