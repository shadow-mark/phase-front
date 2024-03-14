<template>
    <DropDown class="drop_down" closeAfterSelection>
        <template #text>
            <div class="icon_box focus_change" @click="btnUserClickEvent" ref="user">
                <div class="img_clip" v-if="appStore.isLogin">
                    <WebImg v-if="appStore.avatarUrl" :src="appStore.avatarUrl" :position="position" alt="avatar" />
                    <div v-else class="no_image">
                        <div class="no_image_text">
                            {{ appStore.profile.nickname[0].toUpperCase() }}
                        </div>
                    </div>
                </div>
                <img v-else src="../../assets/ic_user.svg" alt="user">
                <SignDialog />
            </div>
        </template>

        <template #extend>
            <div id="hud_extend_content" v-show="appStore.isLogin">
                <OptionDialogButton text="账户" href="/account" />
                <OptionDialogButton text="个人档案" href="/archives" />
                <OptionDialogButton text="设置" href="/profile" />
                <div class="split" />
                <OptionDialogButton text="登出" @click="signOut" />
            </div>
        </template>
    </DropDown>
</template>

<script>
import { useAppStore } from '@/stores/appStore'
import { useStateStore } from '@/stores/stateStore'

import WebImg from '@/components/WebImg.vue';
import DropDown from '@/components/DropDown.vue';
import OptionDialogButton from '@/components/hud/OptionDialogButton.vue';
import SignDialog from '@/components/dialog/SignDialog.vue';

export default {
    setup() {
        const appStore = useAppStore();
        const stateStore = useStateStore();
        return { appStore, stateStore };
    },
    computed: {
        position() {
            let position = [100, 0, 0]
            let profile = this.appStore.profile
            if (profile.avatar && profile.avatar != "") {
                position = profile.avatar.split("~")[1].split(";")
            }
            return {
                size: parseInt(position[0]),
                x: parseInt(position[1]),
                y: parseInt(position[2]),
            }
        }
    },
    methods: {
        btnUserClickEvent() {
            if (!this.appStore.isLogin) {
                this.stateStore.openSignDialog()
            }
        },
        signOut() {
            this.appStore.routerPush("/")
            this.appStore.setProfile({})
            this.appStore.setIsLogin(false)
            this.$cookies.remove("token")
            location.reload()
        }
    },
    components: { WebImg, DropDown, OptionDialogButton, SignDialog }
}
</script>

<style scoped>
.drop_down {
    margin-left: auto;

}

.icon_box {
    height: 2rem;
    width: 2rem;
    padding: .25rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .6);
    cursor: pointer;
    margin: auto 0;
}

.focus_change:hover {
    transform: scale(1.05);
}

.img_clip {
    border-radius: 50%;
    height: 100%;
    overflow: hidden;
}

.no_image {
    height: 100%;
    width: 100%;
    display: flex;
    background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}

img {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
}

.no_image_text {
    margin: auto;
    line-height: 0;
}

#hud_extend_content {
    width: 11rem;
    position: relative;
    top: -0.5rem;
    left: -8.25rem;
    padding: .2rem;
    background-color: rgb(0, 0, 0);
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--color-background-soft);
}

.split {
    width: 90%;
    height: 1px;
    position: absolute;
    left: .52rem;
    background-color: var(--color-background-mute);
}
</style>