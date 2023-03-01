import { Form } from "@remix-run/react"
import { SocialsProvider } from 'remix-auth-socials';

interface SocialButtonProps {
  provider: SocialsProvider,
  label: string
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, label }) => (
  <Form action={`/auth/${provider}`} method="post">
    <button>{label}</button>
  </Form>
);

export default function AuthButtons() {
  return (
    <>
      <SocialButton provider={SocialsProvider.DISCORD} label="Login with Discord" />
      <SocialButton provider={SocialsProvider.GITHUB} label="Login with Github" />
      <SocialButton provider={SocialsProvider.GOOGLE} label="Login with Google" />
    </>
  );
}
