import { useEffect, useState } from 'react'
import { load, save } from './storage.js'
import { getCurrentUser } from '../auth.js'

export function useUserState(key, initial) {
  const user = getCurrentUser()
  const storageKey = user ? `user:${user.id}:${key}` : null
  const [value, setValue] = useState(() => (storageKey ? load(storageKey, initial) : initial))

  useEffect(() => {
    if (storageKey) save(storageKey, value)
  }, [storageKey, value])

  return [value, setValue]
}

export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => load(key, initial))
  useEffect(() => {
    save(key, value)
  }, [key, value])
  return [value, setValue]
}
