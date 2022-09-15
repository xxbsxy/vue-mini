import {isReactive, reactive}  from '../reactive'

describe('reactive', () => {
	it('init', () => {
		const origin = {num : 1}
		const observe = reactive(origin)
		expect(observe).not.toBe(origin)
		expect(observe.num).toBe(1)
		expect(isReactive(observe)).toBe(true)
		expect(isReactive(origin)).toBe(false)
	})
	it('nested reactive', () => {
		const origin = {
			nested:{
				num:1
			},
			array:[{foo:2}]
		}
		const observe = reactive(origin)
		expect(isReactive(observe.nested)).toBe(true)
		expect(isReactive(observe.array)).toBe(true)
		expect(isReactive(observe.array[0])).toBe(true)
	})
})