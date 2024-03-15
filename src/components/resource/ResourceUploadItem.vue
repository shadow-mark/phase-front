<template>
    <div id="resource_upload_item_content">
        <label class="edit_box" for="file">
            <EditText class="edit_text" v-model="file.other" :placeholder="'标题'" />
            <input id="file" v-show="false" type="file" :accept="fileType" @change="handleFileChange">
            <div class="file_tip">
                {{ filename }}
            </div>
        </label>
        <Button @click="save" :loading="loading" v-show="isChange">
            保存
        </Button>
    </div>
</template>

<script>
import DropDown from '@/components/DropDown.vue'
import EditText from '@/components/edit/EditText.vue'
import Button from '@/components/Button.vue';

export default {
    props: {
        file: {},
        type: {
            type: Number,
            default: 0
        },
        check: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            uploadFile: undefined,
            isChange: false,
            fileCopy: undefined,
            countResult: 2
        }
    },
    computed: {
        fileType() {
            let type = ""
            if (this.type === 1) {
                type = "image/*,.pdf"
            } else if (this.type === 2 || this.type === 3) {
                type = "audio/*,video/*"
            }
            return type
        },
        loading() {
            return this.countResult < 2
        },
        filename() {
            if (this.file.filename === "" && this.uploadFile === undefined) return "未上传文件"
            else if (this.uploadFile !== undefined) return "存在待上传文件"
            else return "文件已上传"
        }
    },
    methods: {
        modify() {
            this.$axios({
                method: "POST",
                url: "/file/modify",
                data: {
                    id: this.file.id,
                    other: this.file.other
                }
            }).then((res) => {
                if (res.data.status) {
                    let result = res.data.data
                    this.file.other = result.other
                    this.file.filename = result.filename
                }
                this.countResult++
            })
        },
        upload() {
            if (this.uploadFile === undefined || this.file.id === undefined) {
                this.countResult++
                return
            }
            let data = new FormData()
            data.append("file", this.uploadFile)
            this.$axios({
                method: "POST",
                url: `/file/upload/${this.file.id}`,
                data: data
            }).then((res) => {
                if (res.data.status) {
                    this.file.filename = res.data.data
                    this.uploadFile = undefined
                }
                this.countResult++
            })
        },
        save() {
            if (this.loading) return
            this.countResult = 0
            this.modify()
            this.upload()
        },
        handleFileChange(e) {
            const file = e.target.files[0]
            if (this.type === 1 && file.type.split("/")[0] !== "image") return
            else if ((this.type === 2 || this.type === 3) && (file.type.split("/")[0] !== "audio" && file.type.split("/")[0] !== "video")) return
            this.uploadFile = file
            this.isChange = true
        }
    },
    watch: {
        file: {
            handler(newVal) {
                if (this.fileCopy === undefined) this.fileCopy = { ...newVal }
                if (newVal.other !== this.fileCopy.other || newVal.detail !== this.fileCopy.detail) {
                    this.isChange = true
                } else if (this.uploadFile === undefined) {
                    this.isChange = false
                }
            },
            immediate: true,
            deep: true
        }
    },
    components: { DropDown, EditText, Button }
}
</script>

<style scoped>
#resource_upload_item_content {
    border: v-bind("check ? '2px solid var(--color-edit-focus)' : '2px solid var(--color-edit)'");
    border-radius: .5rem;
    padding: .5rem;
    margin: 1rem 0;
}

.edit_box {
    position: relative;
    display: flex;
    cursor: pointer;
}

.edit_text {
    margin: 0 .25rem;
}

.file_tip {
    position: absolute;
    top: -.25rem;
    right: 0;
    color: var(--color-edit);
}
</style>