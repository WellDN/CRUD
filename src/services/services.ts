import { client } from "./axiosClient";
import { Token } from '../db'

export function register({ email, password }: Token) {
  return client.post(
    "auth/register",
    { email, password },
    {data: { authorization: false } }
  );
}

export function login({ email, password }: Token) {
    return client.post(
      "auth/login",
      { email, password },
    {data: { authorization: false }}
    );
  }

export function getProfile() {
  return client.get("/users/profile");
}
