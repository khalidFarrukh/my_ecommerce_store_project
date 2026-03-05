import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AccountUI from "@/components/auth/AccountUI";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function resetPasswordPage({ searchParams }) {
  const session = await auth();

  const _searchParams = await searchParams;

  const callbackUrl = _searchParams?.callbackUrl || "/";

  // already logged in → go where they wanted

  const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";
  if (session) {
    redirect(safeCallBack);
  }

  return (
    <main className="z-1 font-poppins relative w-full bg-background_1 my-3 flex flex-col items-center">
      <section className="w-full flex flex-col items-center">
        <div className="w-full max-w-100 h-fit flex flex-col gap-5 items-center">
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  )
}
