import { useState } from "react";
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function Signup() {

  const [tokenResponse, setTokenResponse] = useState<TokenResponse>();
  const [user, setUser] = useState<string>(null!);

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);

      setTokenResponse(tokenResponse);
      setUser(userInfo);
    },
    onError: errorResponse => console.log(errorResponse),
  });
  return (
    <button onClick={() => googleLogin()}>
        Sign Up with Google
      </button>
  );
};