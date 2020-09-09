import { func } from 'assert-plus'

/*
 * 定义 API 接口源名称。
 * 便于在 this.$ajax(AJAX_VS) 的地方使用。
 */

const source = {
	/**
	 * 域名
	 */
	AJAX_ORIGIN: '',

	/**
	 *eln源
	 */
	AJAX_ELN: 'eln',
	eln: '',

	/**
	 * 默认源
	 */
	AJAX_DEFAULT: 'eln' // 不填写的情况，默认使用的源
}

export function setAjaxBase(base) {
	source.AJAX_ORIGIN = base
	source.eln = base + '/api/v1/'
}

export default source
