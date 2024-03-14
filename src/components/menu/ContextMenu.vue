<template>
    <div>
        <div class="text_content" @click.right.stop.prevent="reversal($event)" @click.stop="close" tabindex="1"
            ref="text" @blur="textBlur" @focus="textFocus">
            <slot name="text"></slot>
        </div>
        <div class="menu_conten" v-show="visible" @click.stop="check" tabindex="2" ref="menu" @blur="menuBlur"
            @focus="menuFocus">
            <slot name="menu"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        closeAfterSelection: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            realTextFocus: false,
            isTextFocus: false,
            isMenuFocus: false,
            position: {
                x: 0,
                y: 0
            }
        }
    },
    methods: {
        reversal(event) {
            this.position = {
                x: event.x,
                y: event.y,
            }
            this.isTextFocus = true
            this.realTextFocus = true
        },
        close() {
            this.isTextFocus = false
            this.realTextFocus = true
        },
        check() {
            if (this.closeAfterSelection) {
                this.$refs.menu.blur()
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
        menuFocus() {
            this.isMenuFocus = true
        },
        menuBlur() {
            setTimeout(() => {
                this.isMenuFocus = false
            }, 10)
        }
    },
    computed: {
        visible() {
            return this.isTextFocus || this.isMenuFocus
        }
    }
}
</script>

<style scoped>
.menu_conten {
    position: fixed;
    z-index: 1;
    top: v-bind("position.y + 'px'");
    left: v-bind("position.x + 'px'");
}
</style>