import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
      <GoogleOAuthProvider clientId="557148052813-lfls00lgoff5gspb83oq5hfi72hckbpi.apps.googleusercontent.com">
        <RemixBrowser />
        </GoogleOAuthProvider>
      </StrictMode>
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
