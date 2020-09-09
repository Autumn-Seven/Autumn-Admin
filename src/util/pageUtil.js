import { Message, Modal } from 'view-design'
export const hasCheckRowNumber = function(selectList, mul) {
	let len = selectList.length

	if (mul) {
		if (len <= 0) {
			Message.error('请至少选择一条记录!')
			return false
		} else {
			return true
		}
	} else {
		if (len <= 0) {
			Message.error('请选择一条记录!')
			return false
		} else if (len === 1) {
			return true
		} else {
			Message.error('只能选择一条记录!')
			return false
		}
	}
}
