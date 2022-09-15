import { reactiveHandler, readonlyHandler,shallowReadonlyHandler } from "./base"

//raw为需要代理的原对象
export function reactive(raw) {
	return new Proxy(raw, reactiveHandler)
}
export function readonly(raw) {
	return new Proxy(raw, readonlyHandler)
}
export function shallowReadonly(raw) {
	return new Proxy(raw, shallowReadonlyHandler)

}

export function isReactive(value) {
	return !!value['is_reactive']
}

export function isReadonly(value) {
	return !!value['is_readonly']
}
export function isProxy(value) {
	return isReactive(value) || isReadonly(value)
}