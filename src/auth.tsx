import { TokenResponse, useGoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

export function Auth() {
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>();
  const [user, setUser] = useState<any>(null);

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



  return(
    <button onClick={() => googleLogin()}>
        Login with Google 🚀
      </button>
  )
}