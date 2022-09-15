import { reactive } from '../reactive'
import { effect, stop } from '../effect'


describe('effect', () => {
	it('init', () => {
		const user = reactive({
			age: 10
		})
		let nextAge;
		effect(() => {
			nextAge = user.age + 1
		})
		expect(nextAge).toBe(11)
		// updata
		user.age++
		expect(nextAge).toBe(12)
	})
	it('return runner', () => {
		//调用effect返回runner函数 调用runner函数会再次执行effect里的代码
		let foo = 10;
		const runner = effect(() => {
			foo++
			return 'foo'
		})
		expect(foo).toBe(11)
		const r = runner()
		expect(foo).toBe(12)
		expect(r).toBe('foo')
	})
	it('scheduler', () => {
		//1.通过effect第二个参数为一个 scheduler的fn函数
		//2.effect第一次执行会执行effect的fn
		//3.当响应式对象更新则不会执行fn 会执行scheduler传递的函数
		//4.当执行runner 会再次执行effect的fn 
		let dummy;
		let run ;
		const obj = reactive({ foo: 1 })
		const scheduler = jest.fn(() => {
			run = runner
		}) 
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ scheduler }
		)
		expect(scheduler).not.toHaveBeenCalled() //开始不被调用
		expect(dummy).toBe(1)
		obj.foo++
		expect(dummy).toBe(1)
		expect(scheduler).toHaveBeenCalledTimes(1); //更新时被调用一次
		run()
		expect(dummy).toBe(2)
	})
	it('stop', () => {
		//1.执行stop函数传入runner函数 则会停止响应式
		//2.再次调用runner函数 恢复响应式
		let dummy;
		const obj = reactive({ prop: 1 })
		const runner = effect(() => {
			dummy = obj.prop
		})
		obj.prop = 2
		expect(dummy).toBe(2)
		stop(runner)
		obj.prop++
		expect(dummy).toBe(2)
		runner()	
		expect(dummy).toBe(3)
		stop(runner)
		obj.prop = 6
		expect(dummy).toBe(3)
		runner()
		expect(dummy).toBe(6)

	})
	it('onStop', () => {
		//1.执行stop函数的回调onStop函数
		let dummy;
		const obj = reactive({ foo: 1 })
		const onStop = jest.fn()
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ onStop }
		)
		stop(runner)
		expect(onStop).toBeCalledTimes(1)
	})
})