import { isReadonly, readonly, shallowReadonly } from "../reactive"

describe('readonly', () => {
	it('init', () => {
		const obj = { foo: 1 }
		const wrapped = readonly(obj)
		expect(wrapped).not.toBe(obj)
		expect(wrapped.foo).toBe(1)
	})
	it('warn', () => {
		console.warn = jest.fn()
		const user = readonly({ age: 10 })
		user.age = 11
		expect(console.warn).toBeCalled()
	})
	it('shallowReadonly', () => {
		const obj = {
			foo: {
				num: 1
			}
		}
		const prop = shallowReadonly(obj)
		expect(isReadonly(prop)).toBe(true)
		expect(isReadonly(prop.foo)).toBe(false)
	})
})