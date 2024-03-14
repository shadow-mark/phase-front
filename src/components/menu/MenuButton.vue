<template>
    <div class="button" @click="go" @mousedown="enter" ref="button">
        <div class="text">{{ text }}</div>
    </div>
</template>

<script>
import { useAppStore } from '../../stores/appStore'

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
        },
        longTouch: {
            type: Boolean,
            default: false
        },
        clickListen: {
            type: Function,
            default: () => { }
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            stop: true
        }
    },
    methods: {
        go() {
            if (this.disabled) return
            if (this.href !== "#" || this.href !== undefined) {
                this.appStore.routerPush(this.href)
            }
            if (this.longTouch) {
                this.stop = true
            } else {
                this.clickListen()
            }
        },
        enter() {
            if (!this.longTouch || this.disabled) return
            this.stop = false
            setTimeout(() => {
                if (!this.stop) {
                    this.clickListen()
                    this.$refs.button.click()
                }
            }, 2000)
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
    z-index: 0;
    position: relative;
    overflow: hidden;
    cursor: v-bind("disabled ? 'not-allowed' : ''");
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

.button::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 0;
    height: 100%;
    left: 0;
    top: 0;
    background-color: brown;
    transition: all ease-in-out 2s;
}

.button:active::before {
    width: v-bind("longTouch ? '100%' : '0'");
}
</style>