import { create } from "zustand";
import { UserInfoState } from "../types";

export const useAuthState = create<UserInfoState>((set) => ({
  isLogged: false,
  username: "",
  access_token: null,

  login: (token: string, username: string) =>
    set({ isLogged: true, access_token: token, username: username }),

  logout: () => set({ isLogged: false, access_token: null, username: null }),
}));
