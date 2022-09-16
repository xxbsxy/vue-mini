import { isTracking, trackEffects, triggerEffects } from "./effect"
import { hasChange, isObject } from '../utils/index'
import { reactive } from "./reactive"
class RefImpl {
	private _value: any
	public dep
	private _rawValue: any
	public _isRef = true
	constructor(value) {
		this._rawValue = value //保存原始对象 以便后续对比
		//判断value是否是对象
		this._value = isObject(value) ? reactive(value) : value
		this.dep = new Set()
	}

	get value() {
		if (!isTracking()) {
			//收集依赖
			trackEffects(this.dep)
		}
		return this._value
	}
	set value(newValue) {
		//数据发生改变才进行触发依赖
		if (hasChange(newValue, this._rawValue)) {
			this._rawValue = newValue
			this._value = isObject(newValue) ? reactive(newValue) : newValue
			triggerEffects(this.dep)
		}

	}
}

export function ref(value) {
	return new RefImpl(value)
}

export function proxyRefs(object) {
	return new Proxy(object, {
		get(target, key) {
			return unRef(Reflect.get(target, key))
		},
		set(target, key, value) {
			if (isRef(target[key]) && !isRef(value)) {
				return target[key].value = value
			} else {
				return Reflect.set(target, key, value)
			}
		}
	})
}

export function isRef(ref) {
	return !!ref._isRef
}

export function unRef(ref) {
	return isRef(ref) ? ref.value : ref
}
