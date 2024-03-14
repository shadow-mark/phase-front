<template>
    <div id="account_content">
        <AccountOptionBox v-for="form in forms" :title="form.title" :options="form.options" />
    </div>
</template>

<script>
import AccountOptionBox from '../components/account/AccountOptionBox.vue';

export default {
    data() {
        return {
            forms: [
                {
                    title: "安全和隐私",
                    options: [
                        {
                            text: "验证邮箱",
                            img: new URL("../assets/ic_auth.svg", import.meta.url).href,
                            onClick: () => {
                                this.$axios({
                                    url: "/security/generate"
                                }).then((res) => {
                                    console.log(res.data.data)
                                })
                            }
                        },
                        {
                            text: "更改密码",
                            img: new URL("../assets/ic_lock.svg", import.meta.url).href
                        },
                    ]
                },
            ]
        }
    },
    components: { AccountOptionBox }
}
</script>

<style scoped>
#account_content {
    display: flex;
    width: 100%;
    padding: 5rem;
}
</style>