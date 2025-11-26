import { test, expect } from 'vitest'
import { formatTaskTitle, isTaskCompleted } from '../utils/helpers'

test('formatTaskTitle formats title correctly', () => {
    expect(formatTaskTitle('  Hello World  ')).toBe('Hello World')
    expect(formatTaskTitle(null)).toBe('Untitled')
})

test('isTaskCompleted checks task status', () => {
    expect(isTaskCompleted({ status: 'completed' })).toBe(true)
    expect(isTaskCompleted({ status: 'pending' })).toBe(false)
})