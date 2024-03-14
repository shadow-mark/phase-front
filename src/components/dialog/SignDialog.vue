<template>
    <Dialog :visible="stateStore.signDialogState" @clickMaskListen="close" isMask>
        <Card id="sign_box">
            <div id="masking_box" :class="{ marking_to_register: !mode, marking_to_login: mode }">
                <div v-if="mode" class="title">
                    <h1>没有账号？</h1>
                    <p>立即注册加入我们！</p>
                    <div class="btn" @click="changeMode">
                        注册
                    </div>
                </div>
                <div v-else class="title">
                    <h1>已有账号?</h1>
                    <p>请使用你的账号登录</p>
                    <div class="btn" @click="changeMode">
                        登录
                    </div>
                </div>
            </div>
            <div id="form_content" :class="{ form_to_register: !mode, form_to_login: mode && !flag }">
                <div class="form" v-if="status">
                    <h1>登录</h1>
                    <div class="input_box login_box">
                        <EditText v-model="user.username" placeholder="用户名" />
                        <EditText type="password" v-model="user.password" placeholder="密码" />
                    </div>
                    <div class="btn" @click="login">
                        登录
                    </div>
                </div>
                <div class="form" v-else>
                    <h1>注册</h1>
                    <div class="input_box register_box">
                        <EditText v-model="user.username" placeholder="用户名" />
                        <EditText type="password" v-model="user.password" placeholder="密码" />
                        <EditText type="email" v-model="user.eMail" placeholder="邮箱" />
                    </div>
                    <div class="btn" @click="register">
                        注册
                    </div>
                </div>
            </div>
        </Card>
    </Dialog>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'

import Card from '@/components/Card.vue'
import EditText from '@/components/edit/EditText.vue'
import Dialog from '@/components/dialog/Dialog.vue'

export default {
    setup() {
        const appStore = useAppStore()
        const stateStore = useStateStore()
        return { appStore, stateStore }
    },
    mounted() {
        var that = this
        document.onkeydown = function () {
            var key = window.event.keyCode
            if (key === 13) {
                if (that.mode) {
                    that.login()
                } else {
                    that.register()
                }
            }
        }
    },
    data() {
        return {
            user: {
                username: "",
                password: "",
                eMail: ""
            },
            flag: true,
            mode: true,
            status: true,
            animat: false
        }
    },
    methods: {
        close() {
            this.stateStore.closeSignDialog()
        },
        login() {
            this.$axios({
                method: "POST",
                url: "/user/login",
                data: this.user
            }).then((res) => {
                if (res.data.status === true) {
                    this.appStore.setProfile(res.data.data)
                    this.stateStore.closeSignDialog()
                }
            });
            document.onkeydown = null
        },
        register() {
            this.$axios({
                method: "POST",
                url: "/user/register",
                data: this.user,
            }).then((res) => {
                if (res.data.status === true) {
                    this.appStore.setProfile(res.data.data)
                    this.appStore.getFollow();
                    this.appStore.getCollection();
                    this.stateStore.closeSignDialog()
                }
            })
            document.onkeydown = null
        },
        reset() {
            this.user = {
                username: "",
                password: "",
                eMail: ""
            }
        },
        changeMode() {
            if (!this.animat) {
                this.mode = !this.mode
                this.animat = true
                setTimeout(() => {
                    this.animat = false
                }, 1000)
                setTimeout(() => {
                    this.status = this.mode
                    this.reset()
                }, 310)
                this.flag = false
            }
        }
    },
    components: { Card, EditText, Dialog }
}
</script>

<style scoped>
#sign_box {
    display: flex;
    margin: auto;
    width: 54rem;
    height: 35rem;
    min-width: 54rem;
    min-height: 35rem;
    border-radius: 2rem;
    background-color: var(--color-background-soft);
}

#masking_box {
    display: flex;
    width: 50%;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: var(--color-background-mute);
    padding: 3rem;
    z-index: 199;
    overflow: hidden;
}

.title {
    position: relative;
    top: -1rem;
    width: 100%;
    margin: auto;
}

.title>h1,
.title>p {
    margin: 3rem;
}

h1 {
    margin: 1rem;
}

p {
    margin: 1rem;
}

.btn {
    position: relative;
    height: 2.5rem;
    text-align: center;
    border-radius: 2rem;
    background-color: var(--color-button);
    line-height: 2.5rem;
    cursor: pointer;
    overflow: hidden;
    transition: background-color .25s;
}

.btn::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-image: radial-gradient(circle, #ccc 10%, transparent 10.1%);
    transform: scale(10);
    opacity: 0;
    transition: all .6s;
}

.btn:active::after {
    transform: scale(0);
    opacity: .5;
    transition: 0s;
}

.btn:hover {
    background-color: var(--color-button-hover);
}

#form_content {
    width: 50%;
    padding: 2rem;
}

.form {
    width: 100%;
    height: 100%;
}

.input_box {
    display: flex;
    flex-wrap: wrap;
    height: 60%;
    gap: 2rem;
}

.login_box {
    padding: 20% 0;
}

.register_box {
    padding: 10% 0;
}

.btn_form {
    margin-top: 2rem;
}

.marking_to_register {
    transform: translateX(100%);
    border-radius: 0rem 2rem 2rem 0rem;
    animation: 1s marking_to_register;
}

.marking_to_login {
    transform: translateX(0%);
    border-radius: 2rem 0rem 0rem 2rem;
    animation: 1s marking_to_login;
}


@keyframes marking_to_register {
    from {
        transform: translateX(0%);
        border-radius: 2rem 0rem 0rem 2rem;
    }

    to {
        transform: translateX(100%);
        border-radius: 0rem 2rem 2rem 0rem;
    }
}

@keyframes marking_to_login {
    from {
        transform: translateX(100%);
        border-radius: 0rem 2rem 2rem 0rem;
    }

    to {
        transform: translateX(0%);
        border-radius: 2rem 0 0 2rem;
    }
}

.form_to_register {
    transform: translateX(-100%);
    text-align: right;
    animation: 1s form_to_register;
}

.form_to_login {
    transform: translateX(0%);
    text-align: left;
    animation: 1s form_to_login;
}

@keyframes form_to_register {
    from {
        transform: translateX(0%);
        text-align: left;
    }

    to {
        transform: translateX(-100%);
        text-align: right;
    }
}

@keyframes form_to_login {
    from {
        transform: translateX(-100%);
        text-align: right;
    }

    to {
        transform: translateX(0%);
        text-align: left;
    }
}
</style>