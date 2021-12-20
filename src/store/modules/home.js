import axios from "axios";

const state = {
    teaser: [
        {
            app_id: 1,
            title: "Teaser App One",
            logo_image: "../../assets/logo.png",
            banner_image: "https://picsum.photos/1024/200/",
        },
        {
            app_id: 2,
            title: "Teaser App Two",
            logo_image: "../../assets/logo.png",
            banner_image: "https://picsum.photos/1024/200/",
        },
        {
            app_id: 3,
            title: "Teaser App Three",
            logo_image: "../../assets/logo.png",
            banner_image: "https://picsum.photos/1024/200/",
        },
    ],
    featured: [
        {
            app_id: 4,
            title: "Feature App One",
            logo_image: "../../assets/logo.png",
            banner_image: "https://picsum.photos/1024/200/",
        },
        {
            app_id: 5,
            title: "Feature App Two",
            logo_image: "../../assets/logo.png",
            banner_image: "https://picsum.photos/1024/200/",
        },
        {
            app_id: 6,
            title: "Feature App Three",
            logo_image: "../../assets/logo.png",
            banner_image: "https://picsum.photos/1024/200/",
        },
    ],
};

const getters = {
    getTeaserApps: (state) => state.teaser,
    getFeaturedApps: (state) => state.featured
};

const actions = {};

const mutations = {};

export default {
    state,
    getters,
    actions,
    mutations,
}
