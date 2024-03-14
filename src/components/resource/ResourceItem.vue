import WebImg from '@/components/WebImg.vue';
<template>
    <ContextMenu class="test" ref="menu">
        <template #text>
            <div id="resource_item_content">
                <div class="masking"></div>
                <div class="item_detail">
                    <div class="item_index">
                        {{ index + 1 }}
                    </div>
                    <div class="item_title">
                        <div class="title_img">
                            <Cover :src="img" :position="position" :alt="item.title" />
                        </div>
                        <div class="title_text">{{ item.title }}</div>
                    </div>
                </div>
                <div class="option_box">
                    <DropDown ref="drop" closeAfterSelection>
                        <template #text>
                            <div class="option_img"></div>
                        </template>
                        <template #extend>
                            <ResourceMenu class="menu" :resource="item" :index="index" v-bind="$attrs" />
                        </template>
                    </DropDown>
                </div>
            </div>
        </template>
        <template #menu>
            <ResourceMenu :resource="item" :index="index" v-bind="$attrs" />
        </template>
    </ContextMenu>

</template>

<script>
import Cover from "@/components/Cover.vue"
import DropDown from '@/components/DropDown.vue';
import ResourceMenu from '@/components/resource/ResourceMenu.vue'
import ContextMenu from '@/components/menu/ContextMenu.vue';

export default {
    props: {
        item: {},
        index: 0
    },
    computed: {
        img() {
            return this.item.cover && this.item.cover !== ""
                ? `${this.$axios.defaults.baseURL}/resource/${this.item.id
                }/cover/download/${this.item.cover.split("~")[0]}`
                : undefined;
        },
        position() {
            let position = [100, 0, 0]
            let item = this.item
            if (item.cover && item.cover != "") {
                position = item.cover.split("~")[1].split(";").map((it) => {
                    return parseInt(it)
                })
            }
            return {
                size: position[0],
                x: position[1],
                y: position[2],
            }
        },
        focus() {
            return this.$refs.menu.realTextFocus || this.$refs.drop.realTextFocus
        }
    },
    components: { Cover, DropDown, ResourceMenu, ContextMenu }
}
</script>

<style scoped>
#resource_item_content {
    position: relative;
    height: 4rem;
    display: flex;
}

.test:focus .masking {
    background-color: aliceblue;
}

#resource_item_content:hover .masking {
    display: flex;
}

#resource_item_content:hover .option_img {
    display: flex;
}

.masking {
    display: v-bind("focus ? 'flex' : 'none'");
    position: absolute;
    width: 100%;
    height: 4rem;
    border-radius: .35rem;
    background-color: v-bind("focus ? 'rgba(0, 0, 0, .6)' : 'rgba(0, 0, 0, .2)'");
    z-index: -1;
}

.item_detail {
    display: flex;
}

.item_index,
.item_title {
    margin: auto 0;
    display: flex;
    line-height: 4rem;
}

.item_index {
    padding: 0 1rem;
}

.title_img {
    border-radius: .25rem;
    overflow: hidden;
    width: 2.5rem;
    height: 2.5rem;
}

.title_text {
    line-height: 2.5rem;
    margin-left: .5rem;
}

.option_box {
    display: flex;
    height: 4rem;
    width: 2.5rem;
    margin-left: auto;
}

.option_img {
    display: none;
    margin: auto;
    width: 2rem;
    height: 2rem;
    background-image: url(@/assets/ic_options_horizontal.svg);
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
}

.menu {
    position: absolute;
    top: -.75rem;
    right: 0;
}
</style>