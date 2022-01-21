import { renderHook } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from "./auth"


describe('Auth hook', () => {
	it('should be able to sign in with google acount existing', () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider
		})

		console.log(result)
	})
})
