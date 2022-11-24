import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

<GoogleOAuthProvider 
    clientId="<828311702305-3o4usi5raebpt6j1lim7rip91in43b0m.apps.googleusercontent.com>">

<GoogleLogin
  onSuccess={credentialResponse => {
    return (credentialResponse);
  }}
  onError={() => {
    return(<h1>login Failed</h1>)
  }}
/>
  </GoogleOAuthProvider>
