import store from '@/store'
import router from '@/router'
import { throttle, timeFilter } from '@/util/throttle.js'
import iView from 'view-design'

import { CODE_KEY, MESSAGE_KEY, RESULT_KEY, SUCCESS_CODE } from './ajaxStruct'

export function resolve(response) {
	try {
		const oAjax = response.data || {}

		/**
		 * 第一种：超时，无效token，   需要重新登录的，
		 *      直接终止中止promise链，跳转到登录页
		 *
		 * */
		if ([500, 1002, 1006, 1011, 1012, 1013, 1014, 1015, 1017, 1018].indexOf(oAjax.code) >= 0) {
			timeFilter(
				'ajax_频繁通知',
				500
			)(function() {
				// 失效的提示, 0.5秒内, 最多只出现1条
				iView.Notice.error({
					title: '通知',
					desc: oAjax[MESSAGE_KEY]
				})
			})
			store.dispatch('handleLogOut')
			return new Promise(() => {}) // pending的promise，中止promise链
		} else if (SUCCESS_CODE.indexOf(oAjax.code) === -1) {
			/**
			 * 第二种：正常的提示，如:不允许删除，
			 *      提示报错信息，并 返回Promise.reject()，进入异常处理
			 * */
			let message = oAjax[MESSAGE_KEY]
			timeFilter(
				message || 'other',
				500
			)(function() {
				//  0.5秒内, 最多只出现1条
				iView.Notice.error({
					title: '通知',
					desc: message
				})
			})
			return Promise.reject() // 进入异常处理，
			// return new Promise(() => {}) // pending的promise，中止promise链
		} else {
			/**
			 * 第三种：正常的情况
			 *      返回正常的信息， 转换一下接口格式：防止接口随意更改
			 * */
			const newData = {
				r: oAjax[RESULT_KEY],
				m: oAjax[MESSAGE_KEY],
				c: oAjax[CODE_KEY],
				original: response
			} // 把接口数据 改为自己习惯的格式， 方便自己使用，  又保留原先的数据，防止有特殊的。

			return newData
		}
	} finally {
		store.commit('setLoadingAnimation', false)
	}
}

/**
 *
 * 当失败的时候怎么处理，这里的失败是程序状态上的失败  401，404，500，不是业务上的失败
 * */
export function reject(error) {
	store.commit('setLoadingAnimation', false)
	const response = error.response
	if (!response) {
		timeFilter(
			'ajax_网络错误',
			3000
		)(function() {
			// 失效的提示, 4秒内, 最多只出现1条
			iView.Notice.error({
				title: '通知',
				desc: '网络错误'
			})
		})
		return Promise.reject(error)
		// return new Promise(() => {}) // pending的promise，中止promise链
	}

	const msg = response.data.message || response.data.error
	iView.Notice.error({
		title: '通知',
		desc: msg
	})

	if (response.data.error === 'invalid_token' || response.data.error === 'unauthorized') {
		store.dispatch('handleLogin')
	}
	return Promise.reject(error)
}
