import { client } from "./axiosClient";

export type IService = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

export function register({ email, password }: IService) {
  return client.post(
    "auth/register",
    { email, password },
    {data: { authorization: false } }
  );
}

export function login({ email, password }: IService) {
    return client.post(
      "auth/login",
      { email, password },
    {data: { authorization: false }}
    );
  }

export function getProfile() {
  return client.get("/users/profile");
}