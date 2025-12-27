const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center px-4 bg-slate-900">
      <div className="max-w-sm w-full mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-slate-800 text-center">
          Plow Me
        </h1>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Login to manage plow sessions or view activity.
        </p>
        {/* TODO: Add actual form on Day 2 */}
       <div className="space-y-3">
          <button className="w-full py-2 rounded-md bg-slate-800 text-white font-medium">
          Driver / Owner Login
        </button>
        <button className="w-full py-2 rounded-md border border-slate-300 text-slate-700 font-medium">
          Client Login
        </button>
      </div>
      </div>
    </div>
  );
};

export default Login;