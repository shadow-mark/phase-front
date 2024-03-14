<template>
    <DropDown @open="onOpen" @close="onClose" closeAfterSelection>
        <template #text>
            <div class="select_text_box" ref="select">
                <label :class="placeholderClass">
                    <span class="placeholder_text">{{ placeholder }}</span>
                </label>
                <div class="value_text" v-if="options[modelValue]">
                    {{ options[modelValue].text }}
                </div>
            </div>
        </template>

        <template #extend>
            <div class="menu_box">
                <MenuButton v-for="(option, index) in options" :text="option.text" :disabled="option.disabled"
                    @click="check(index)" :style="{
        'background-color': modelValue === index ? 'var(--color-background-soft)' : ''
    }" />
            </div>
        </template>
    </DropDown>
</template>

<script>
import DropDown from '@/components/DropDown.vue';
import MenuButton from '@/components/menu/MenuButton.vue';

export default {
    props: {
        modelValue: Number,
        label: String,
        placeholder: String,
        options: {
            type: Array,
            default: []
        }
    },
    emits: ["update:modelValue"],
    data() {
        return {
            focus: false,
        }
    },
    computed: {
        placeholderClass() {
            return {
                "placeholder": this.modelValue === -1,
                "placeholder_focus": this.modelValue >= 0
            }
        }
    },
    methods: {
        onOpen() {
            this.focus = true
        },
        onClose() {
            this.focus = false
        },
        check(index) {
            if (this.options[index].disabled) return
            this.$emit("update:modelValue", index)
        }
    },
    components: { DropDown, MenuButton }
}
</script>

<style scoped>
.select_text_box {
    height: 3rem;
    width: 100%;
    border-width: 2px;
    border-style: solid;
    border-color: v-bind("focus ? 'var(--color-edit-focus)' : 'var(--color-edit)'");
    border-radius: 4px;
    padding: 0 .5rem;
    color: var(--color-edit);
}

.placeholder_focus,
.placeholder {
    color: v-bind("focus ? 'var(--color-edit-focus)' : 'var(--color-edit)'");
    position: relative;
    transition: all .5s;
}

.placeholder_focus {
    top: -1rem;
}

.placeholder {
    top: .6rem;
}

.placeholder_text {
    padding: 0 .5rem;
    position: relative;
    z-index: 1;
}

.placeholder_focus::before {
    content: "";
    position: absolute;
    height: 2px;
    width: 3rem;
    background-color: var(--color-background-soft);
    top: .8rem;
}

.value_text {
    position: relative;
    top: -1rem;
    padding: 0 .5rem;
    font-size: 1rem;
}

.menu_box {
    padding: .2rem;
    width: 100%;
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--color-background-soft);
}
</style>