import { useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { TokenSet } from "next-auth";

const SignIn: React.FC<{ csrfToken: TokenSet }> = (props) => {
  const router = useRouter();
  const [error, setError] = useState(null);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", tenantKey: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .max(30, "Must be 30 characters or less")
            .email("Invalid email address")
            .required("Please enter your email"),
          password: Yup.string().required("Please enter your password"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: `${window.location.origin}`,
          });
          if (res?.error) {
            setError(res.error);
          } else {
            setError(null);
          }
          if (res.url) router.push(res.url);
          setSubmitting(false);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div
              className="flex min-h-screen flex-col items-center
            justify-center bg-red-400 py-2 shadow-lg"
            >
              <div className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={props.csrfToken}
                />

                <div className="text-md rounded p-2 text-center text-red-400">
                  {error}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold uppercase text-gray-600"
                  >
                    Email
                    <Field
                      name="email"
                      aria-label="enter your email"
                      aria-required="true"
                      type="text"
                      className="mt-2 w-full bg-gray-300 p-3 text-gray-900"
                    />
                  </label>

                  <div className="text-sm text-red-600">
                    <ErrorMessage name="email" />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold uppercase text-gray-600"
                  >
                    password
                    <Field
                      name="password"
                      aria-label="enter your password"
                      aria-required="true"
                      type="password"
                      className="mt-2 w-full bg-gray-300 p-3 text-gray-900"
                    />
                  </label>

                  <div className="text-sm text-red-600">
                    <ErrorMessage name="password" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-400 p-3 text-gray-100"
                  >
                    {formik.isSubmitting ? "Please wait..." : "Sign In"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignIn;

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
