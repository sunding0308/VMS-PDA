import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		loadLocation:''
	},
	mutations:{
		setPlace(state,place){
			state.loadLocation = place
		}
	}
})

export default store