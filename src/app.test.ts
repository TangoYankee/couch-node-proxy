import { getGreeting } from './app'

it('should be true', () => {
  expect(getGreeting()).toBe('Hello, Test!')
})
