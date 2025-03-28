import { getHomeUrl } from "@helpers/helperMethods";

const redirectLink = getHomeUrl();
const LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid https://www.googleapis.com/auth/calendar.events.owned&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${redirectLink}&client_id=628615651226-36r94suqhonsd49gogtd7c9tmk5i7d1l.apps.googleusercontent.com&access_type=offline&prompt=consent`;

export default function Login() {
  function handleLogin() {
    location.href = LOGIN_URL;
  }

  return (
    <section className="px-5 text-center w-full h-screen flex justify-center items-center flex-col gap-4">
      <img
        src={"https://salt.dev/wp-content/uploads/2024/02/salt-logo-dark.svg"}
        alt="logo"
        className="w-[40%] h-auto mb-3"
      />
      <h1 className="text-6xl font-light mb-5">Course Planner</h1>
      <button
        onClick={() => handleLogin()}
        className="text-white w-full bg-[#ff7961] hover:bg-[#ff7961]/90 focus:ring-4 focus:outline-none focus:ring-[#ff7961]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 max-w-sm"
      >
        <svg
          className="mr-2 -ml-1 w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Sign up with Google
        <div></div>
      </button>
    </section>
  );
}
