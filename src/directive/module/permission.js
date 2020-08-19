import store from '@/store'
import Utils from '@/util/util.js'

/**
 *   权限的多种写法：
 *
 *    v-permission="'addProject'"
 *    v-permission="['addProject','editProject']"
 *    v-permission="['addProject', true]"
 *    v-permission="['addProject', true, function(){}]"
 *    v-permission="{ user: ['李四','seven']}"
 *    v-permission="{ role: ['admin','管理员']}"
 *    v-permission="{ user: ['李四','seven'] , role: ['admin','editor'], permission: ['addProject', true, function(){}]}"
 */
export function checkPermission(permission) {
  let permissionList = store.state.permission.permissionList
  if (Utils.isArray(permission)) {
    return checkPermi(permission)
  } else if (Utils.isString(permission)) {
    return checkPermi(permission)
  } else if (Utils.isObject(permission)) {
    return checkPermi(permission.permission) || checkUser(permission.user) || checkRole(permission.user)
  } else {
    return false
  }

  // 判断是不是某个用户权限
  function checkUser() {}
  // 判断是不是某个角色权限
  function checkRole() {}
  // 判断接口，按钮权限
  function checkPermi(value) {
    if (value && Utils.isArray(value)) {
      return value.some(p => {
        if (Utils.isString(p)) {
          return permissionList.indexOf(p) > -1
        } else if (Utils.isBoolean(p)) {
          return p
        } else if (Utils.isFunction(p)) {
          return p.call()
        } else {
          return false
        }
      })
    } else if (Utils.isString(value)) {
      return permissionList.indexOf(value) > -1
    } else {
      return false
    }
  }
}

const permission = function(directiveHook) {
  return (el, binding, vnode, oldVnode) => {
    const { value, oldValue } = binding
    let hasPermission = checkPermission(value)

    if ('inserted' === directiveHook) {
      if (el.parentNode) {
        /**
         * TODO:
         * 1. 给父元素添加唯一id
         * 2. 同时给元素设置上父元素的id
         */
        let rid = el.parentNode.getAttribute('id')
        if (!rid) {
          rid = Utils.gid()
          el.parentNode.setAttribute('id', rid)
        }
        let elementId = Utils.gid()
        el.dataset.__parent_element_id = rid
        el.dataset.__permission_element_id = elementId
      }
    }

    // 隐藏元素
    if (!hasPermission) {
      if (el.parentNode) {
        let emptyEle = getEmptyElement(el.tagName, el.dataset.__permission_element_id)
        el.parentNode.insertBefore(emptyEle, el)
        el.parentNode.removeChild(el)
      }
    }

    // 恢复元素
    else if (hasPermission && 'update' === directiveHook) {
      // 此处会在 update时触发
      const { __parent_element_id, __permission_element_id } = el.dataset
      const parent = document.getElementById(__parent_element_id)
      const ele = document.getElementById(__permission_element_id)
      // 根据index找到需要插入父节点的位置

      if (parent && ele) {
        parent.insertBefore(el, ele)
        parent.removeChild(ele)
      }
    }
  }
}

export default {
  // 此处父元素存在
  inserted: permission('inserted'),
  // 此处数据更新
  update: permission('update')
}

/**
 * 根据id 创建一个空元素
 * @param {String} datasetKey
 * @param {String} datasetValue
 */
const elementTempObj = {}
function getEmptyElement(tag, id) {
  if (elementTempObj[id]) {
    return elementTempObj[id]
  } else {
    let ele = document.createElement(tag)
    ele.style.width = '0'
    ele.style.height = '0'
    ele.style.margin = '0'
    ele.style.padding = '0'
    ele.style.visibility = 'hidden'
    ele.setAttribute('id', id)
    ele.dataset.__element_from_permission = id
    elementTempObj[id] = ele
    return ele
  }
}
