/**
 * Created by Seven on 2019/11/6.
 * project: bpl-admin-frontend
 * email: fighting20xx@126.com
 */

const git = require('git-rev-sync')

/**
 * 传递打包时的环境变量到前端必须是以 VUE_APP_ 开头且必须只能是字符串
 * @type {string}
 */
const VUE_APP_GIT = JSON.stringify({
	short: git.short(),
	long: git.long(),
	branch: git.branch(),
	count: git.count(),
	date: git.date(),
	isDirty: git.isDirty(),
	isTagDirty: git.isTagDirty(),
	message: git.message(),
	remoteUrl: git.remoteUrl(),
	tag: git.tag()
})

console.log(VUE_APP_GIT)
export default JSON.parse(VUE_APP_GIT)
