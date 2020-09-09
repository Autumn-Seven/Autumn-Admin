/**
 * Created by Seven on 2019/6/6.
 * project: Autumn
 * email: fighting20xx@126.com
 */

/** createRules方法： 为什么要封装这个方法？  表达验证太多了，每次写一遍太麻烦，
 *
 *
 *
 *      @param {*} customeRules ,  OriginalRules
 *      2个参数，第一个自定的规则，第二个原始的规则，
 *
 * 案例：
 ruleInline:createRules({
                name: ['required', 'len_32', 'special'],
                profileName: ['required', 'len_32', 'special'],
                gatewayId: ['required_change'],

            },{
                code: [
                    {required: true, message: '请输入', trigger: 'blur'},
                ],
            }),
 *
 * 最后合并成表单的规则。
 */
export const createRules = (customeRules = {}, OriginalRules = {}) => {
	const rule = {}
	function addRule(key, validator) {
		rule[key] ? rule[key].push(validator) : (rule[key] = [validator])
	}

	// 自定义的规则写法，
	for (const name in customeRules) {
		customeRules[name].forEach(function(key) {
			for (const myKey in RULES) {
				const myRule = RULES[myKey]

				if (myKey === key) {
					addRule(name, myRule)
				} else if (myRule.reg && myRule.reg.test(key)) {
					addRule(name, myRule.result(key.match(myRule.reg)))
				}
			}
		})
	}

	// 原始的规则 添加进去
	for (const key in OriginalRules) {
		OriginalRules[key].forEach(function(item) {
			addRule(key, item)
		})
	}
	// console.log(rule);
	return rule
}

/** *
 * 自己定义的规则：2种模式：
 *      1.名字相同的直接复制
 *      2.用正则表达式去匹配名字，如：len_20  对应  ---->  len_x
 *
 * **/

