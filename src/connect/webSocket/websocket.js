/**
 * stomp over websocket
 *
 * @since 2019-08-23
 * @version 1.0
 * @author Seven
 */

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
;(function() {
	var global = window

	var reconnectTimer = null

	var DEFAULT_CONFIGS = {
		url: '',
		heartbeat: 2000,
		autoReconnect: 2000,
		onerror: () => {}
	}

	// 注册到全局。
	global.STOMP_CLIENT = STOMP_CLIENT
	/**
	 * webSocket 组件主体。
	 * @param {Object} oConfigs 配置项。
	 */
	function STOMP_CLIENT(oConfigs) {
		// 合并参数。
		var mergeConfigs = $.extend(true, $.extend(true, {}, DEFAULT_CONFIGS), oConfigs)

		var socket = null

		var stompClient = null

		/**
		 * 当加载之后，就开始发起连接，
		 * */
		function connect() {
			stompClient && stompClient.disconnect()
			// 建立连接对象
			socket = new SockJS(mergeConfigs.url) // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息

			// 获取STOMP子协议的客户端对象
			stompClient = Stomp.over(socket)
			// 定义客户端的认证信息,按需求配置   如果不需要认证，可以为{}

			// 心跳2秒
			stompClient.heartbeat.outgoing = mergeConfigs.heartbeat

			// 向服务器发起websocket连接
			stompClient.connect(
				{},
				frame => {
					subscribe()
				},
				err => {
					mergeConfigs.onerror()
					autoReconnect()
				}
			)
		}
		connect()

		/**
		 * 订阅，当连接上之后再订阅
		 * */
		function subscribe() {
			var topicObj = mergeConfigs.subscribe || {}
			var topicArry = Object.keys(topicObj)

			topicArry.forEach(function(topic) {
				var cb = topicObj[topic]
				stompClient.subscribe(topic, cb)
			})
		}

		/**
		 * 根据设置的自动重连参数，  自动重连
		 * */
		function autoReconnect() {
			if (mergeConfigs.autoReconnect) {
				console.log('自动重连......')
				reconnectTimer && clearTimeout(reconnectTimer)
				reconnectTimer = setTimeout(function() {
					connect()
				}, mergeConfigs.autoReconnect)
			}
		}

		// 公共属性或对象。
		return stompClient
	}

	var $ = {
		extend: function(deep, target, options) {
			for (var name in options) {
				var copy = options[name]
				if (!copy) {
					target[name] = options[name]
				} else if (copy instanceof Function) {
					target[name] = options[name]
				} else if (deep && copy instanceof Array) {
					target[name] = $.extend(deep, [], copy)
				} else if (deep && copy instanceof Object) {
					target[name] = $.extend(deep, {}, copy)
				} else {
					target[name] = options[name]
				}
			}
			return target
		}
	}
})(window)

export default window.STOMP_CLIENT
