import create from "zustand";

type ISetTokens = {
  accessToken: string;
  refreshToken: string
}

class SetGet {
  private _bar: boolean = false;
  get bar(): boolean {
      return this._bar;
  }
  set bar(value: boolean) {
      this._bar = value;
  }
}

function setTokensToLocalStorage({ accessToken, refreshToken }: ISetTokens) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function removeTokensFromLocalStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isLoggedIn: () => !!get().accessToken,
  login: (tokens: ISetTokens) => {
    setTokensToLocalStorage(tokens);
    set((state) => ({
      ...state,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }));
  },
  logout: () => {
    removeTokensFromLocalStorage();
    set((state) => ({
      ...state,
      accessToken: null,
      refreshToken: null,
    }));
  },
}));
