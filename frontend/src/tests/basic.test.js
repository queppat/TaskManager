import { test, expect } from 'vitest'

test('basic test without dom', () => {
    expect(1 + 1).toBe(2)
})

test('basic string test', () => {
    expect('hello').toBe('hello')
})