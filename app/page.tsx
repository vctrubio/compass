import { ThemeSwitcher } from "@/components/theme-switcher";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  console.log("has env vars", hasEnvVars);
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium text-xl">Next steps</h2>
        </div>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </>
  );
}
