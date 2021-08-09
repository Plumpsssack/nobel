const state = () => ({
    showNav: false
});

const mutations = {
    showNav(state) {
        state.showNav = true;
    }
}

const actions = {
    showNav(vuexContext) {
        vuexContext.commit("showNav");
    }
}

const getters = {
    nav(state) {
        return state.showNav
    }
};

export { state, mutations, actions, getters }