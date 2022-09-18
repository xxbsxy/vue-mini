import { isObject } from "../utils/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
	patch(vnode, container)
}

function patch(vnode, container) {
	//判断vnode.type是不是Element类型
	if (typeof vnode.type === 'string') {
		ProcessElement(vnode, container)
	} else if (isObject(vnode.type)) {
		ProcessComponent(vnode, container)
	}



}
function ProcessComponent(vnode, container) {
	mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
	const instance = createComponentInstance(vnode) //通过虚拟节点创建组件实例对象
	setupComponent(instance)
	setupRenderEffect(instance, container)

}

function setupRenderEffect(instance, container) {
	const subTree = instance.render()
	patch(subTree, container)
}

function ProcessElement(vnode: any, container: any) {
	throw new Error("Function not implemented.")
}

