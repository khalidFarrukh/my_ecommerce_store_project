import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AccountUI from "@/components/auth/CenteringUI";
import ResetPasswordForm from "../../../components/ResetPasswordForm";

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
    <AccountUI >
      <ResetPasswordForm />
    </AccountUI>
  );
}
