
import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
	it('init', () => {
		const user = reactive({
			age: 1
		})
		const age = computed(() => {
			return user.age
		})
		expect(age.value).toBe(1)
	})
	it('computed lazy', () => {
		const value = reactive({
			foo: 1
		})
		const getter = jest.fn(() => {
			return value.foo
		})
		const cValue = computed(getter)
		//懒执行 不使用cValue.value 不会调用getter
		expect(getter).not.toHaveBeenCalled()

		expect(cValue.value).toBe(1)
		expect(getter).toHaveBeenCalledTimes(1)
		//缓存,第二次获取直接返回值 不会触发getter
		cValue.value
		expect(getter).toHaveBeenCalledTimes(1)

		value.foo = 2
		expect(getter).toHaveBeenCalledTimes(1)
	})

})