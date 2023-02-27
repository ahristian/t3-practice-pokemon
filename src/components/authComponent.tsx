import { api } from "../utils/api";
import { useSession } from "next-auth/react";

const AuthShowcase: React.FC<{ signOut: () => void; signIn: () => void }> = (
  props
) => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.router.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData && (
        <p className="text-center text-2xl text-white">
          <span>
            Logged in as{" "}
            <span className="font-semibold text-red-600">
              {sessionData.user?.name}
            </span>{" "}
            and email{" "}
            <span className="font-semibold text-red-600">
              {sessionData.user?.email}
            </span>
          </span>
        </p>
      )}
      {/* {!sessionData && <LoginForm />} */}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={
          sessionData ? () => void props.signOut() : () => void props.signIn()
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default AuthShowcase;
