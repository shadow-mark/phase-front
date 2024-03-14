<template>
    <WebImg v-if="src && src !== ''" :src="src" :position="position" :alt="alt" />
    <div v-else class="no_image" ref="img">
        <div class="no_image_text">
            {{ alt[0].toUpperCase() }}
        </div>
    </div>
</template>

<script>
import WebImg from "@/components/WebImg.vue"

export default {
    props: {
        src: "",
        position: {
            size: 100,
            x: 0,
            y: 0
        },
        alt: "cover"
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.img) {
                this.fontSize = this.$refs.img.offsetHeight * 0.035 + "rem"
            }
        })
    },
    data() {
        return {
            fontSize: "1rem"
        }
    },
    components: { WebImg }
}
</script>

<style scoped>
.no_image {
    height: 100%;
    width: 100%;
    display: flex;
    background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}


.no_image_text {
    margin: auto;
    line-height: 0;
    font-size: v-bind(fontSize);
}
</style>