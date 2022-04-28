const state = () => ({
    currentInstrumentId: null
});


const mutations = {
    setCurrentInstrumentId(state, instrumentId) {
        state.currentInstrumentId = instrumentId;
    }
}
const actions = {
    setCurrentInstrumentId(vuexContext, instrumentId) {
        vuexContext.commit("setCurrentInstrumentId", instrumentId);
    }
}
const getters = {
    currentInstrumentId(state) {
        return state.currentInstrumentId;
    }
}
export { state, getters, actions, mutations }