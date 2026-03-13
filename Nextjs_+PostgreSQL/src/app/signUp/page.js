import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AccountUI from "@/components/auth/AccountUI";
import SignUpForm from "./SignUpForm";

export default async function SignUpPage({ searchParams }) {
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
      <SignUpForm />
    </AccountUI>);
}
