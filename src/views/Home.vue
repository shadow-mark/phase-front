<template>
    <div id="welcome-title">
        {{ welcomeMsg }}
    </div>
</template>

<script>
export default {
    computed: {
        welcomeMsg() {
            var myDate = new Date;
            var hours = myDate.getHours();
            if (hours <= 11) {
                return "早安"
            } else if (hours <= 17) {
                return "午安"
            } else {
                return "晚安"
            }
        }
    },
}
</script>

<style scoped>
#welcome-title {
    height: 100%;
}
</style>