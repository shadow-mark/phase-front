<template>
    <div id="search_content">
        <input class="media-time" type="range" min="0" max="100" :value="2">
    </div>
</template>

<script>

export default {

}
</script>

<style scoped>
#search_content {
    padding-top: 5rem;
}

.media-time {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: -webkit-linear-gradient(#fff, #fff) no-repeat, #4d4d4d;
    border-radius: 0.2rem;
    width: 35vw;
    min-width: 22rem;
    height: 0.4rem;
    margin: 0.65rem 1rem 0 1rem;
    background-size: v-bind("progress + '%'");
}

.media-time:hover {
    background: -webkit-linear-gradient(#1db954, #1db954) no-repeat, #4d4d4d;
}

.media-time::-webkit-slider-thumb {
    -webkit-appearance: none;
}

.media-time:hover::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: .75rem;
    width: .75rem;
    background: #fff;
    border-radius: 50%;
    border: solid 1px #ddd;
}
</style>