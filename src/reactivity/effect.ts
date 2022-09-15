class ReactiveEffect {
	private _fn: any
	deps = []
	active = true //stop状态false为stop状态
	onStop?: () => void
	constructor(fn, public scheduler?) {
		this._fn = fn
	}
	run() {
		if(!this.active) {
			return this._fn()
		}

		shouldTrack = true
		activeEffect = this
		this.active = true

		const result = this._fn()
		//重置
		shouldTrack = false
		return result
	}
	stop() {
		if(this.active) {
			cleanEffect(this)
			if(this.onStop) {
				this.onStop()
			}
			this.active = false
		}
	}
}

let activeEffect;
let shouldTrack //是否收集依赖 
//清空effect
function cleanEffect(effect) {
	effect.deps.forEach((dep: any) => {
		dep.delete(effect)
	})
	effect.deps.length = 0
}
const targetMap = new Map()

export function isTracking() {
	return activeEffect === undefined || shouldTrack === false 
}
//收集依赖
export function track(target, key) {

	if(isTracking()) return

	let depsMap = targetMap.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMap.set(target, depsMap)
	}
	let dep = depsMap.get(key)
	if (!dep) {
		dep = new Set()
		depsMap.set(key, dep)
	}
	trackEffects(dep)
}
export function trackEffects(dep) {
	if(dep.has(activeEffect)) return
	dep.add(activeEffect)
	//反向收集dep stop函数需要使用
	activeEffect.deps.push(dep)
}

export function trigger(target, key) {
	let depsMap = targetMap.get(target)
	let dep = depsMap.get(key)

	triggerEffects(dep)
}
export function triggerEffects(dep) {
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run()
		}
	}
}
export function effect(fn, options: any = {}) {
	const _effect = new ReactiveEffect(fn, options.scheduler)
	Object.assign(_effect, options)
	_effect.run()
	const runner: any = _effect.run.bind(_effect)

	runner.effect = _effect //将_effect 挂载到runner函数中以便后续调用stop函数
	return runner
}

export function stop(runner) {
	runner.effect.stop()
}