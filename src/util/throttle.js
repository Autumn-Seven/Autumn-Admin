/**
 * Created by Seven on 2019/9/9.
 * project: Autumn
 * email: fighting20xx@126.com
 */

/**
 *
 * 时间过滤器, 规定的间隔时间内只能执行一次,, 舍去后面的，
 * @param {(Function)} fn
 * @param {number} [delay=0] Unit: ms. *
 * */

const timerTemp = {}
export function timeFilter(name, delay = 100) {
	if (!name) {
		throw Error('必须传一个名字')
	}

	return function(fn) {
		var currentTime = new Date().getTime()
		var lastExecTime = timerTemp[name]

		if (!lastExecTime) {
			timerTemp[name] = new Date().getTime() // 更新时间
			fn()
		} else if (currentTime - lastExecTime > delay) {
			// console.log(currentTime - lastExecTime > delay)
			timerTemp[name] = new Date().getTime() // 更新时间
			fn()
		}
	}
}

/**
 *
 * 时间过滤器, 规定的间隔时间内只能执行一次，  舍去之前的。
 * @param {(Function)} fn
 * @param {number} [delay=0] Unit: ms. *
 * */

const throttle = function(func, wait, options) {
	var timer, context, args, result

	// 上一次执行回调的时间戳
	var previous = 0

	// 无传入参数时，初始化 options 为空对象
	if (!options) options = {}

	var later = function() {
		// 当设置 { leading: false } 时
		// 每次触发回调函数后设置 previous 为 0
		// 不然为当前时间
		previous = options.leading === false ? 0 : new Date().getTime()

		// 防止内存泄漏，置为 null 便于后面根据 !timer 设置新的 timer
		timer = null

		// 执行函数
		result = func.apply(context, args)
		if (!timer) context = args = null
	}

	// 每次触发事件回调都执行这个函数
	// 函数内判断是否执行 func
	// func 才是我们业务层代码想要执行的函数
	var throttled = function() {
		// 记录当前时间
		var now = new Date().getTime()

		// 第一次执行时（此时 previous 为 0，之后为上一次时间戳）
		// 并且设置了 { leading: false }（表示第一次回调不执行）
		// 此时设置 previous 为当前值，表示刚执行过，本次就不执行了
		if (!previous && options.leading === false) previous = now

		// 距离下次触发 func 还需要等待的时间
		var remaining = wait - (now - previous)
		context = this
		args = arguments

		// 要么是到了间隔时间了，随即触发方法（remaining <= 0）
		// 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
		// 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
		// 之后便会把 previous 值迅速置为 now
		if (remaining <= 0 || remaining > wait) {
			if (timer) {
				clearTimeout(timer)

				// clearTimeout(timer) 并不会把 timer 设为 null
				// 手动设置，便于后续判断
				timer = null
			}

			// 设置 previous 为当前时间
			previous = now

			// 执行 func 函数
			result = func.apply(context, args)
			if (!timer) context = args = null
		} else if (!timer && options.trailing !== false) {
			// 最后一次需要触发的情况
			// 如果已经存在一个定时器，则不会进入该 if 分支
			// 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
			// 间隔 remaining milliseconds 后触发 later 方法
			timer = setTimeout(later, remaining)
		}
		return result
	}

	// 手动取消
	throttled.cancel = function() {
		clearTimeout(timer)
		previous = 0
		timer = context = args = null
	}

	// 执行 _.throttle 返回 throttled 函数
	return throttled
}
