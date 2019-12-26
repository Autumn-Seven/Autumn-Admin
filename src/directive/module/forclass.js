export default {

	/**
	 * 自定义指令 v-forclass
	 * 作用：为v-for 自动添加上class样式, 并且添加傻瓜鼠标悬浮class
	 .for-item{}
	 .for-item-0{}
	 .for-item-1{}
	 .for-item-active{}
	 .for-item-active-0{}

	 .for-item-before{}
	 .for-item-after{}

	 .for-row-0{}
	 .for-row-1{}

	 *使用方法  v-for="item ,index in Arry" :key="index" v-forclass="{item,index,currentIndex}"
	 *
	 * */
	bind(el, binding, vnode) {
		let {
			item,
			index,
			currentIndex,          //初始index值
			len,                  //总共有多少个item
			rowSize,              //每行有多少个item
			trigger,               //[hover,click,none]  默认是hover,  none 就是不触发不监听事件
			recover,              //是不是恢复到原来的 index, 只有在hover时候有效
			className,            //class名称， 默认的是 for （for-item-0），  可以改为其他的 如AAA 那么（AAA-item-0）
		} = binding.value;
		if (!trigger) trigger = 'hover';
		if (!className) className = 'for';


		function vForClass(el, binding, vnode) {
			let bindObj = binding.value;
			let index = bindObj.index;
			let currentIndex = bindObj.currentIndex;

			let classList = el.classList;
			classList.add(className + '-item');
			classList.add(className + '-item-' + index);

			if (index === currentIndex) {
				classList.add(className + '-item-active');
				classList.add(className + '-item-active-' + index);
			} else {
				classList.remove(className + '-item-active');
				classList.remove(className + '-item-active-' + index)
			}

			if (index < currentIndex) {
				classList.add(className + '-item-before');
				classList.remove(className + '-item-after');
			} else if (index > currentIndex) {
				classList.add(className + '-item-after');
				classList.remove(className + '-item-before');
			}else {
				classList.remove(className + '-item-before');
				classList.remove(className + '-item-after');
			}
			if(rowSize && typeof rowSize ==='number'){
				let rowIndex = Math.floor(index / rowSize);
				let columnIndex =  index % rowSize ;
				classList.add(className + '-row-' + rowIndex);
				classList.add(className + '-column-' + columnIndex);
			}
		}

		vForClass(el, binding, vnode);
		el.__v_forClass__ = vForClass;


		/**
		 *
		 * 给元素添加事件
		 * */
		if (trigger === 'hover') {
			const mouseover = function () {
				vnode.context._data.currentIndex = index;
			}
			el.addEventListener('mouseover', mouseover, true)
			el.__v_forClass_mouseover__ = mouseover;

			if (recover) {
				const mouseout = function () {
					vnode.context._data.currentIndex = currentIndex;
				}
				el.addEventListener('mouseout', mouseout, true);
				el.__v_forClass_mouseout__ = mouseout;
			}
		} else if (trigger === 'click') {
			const click = function () {
				vnode.context._data.currentIndex = index
			};
			el.addEventListener('click', click, true);
			el.__v_forClass_click__ = click;
		}
	},
	update(el, binding, vnode) {
		el.__v_forClass__ && el.__v_forClass__(el, binding, vnode)
	},
	unbind(el) {
		el.__v_forClass_click__ && el.removeEventListener('click', el.__v_forClass_click__);
		el.__v_forClass_mouseover__ && el.removeEventListener('mouseover', el.__v_forClass_mouseover__);
		el.__v_forClass_mouseout__ && el.removeEventListener('mouseout', el.__v_forClass_mouseout__);

		delete el.__v_forClass__;
		delete el.__v_forClass_mouseover__;
		delete el.__v_forClass_mouseout__;
		delete el.__v_forClass_click__;
	},
}
