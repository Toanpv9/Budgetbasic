import { createContext, useCallback, useContext } from 'react'

export const AnchorContext = createContext(null)

export function useAnchor(id) {
  const register = useContext(AnchorContext)
  return useCallback((el) => {
    if (id && register) register(id, el)
  }, [id, register])
}
