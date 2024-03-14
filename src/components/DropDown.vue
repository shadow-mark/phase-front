<template>
    <div>
        <div class="text_content" @click.stop="reversalLeft" @click.right.stop.prevent="reversalRight" tabindex="1"
            ref="text" @blur="textBlur" @focus="textFocus">
            <slot name="text"></slot>
        </div>
        <div class="extend_conten" v-show="visible" @click.stop="check" tabindex="2" ref="extend" @blur="extendBlur"
            @focus="extendFocus">
            <slot name="extend"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        closeAfterSelection: {
            type: Boolean,
            default: false
        },
        clickRight: {
            type: Boolean,
            default: false
        },
        disabledClickLeft: {
            type: Boolean,
            default: false
        }
    },
    emits: ["open", "close"],
    data() {
        return {
            realTextFocus: false,
            isTextFocus: false,
            isExtendFocus: false,
            width: "0px"
        }
    },
    methods: {
        initWidth() {
            this.width = this.$refs.text.offsetWidth + "px"
        },
        reversal() {
            this.initWidth()
            this.isTextFocus = !this.isTextFocus
            this.realTextFocus = true
        },
        reversalLeft() {
            if (!this.disabledClickLeft) {
                this.reversal()
            }
        },
        reversalRight() {
            if (this.clickRight) {
                this.reversal()
            }
        },
        check() {
            if (this.closeAfterSelection) {
                this.$refs.extend.blur()
            }
        },
        textFocus() {
            if (this.isExtendFocus) {
                this.isTextFocus = true
            }
        },
        textBlur() {
            setTimeout(() => {
                this.isTextFocus = false
            }, 10)
            setTimeout(() => {
                this.realTextFocus = false
            }, 100)
        },
        extendFocus() {
            this.isExtendFocus = true
        },
        extendBlur() {
            setTimeout(() => {
                this.isExtendFocus = false
            }, 10)
        }
    },
    computed: {
        visible() {
            return this.isTextFocus || this.isExtendFocus
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.$emit("open")
            } else {
                this.$emit("close")
            }
        }
    }
}
</script>

<style scoped>
.text_content {
    height: 100%;
    width: 100%;
    display: flex;
}

.extend_conten {
    width: v-bind(width);
    position: absolute;
    z-index: 2;
}
</style>