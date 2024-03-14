<template>
    <div id="slider_content" ref="slider">
        {{  }}
        <div class="slider-selected"></div>
        <div class="bar_content">
            <div ref="bar" class="bar_box" @mousedown="mousedown">
                <div class="bar"></div>
                <div class="tooltip" v-if="tooltip">{{ Math.round(temp) }}</div>
            </div>
        </div>
        <div class="stop_content" v-for="i in (maxValue - minValue) / step - 1"
            :style="{ top: i * 100 / ((maxValue - minValue) / step) + '%' }" v-if="vertical && stop">
            <div class="stop"></div>
        </div>
        <div class="stop_content" v-for="i in (maxValue - minValue) / step - 1"
            :style="{ left: i * 100 / ((maxValue - minValue) / step) + '%' }" v-else-if="stop">
            <div class="stop"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: Number,
        minValue: Number,
        maxValue: Number,
        step: {
            type: Number,
            default: 1
        },
        tooltip: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        dispersed: {
            type: Boolean,
            default: false
        },
        vertical: {
            type: Boolean,
            default: false
        },
        realTime: {
            type: Boolean,
            default: false
        },
        stop: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:modelValue"],
    data() {
        return {
            temp: Number,
            isChange: false
        }
    },
    computed: {
        selected() {
            return (this.temp - this.minValue) / (this.maxValue - this.minValue) * 100 + '%'
        },

    },
    methods: {
        mousedown(e) {
            const vm = this
            const slider = this.$refs.slider
            const content = {
                width: slider.offsetWidth,
                height: slider.offsetHeight,
            }
            const downX = e.clientX
            const downY = e.clientY
            const downValue = this.modelValue
            const stepX = content.width / (this.maxValue - this.minValue)
            const stepY = content.height / (this.maxValue - this.minValue)
            vm.isChange = true
            document.onmousemove = function (eve) {
                const e = eve || window.event
                const moveX = e.clientX
                const moveY = e.clientY
                const offsetX = moveX - downX
                const offsetY = moveY - downY
                const offsetStepX = offsetX / stepX
                const offsetStepY = offsetY / stepY
                const offsetStep = vm.vertical ? offsetStepY : offsetStepX
                if (vm.dispersed) {
                    vm.temp = downValue + Math.round(offsetStep)
                } else {
                    vm.temp = downValue + offsetStep
                }
                if (vm.temp < vm.minValue) vm.temp = vm.minValue
                else if (vm.temp > vm.maxValue) vm.temp = vm.maxValue
                if (vm.realTime) vm.$emit("update:modelValue", Math.round(vm.temp))
            }
            document.onmouseup = function () {
                vm.$emit("update:modelValue", Math.round(vm.temp))
                vm.isChange = false
                document.onmousemove = null
                document.onmouseup = null
            }
        },
        handleInput(e) {
            this.$emit('update:modelValue', e.target.value)
        }
    },
    watch: {
        modelValue: {
            handler(newVal) {
                this.temp = newVal
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
#slider_content {
    position: relative;
    display: flex;
    width: v-bind("vertical ? '.5rem' : '100%'");
    height: v-bind("vertical ? '100%' : '.5rem'");
    background-color: var(--color-edit);
    border-radius: 1rem;
}

.slider-selected {
    position: absolute;
    left: 0;
    width: v-bind("vertical ? '.5rem' : selected");
    height: v-bind("vertical ? selected : '.5rem'");
    background-color: var(--color-edit-focus);
    border-radius: 1rem;
    z-index: 1;
}

.bar_content {
    position: relative;
    left: v-bind("vertical ? '0' : selected");
    top: v-bind("vertical ? selected : '0'");
}

.tooltip {
    display: v-bind("isChange ? 'flex' : 'none'");
    position: absolute;
    background-color: var(--color-background-soft);
    padding: .2rem .5rem;
    top: v-bind("vertical ? '-50%' : '-2.3rem'");
    left: v-bind("vertical ? '1.5rem' : '-75%'");
    border-radius: 25%;
}

.bar_box {
    position: absolute;
    top: v-bind("vertical ? '-.5rem' : '-.25rem'");
    left: v-bind("vertical ? '-.25rem' : '-.5rem'");
    width: 1rem;
    height: 1rem;
    z-index: 1;
}

.bar_box:hover .tooltip {
    display: flex;
}

.bar_box:hover .bar {
    transform: scale(1.2);
}

.bar {
    width: 1rem;
    height: 1rem;
    background-color: var(--color-edit-focus);
    border-radius: 50%;
    cursor: v-bind("disabled ? 'not-allowed' : 'grab'");
}

.stop_content {
    position: absolute;
}

.stop {
    position: absolute;
    left: v-bind("vertical ? '0' : '-.25rem'");
    top: v-bind("vertical ? '-.25rem' : '0'");
    width: .5rem;
    height: .5rem;
    background-color: aliceblue;
    z-index: 0;
    border-radius: 50%;
}
</style>