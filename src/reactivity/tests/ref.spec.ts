import { effect} from '../effect'
import { reactive } from '../reactive'
import {isRef, proxyRefs, ref, unRef} from '../ref'
describe('ref', () => {
	it('init', () => {
		const foo = ref(1)
		expect(foo.value).toBe(1)
	})
	it('should be reactive', () => {
		const foo = ref(1)
		let dummy
		let call = 0
		effect(() => {
			call++
			dummy = foo.value
		})
		expect(call).toBe(1)
		expect(dummy).toBe(1)
		foo.value = 2
		expect(call).toBe(2)
		expect(dummy).toBe(2)
		foo.value = 2
		expect(call).toBe(2)
		expect(dummy).toBe(2)
	})
	it('ref transform reactive', () => {
		const foo = ref({count:1})
		let dummy
		effect(() => {
			dummy = foo.value.count
		})
		expect(dummy).toBe(1)
		foo.value.count = 2
		expect(dummy).toBe(2)
	})
	it('isRef', () => {
		const foo = ref(2)
		const user = reactive({num:1})
		expect(isRef(foo)).toBe(true)
		expect(isRef(5)).toBe(false)
		expect(isRef(user)).toBe(false)
	})
	it('unRef', () => {
		const foo = ref(2)
		expect(unRef(foo)).toBe(2)
		expect(unRef(5)).toBe(5)
	})
	
	it('proxyRefs', () => {
		//template模板里使用ref不需要.value
		const user = {
			age:ref(10),
			name: 'xiaoming'
		}
		const proxyUser =  proxyRefs(user)
		expect(user.age.value).toBe(10)
		expect(proxyUser.age).toBe(10)
		expect(proxyUser.name).toBe('xiaoming')

		proxyUser.age = 20
		expect(proxyUser.age).toBe(20)
		expect(user.age.value).toBe(20)

		proxyUser.age = ref(10)
		expect(user.age.value).toBe(10)
		expect(proxyUser.age).toBe(10)

	})
})