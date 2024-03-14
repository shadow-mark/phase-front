<template>
    <Card id="option_box">
        <div id="option_title_box">
            {{ title }}
        </div>
        <AccountOptionBoxItem v-for="(option, index) in options" :text="option.text" :href="option.href"
            :img="option.img" @click="go(index)" />
    </Card>
</template>

<script>
import Card from '../Card.vue';
import AccountOptionBoxItem from './AccountOptionBoxItem.vue';

export default {
    props: {
        title: {
            type: String,
            default: "Null"
        },
        options: {
            type: Array,
            default: []
        }
    },
    methods: {
        go(index) {
            this.options[index].onClick()
        }
    },
    components: { Card, AccountOptionBoxItem }
}
</script>

<style scoped>
#option_box {
    max-width: 40vw;
    width: 70%;
    height: min-content;
    background-color: #121212;
    margin: 0 auto;
    padding: 1rem 0;
}

#option_title_box {
    width: 100%;
    padding: 0 1rem 1rem 1rem;
    font-size: 1.5rem;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>