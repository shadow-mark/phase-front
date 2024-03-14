<template>
    <Teleport to="body">
        <div class="dialog_content" v-show="visible" @contextmenu.prevent>
            <div class="masking" @click="close" @click.right="close"></div>
            <slot></slot>
        </div>
    </Teleport>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isMask: {
            type: Boolean,
            default: false
        }
    },
    emits: ["clickMaskListen"],
    methods: {
        close() {
            this.$emit("clickMaskListen")
        }
    }
}
</script>

<style scoped>
* {
    user-select: none;
}

.dialog_content {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 1;
    top: 0;
    left: 0;
}

.masking {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: auto;
    background-color: v-bind("isMask ? 'rgba(0, 0, 0, .7)' : 'rgba(0, 0, 0, 0)'");
}
</style>