var RULES = {
	len_x: {
		type: 'len_x',
		reg: /^len_(0|[1-9]*)$/,
		result: function(match) {
			return {
				validator: function(rule, value, callback) {
					const len = parseInt(match[1])

					if (value.length > len) {
						callback(new Error(`最大长度${len}`))
					} else {
						callback()
					}
				}
			}
		}
	},
	num_max: {
		type: 'num_max',
		reg: /^num_(0|[1-9]\d*)$/,
		result: function(match) {
			return {
				validator: function(rule, value, callback) {
					const max = parseInt(match[1])

					if (Number(value) > max || Number(value) < 0) {
						callback(new Error(`最大值为${max}`))
					} else {
						callback()
					}
				}
			}
		}
	},
	float_max: {
		type: 'float_max',
		reg: /^float_(([-]?([1-9]\d*)(\.\d*[1-9])?)|([-]?0\.\d*[1-9])|0)$/,
		result: function(match) {
			return {
				validator: function(rule, value, callback) {
					const max = parseFloat(match[1])

					if (Number(value) > max || Number(value) < 0) {
						callback(new Error(`最大值为${max}`))
					} else {
						callback()
					}
				}
			}
		}
	},

	/**  输入如：type_string, type_number
     *
         string：必须是类型string。This is the default type.
         number：必须是类型number。
         boolean：必须是类型boolean。
         method：必须是类型function。
         regexp：必须是RegExp创建新项时不生成异常的实例或字符串RegExp。
         integer：必须是类型number和整数。
         float：必须是类型number和浮点数。
         array：必须是由...确定的数组Array.isArray。
         object：必须是类型object而不是Array.isArray。
         enum：价值必须存在于enum。
         date：值必须有效，由确定 Date
         url：必须是类型url。
         hex：必须是类型hex。
         email：必须是类型email。
     * */
	type_: {
		type: 'type_',
		reg: /^type_([a-zA-Z]*)$/,
		result: function(match) {
			const type = match[1]
			return {
				type: type,
				message: `必须是${type}类型`
			}
		}
	},

	num: {
		type: 'string',
		pattern: /^(0|[1-9]\d*)$/,
		message: '只能输入自然数'
	},
	integer: {
		pattern: /^([1-9][0-9]*)$/,
		message: '只能输入正整数'
	},

	required: {
		required: true,
		message: '不能为空',
		trigger: 'blur'
	},
	required_change: {
		required: true,
		message: '必选项',
		trigger: 'change'
	},
	required_change_number: {
		required: true,
		message: '必选项',
		trigger: 'change',
		type: 'number'
	},
	required_change_arr: {
		required: true,
		message: '不能为空',
		trigger: 'change',
		type: 'array'
	},
	// 中英文、数字、下划线、减号

	num_arr: {
		pattern: /^([1-9]+[,])*([1-9]+)$/,
		message: '只能输入正整数,以","隔开'
	},
	arr: {
		pattern: /^([\u4E00-\u9FA5A-Za-z0-9,]+[,])*([\u4E00-\u9FA5A-Za-z0-9]+)$/,
		message: '只能输入中文,数字,字母大小写,以","隔开'
	},
	ip: {
		pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
		message: '只能输入IP地址'
	},
	port: {
		validator: function(rule, value, callback) {
			if (!/^[0-9]+$/.test(value)) {
				callback(new Error('只能输入数字'))
			} else {
				var v = parseInt(value)
				if (v > 65535) {
					callback(new Error('端口号最大为65535'))
				} else {
					callback()
				}
			}
		}
	},
	email: {
		pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
		message: '请输入正确的邮箱'
	},
	phone: {
		pattern: /^[1]([3-9])[0-9]{9}$/,
		message: '请输入11位手机号'
	},

	commonStr: {
		validator: function(rule, value, callback) {
			if (value && !/^[A-Za-z0-9_\-\^\[\]\+\*·•.,.!，。！~!?@#${}%& ()=;<>|ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+$/.test(value)) {
				callback(new Error('支持数字、字母和常规字符'))
			} else if (typeof value === 'string' && value.length > 64) {
				callback(new Error('最大长度为64位'))
			} else {
				callback()
			}
		}
	},
	commonCNStr: {
		validator: function(rule, value, callback) {
			if (
				value &&
				!/^[\u4E00-\u9FA5A-Za-z0-9_\-\^\[\]\+\*·•.,.!，。！~!?@#${}%& ()=;<>|ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+$/.test(value)
			) {
				callback(new Error('支持中文、数字、字母和常规字符'))
			} else if (typeof value === 'string' && value.length > 64) {
				callback(new Error('最大长度为64位'))
			} else {
				callback()
			}
		}
	},
	commonNumber: {
		validator: function(rule, value, callback) {
			if (!((typeof value === 'number' && value !== Infinity) || /^[0-9]+$/.test(value))) {
				callback(new Error('必须数字类型'))
			} else {
				var v = typeof value === 'number' ? value : parseInt(value)
				if (!(v <= 20000 && v >= 0)) {
					callback(new Error('数字范围必须是 0 ~ 20000'))
				} else {
					callback()
				}
			}
		}
	},
	commonMinusNumber: {
		validator: function(rule, value, callback) {
			if (!((typeof value === 'number' && value !== Infinity) || /^(-)?[0-9]+$/.test(value))) {
				callback(new Error('必须数字类型'))
			} else {
				var v = typeof value === 'number' ? value : parseInt(value)
				if (!(v <= 20000 && v >= -20000)) {
					callback(new Error('数字范围必须是 -20000 ~ 20000'))
				} else {
					callback()
				}
			}
		}
	},
	customNumber: function([min = 0, max = 20000]) {
		return function(rule, value, callback) {
			if (!((typeof value === 'number' && value !== Infinity) || /^(-)?[0-9]+$/.test(value))) {
				callback(new Error('必须数字类型'))
			} else {
				var v = typeof value === 'number' ? value : parseInt(value)
				if (!(v <= max && v >= min)) {
					callback(new Error('数字范围必须是 ' + min + ' ~ ' + max))
				} else {
					callback()
				}
			}
		}
	}

	// special: {
	//     pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
	//     message: '不能输入特殊字符'
	// },
	// //英文大小写，数字，英文符号
	// special1: {
	//     pattern: /^[A-Za-z0-9\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]$/,
	//     message: '只能输入一个英文,数字,符号'
	// },
	// num_decimal: {
	//     pattern: /^((([1-9]\d*)(\.\d*[1-9])?)|(0\.\d*[1-9]))$/,
	//     message: '请输入正确的整数或小数'
	// },
	// num_decimal1: {
	//     pattern: /^(([-]?([1-9]\d*)(\.\d*[1-9])?)|([-]?0\.\d*[1-9])|0)$/,
	//     message: '请输入正确的整数或小数'
	// },
}

export default RULES

export function validate(name) {
	const myRule = RULES[name]
	if (typeof myRule === 'function') {
		return myRule([...arguments].splice(1))
	}
	if (myRule.validator) {
		return myRule.validator
	}

	return function(rule, value, callback) {
		if (value && !myRule.pattern.test(value)) {
			callback(new Error(myRule.message))
		} else {
			callback()
		}
	}
}
