import store from '@/store'

export function resolve(oConfig) {
	store.commit('setLoadingAnimation', true)

	if (!store.state.ajaxBaseUrl) {
		store.dispatch('handleLogin')
	}

	if (oConfig.withoutAuthorization) {
	} else {
		const sToken = store.state.user.token
		oConfig.headers.Authorization = sToken
	}
	return oConfig
}

export function reject(oError) {
	return Promise.reject(oError)
}
