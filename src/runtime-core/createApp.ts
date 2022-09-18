import { render } from "./render"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
	return {
		mount(rootContainer) {
			//先创建虚拟节点
			const vnode = createVNode(rootComponent)
			//接收虚拟节点和容器
			render(vnode, rootContainer)
		}
	}
}

