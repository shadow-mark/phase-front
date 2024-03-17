import { getCurrentInstance } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
    state: () => ({
        axios: Object,
        profile: {},
        follows: [],
        collections: [],
        themeColor: [141, 219, 230],
        isLogin: false,
        router: {
            currLayout: 0,
            allLayout: 0,
            router: Object,
            route: Object,
        },
        nowVisitItem: Object,
        profiles: [],
    }),
    actions: {
        getUserById(id) {
            let index = this.profiles.findIndex((it) => it.id === id);
            if (index !== -1) return this.profiles[index];
            else {
                index = this.profiles.length;
                this.profiles.push({ id: id });
                this.axios({
                    url: `/profile/get/${id}`,
                }).then((res) => {
                    if (res.data.status) {
                        let data = res.data.data;
                        let item = this.profiles[index];
                        item.id = data.userId;
                        item.avatar = data.avatar;
                        item.nickname = data.nickname;
                    }
                });
                return this.profiles[index];
            }
        },
        setNowVisitItem(value) {
            this.nowVisitItem = value;
        },
        removeItemOfLabrarys(value) {
            this.librarys.forEach((item, index, arr) => {
                if (item.type === value.type && item.id === value.id) {
                    arr.splice(index, 1);
                }
            });
        },
        setAvatar(value) {
            this.profile.avatar = value;
        },
        setProfile(profile) {
            this.profile = profile;
            this.isLogin = true;
            this.getCollection();
        },
        setIsLogin(value) {
            this.isLogin = value;
        },
        getProfile() {
            this.axios({
                url: "/profile/get",
            }).then((res) => {
                if (res.data.status) {
                    this.profile = res.data.data;
                }
            });
        },
        getFollow() {
            this.axios({
                url: "/follow/get",
            }).then((res) => {
                if (res.data.status) {
                    this.follows = res.data.data;
                    this.arrangeLibrarys();
                }
            });
        },
        getCollection() {
            this.axios({
                url: "/collection/own",
            }).then((res) => {
                if (res.data.status) {
                    this.collections = res.data.data;
                }
            });
        },
        createCollection() {
            this.axios({
                url: "/collection/generate",
            }).then((res) => {
                if (res.data.status) {
                    let result = res.data.data;
                    this.addLibrary({
                        type: "collection",
                        id: result.id,
                        title: result.title,
                    });
                }
            });
        },
        addCollection(value) {
            let index = this.collections.findIndex((it) => it.id === value.id);
            if (index !== -1) {
                this.collections[index] = value;
            } else {
                this.collections.push(value);
            }
        },
        changeCollectionCover(id, value) {
            this.librarys.find(
                (item) => item.type === "collection" && item.id === id
            ).img = value;
        },
        changeCollection(value) {
            let temp = this.librarys.find(
                (item) => item.type === "collection" && item.id === value.id
            );
            temp.text = value.title;
            temp.img = value.cover;
            temp.level = value.level;
        },
        arrangeLibrarys() {
            this.librarys.splice(1, this.librarys.length - 1);
            this.librarys.push.apply(this.librarys, this.follows);
            this.librarys.push.apply(this.librarys, this.collections);
        },
        addLibrary(value) {
            this.librarys.push(value);
            this.collections.push(value);
        },
        setThemeColor(value) {
            this.themeColor = value;
        },
        setRouter(router, route) {
            this.router.router = router;
            this.router.route = route;
        },
        routerNext() {
            if (this.hasNext) {
                this.router.router.forward();
                this.router.currLayout++;
            }
        },
        routerBack() {
            if (this.hasBack) {
                this.router.router.back();
                this.router.currLayout--;
            }
        },
        routerPush(path) {
            if (this.router.route.fullPath === path) {
                this.router.router.replace({
                    path: path,
                });
            } else {
                this.router.router.push({
                    path: path,
                });
                this.router.currLayout++;
                this.router.allLayout = this.router.currLayout;
            }
        },
        mouseListent(event) {
            if (event.button === 3) {
                this.router.currLayout--;
            } else if (event.button === 4) {
                this.router.currLayout++;
            }
        },
    },
    getters: {
        librarys() {
            let librarys = this.collections.map((it) => {
                it.type = "collection";
                it.edit = true;
                return it;
            });
            // this.collections.concat
            return librarys;
        },
        hasNext() {
            return this.router.currLayout < this.router.allLayout;
        },
        hasBack() {
            return this.router.currLayout > 0;
        },
        avatarUrl() {
            return this.profile.avatar
                ? `${this.axios.defaults.baseURL}/profile/${
                      this.profile.userId
                  }/avatar/download/${this.profile.avatar.split("~")[0]}`
                : undefined;
        },
    },
});
