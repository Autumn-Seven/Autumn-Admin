import axios from 'axios'
import qs from 'qs'
import AJAX_SOURCE from './ajaxSource'
import { resolve as ajaxRequestResolveIntercept, reject as ajaxRequestRejectIntercept } from './ajax-request-intercept'
import {
	resolve as ajaxResponseResolveIntercept,
	reject as ajaxResponseRejectIntercept
} from './ajax-response-intercept'

/**
 * Ajax 全局引用。
 *     this.$ajax(oSource, oOptions).post().then()
 *  如 this.$ajax(z).post().then()
 *
 *   @param {String|undefined} oSource  使用的接口源，在ajaxSource.文件中定义 默认AJAX_DEFAULT ， AJAX_ELN ......
 *   @param {Object|undefined} oOptions {token, timeout}  配置参数可以直接加入axios的参数   //http://www.axios-js.com/zh-cn/docs/#axios-request-config
 * @return {Axios} 返回的是一个伪 Axios 对象。
 */
export const ajax = function(
	sSource,
	oOptions = {
		withCredentials: false
	}
) {
	const nTimeout = oOptions.timeout || 20 * 1000 // 超时时间20秒。
	// 接口源基础地址。
	const sBaseUrl = AJAX_SOURCE[sSource] || sSource || AJAX_SOURCE[AJAX_SOURCE['AJAX_DEFAULT']] // 有3种形式，1找源， 2直接填入baseURl，3不填写的情况下默认plm

	/**  this.$ajax().post('url', data, config).then()
	 *   this.$ajax().post('file/unlock', fileIds, ).then()
	 *     @param {String} url               目标地址 （请求地址=oSource源地址+这个目标地址 ）  （注：找不到源的情况：请求地址=目标地址。如： oSource=http://www.baidu.com）
	 *     @param {String} data              接口携带的数据
	 *     @param {String} config            axios的配置参数
	 * */
	const oAgents = {}
	const fnAgentDo = (sAction, aoArguments) => {
		const config = aoArguments[2] || {}
		// 创建一个 axios 实例。
		const oAxios = axios.create(
			Object.assign(
				{
					baseURL: sBaseUrl,
					timeout: nTimeout
				},
				config,
				oOptions
			)
		)

		// 设置代理。
		if (ajaxRequestResolveIntercept && ajaxRequestRejectIntercept) {
			oAxios.interceptors.request.use(ajaxRequestResolveIntercept, ajaxRequestRejectIntercept)
		}
		if (ajaxResponseResolveIntercept && ajaxResponseRejectIntercept) {
			oAxios.interceptors.response.use(ajaxResponseResolveIntercept, ajaxResponseRejectIntercept)
		}

		// 调用 axios 实例对应的方法。
		return oAxios[sAction].call(
			oAxios,
			aoArguments[0],
			oOptions.transformForm ? qs.stringify(aoArguments[1]) : aoArguments[1] // 转换为表单方式提交
		)
	}

	// 为各个动作绑定代理的动作函数。
	;['request', 'get', 'delete', 'head', 'options', 'post', 'put', 'patch'].forEach(sAction => {
		oAgents[sAction] = function() {
			return fnAgentDo(sAction, arguments)
		}
	})
	return oAgents
}

const Ajax = {
	/**
	 * Vue 注册方法, 注册到全局。
	 */
	install(Vue) {
		Vue.$ajax = Vue.prototype.$ajax = ajax
	}
}
export default Ajax
