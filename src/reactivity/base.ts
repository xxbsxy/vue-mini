import { isObject } from "../utils"
import { track, trigger } from "./effect"
import { reactive, readonly } from "./reactive"

 function createGetter(isReadonly = false, shallowReadonly = false) {
	return function get(target, key) {
		if(key === 'is_reactive') {
			return !isReadonly
		} else if(key === 'is_readonly') {
			return isReadonly
		}

		const res = Reflect.get(target, key)
		//res是object转化为reactive
		if(shallowReadonly) {
			return res
		}
			if(isObject(res)) {
			return isReadonly? readonly(res) : reactive(res)
		}
		// 收集依赖
		if (!isReadonly) {
			track(target, key)
		}
		return res
	}
}
 function createSetter() {
	return function set(target, key, value) {
		const res = Reflect.set(target, key, value)
		//触发依赖
		trigger(target, key)
		return res
	}
}

const reactiveGet = createGetter()
const reactiveSet = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonly = createGetter(true,true)
export const reactiveHandler = {
	get:reactiveGet,
	set:reactiveSet
}
export const readonlyHandler = {
	get:readonlyGet,
	set(target, key) {
		console.warn(`key:${key} set失败,因为target使用了readonly`,target);
		return true
	}
}
export const shallowReadonlyHandler = {
	get:shallowReadonly,
	set(target, key) {
		console.warn(`key:${key} set失败,因为target使用了readonly`,target);
		return true
	}
}