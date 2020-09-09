/**
 * Created by Seven on 2020/3/3.
 * project: plm-admin-frontend
 * email: fighting20xx@126.com
 */

/**
 * 转换treedata数据格式
 *   treeList = []
 *   transformObj = {oldKey1:newKey1, oldKey2:newKey2, ...   newKey：value}
 *                 第一种：如果原item有这个key，那就转换key
 *                 第二种：如果原item没有key，  那就是给item添加字段
 *
 * */
export const treeDataTransform = function(treeList, transformObj, itemCallback = () => {}) {
	const transformKeys = Object.keys(transformObj)

	function t(list) {
		if (Array.isArray(list)) {
			list.forEach(function(treeNode) {
				itemCallback(treeNode) //  遍历每一个item

				transformKeys.forEach(function(key) {
					if (treeNode.hasOwnProperty(key)) {
						const newKey = transformObj[key]

						treeNode[newKey] = treeNode[key] // 转换一下key
						delete treeNode[key] // 删除之前的key

						if (Array.isArray(treeNode[newKey])) {
							t(treeNode[newKey])
						}
					} else {
						treeNode[key] = transformObj[key] // 直接给item赋值
					}
				})
			})
		}
	}
	t(treeList)
	return treeList
}

/**
 * 转换treed 数据格式 转换为list
 *   treeList = []
 *    要不要添加添加parent字段，   withParent
 *
 * */
export const tree2list = function(treeList, key = 'children', withParent = false) {
	const resultList = []

	function t(list, key, parent) {
		if (Array.isArray(list)) {
			list.forEach(function(item) {
				if (withParent) {
					item.parent = parent // 为什么有的不加， 加上无法转换为  JSON  序列化。
				}
				resultList.push(item)
				if (item.hasOwnProperty(key) && Array.isArray(item[key])) {
					t(item[key], key, item)
				}
			})
		}
	}
	t(treeList, key, null)
	return resultList
}

/**
 * 将数组转化为树状结构
 */
/**
 * 数组转化成树形结构
 * @param {Array} arr
 * @param {String} selfKey 自身的唯一键值
 * @param {String} parentKey 父节点唯一的键值
 * @return {Array}
 */
export function arrayToTree(arr, { selfKey = 'id', parentKey = 'parentId' } = {}) {
	let result = []
	if (!Array.isArray(arr)) {
		return result
	}
	let map = {}
	arr.forEach(item => {
		map[item[selfKey]] = item
	})
	arr.forEach(item => {
		let parent = map[item[parentKey]]
		if (parent) {
			;(parent.children || (parent.children = [])).push(item)
		} else {
			result.push(item)
		}
	})
	// console.log('result', result)
	return result
}

/**
 * 通过子节点id寻找所有父节点
 * @param {String} id 子节点id
 * @param {Array} tree 树
 * @param {String} parentKey 父节点唯一键值
 * @return {Array}
 */
export function findAncestry(id, tree, { parentKey = 'parentId' } = {}) {
	var temp = []
	var forFn = function(arr, id) {
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i]
			if (item.id === id) {
				temp.push(item)
				forFn(tree, item[parentKey])
				break
			} else {
				if (item.children) {
					forFn(item.children, id)
				}
			}
		}
	}
	forFn(tree, id)
	return temp
}

export const findUpdateField = function(currentObj, oriObj, keys = []) {
	const list = []

	const k1 = Object.keys(currentObj)
	const k2 = Object.keys(oriObj)
	if (keys.length <= 0) {
		keys = Array.from(new Set(k1.filter(v => new Set(k2).has(v)))) // 取并集
	}

	keys.forEach(function(key) {
		if (currentObj[key] !== oriObj[key]) {
			list.push({
				column: key,
				destValue: oriObj[key],
				srcValue: currentObj[key]
			})
		}
	})

	return list
}

/**
 * /// <summary>
 /// 格式化文件大小的JS方法
 /// </summary>
 /// <param name="filesize">文件的大小,传入的是一个bytes为单位的参数</param>
 /// <returns>格式化后的值</returns>
 * */

export const renderSize = function(value) {
	if (value === null || value === '') {
		return '0 Bytes'
	}
	var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
	var index = 0
	var srcsize = parseFloat(value)
	index = Math.floor(Math.log(srcsize) / Math.log(1024))
	var size = srcsize / Math.pow(1024, index)
	size = size.toFixed(1) // 保留的小数位数
	return size + unitArr[index]
}
