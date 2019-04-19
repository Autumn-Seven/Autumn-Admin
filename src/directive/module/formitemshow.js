import {findComponentsDownward} from '@/libs/assist';
import jQuery from 'jquery'
import Vue from 'vue'


export default {

	/**
	 * 自定义指令 v-formitemshow
	 * 需要在form元素上添加 v-formitemshow="tableColumnsNew"    表头控制列
	 * 那么表单元素会根据  表头控制信息显示对应的item。
	 * */
	componentUpdated:(el, binding ,Vnode) => {
		let controlList =  binding.value || [];


		if (controlList.length){
			el.__isAddcontrol__ = true;


			/**
			 *
			 * 根据控制头， 找到对应的表单，修改名称，并控制显示。
			 * */
			const list = findComponentsDownward(Vnode.componentInstance,'FormItem');
			list.forEach(function (formItem) {

				formItem.$el.style.display = 'none';
				controlList.forEach(function (control) {
					if((control.key === formItem.prop || control.key === formItem.$attrs.prop2)&& control.visible){
						formItem.$el.style.display = 'block';
						let a = formItem.$el.querySelectorAll('.ivu-form-item-label')[0];
						a.innerHTML=control.title+'_';
					}
				});

			});


		}
	}
}
