<template>
    <div class="btn" @click="click">
        <div v-if="loading" class="loading"></div>
        <div class="text" v-else>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ["click"],
    methods: {
        click() {
            if (this.loading) return
            this.$emit("click")
        }
    }
}
</script>

<style scoped>
.btn {
    display: flex;
    position: relative;
    height: 2.5rem;
    text-align: center;
    border-radius: 2rem;
    background-color: v-bind("disabled ? 'var(--color-button-disable)' : 'var(--color-button)'");
    line-height: 2.5rem;
    cursor: v-bind("(disabled || loading) ? 'not-allowed' : 'pointer'");
    overflow: hidden;
    transition: background-color .25s;
}

.btn::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-image: radial-gradient(circle, #ccc 10%, transparent 10.1%);
    transform: scale(10);
    opacity: 0;
    transition: all .6s;
}

.btn:active::after {
    transform: scale(0);
    opacity: .5;
    transition: 0s;
}

.btn:hover {
    background-color: var(--color-button-hover);
}

.text {
    margin: auto;
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