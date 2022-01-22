import { renderHook, act } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { mocked } from "ts-jest/utils";
import { logInAsync } from "expo-google-app-auth";

import { AuthProvider, useAuth } from "./auth";

fetchMock.enableMocks();

const userTest = {
  id: "any_id",
  email: "john.doe@email.com",
  name: "John Doe",
  photo: "any_photo.png",
};

jest.mock("expo-auth-session", () => {
  return {
    startAsync: () => ({
      type: "success",
      params: {
        access_token: "any_token",
      },
    }),
  };
});

describe("Auth hook", () => {
  it("should be able to sign in with google acount existing", async () => {
    const googleMocked = mocked(logInAsync);
    googleMocked.mockReturnValue({
      id: "any_id",
      email: "john.doe@email.com",
      name: "John Doe",
      photo: "any_photo.png",
    });

    fetchMock.mockResponseOnce(JSON.stringify(userTest));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user.email).toBe(userTest.email);
  });

  it("user should not connect if cancel authentication with google", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(userTest));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty("id");
  });
});
