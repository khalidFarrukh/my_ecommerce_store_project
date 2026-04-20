import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CenteringUI from "@/components/auth/CenteringUI";
import SignInForm from "../../components/SignInForm";

export default async function SignInPage({ searchParams }) {
  const session = await auth();

  const _searchParams = await searchParams;

  const callbackUrl = _searchParams?.callbackUrl || "/";

  // already logged in → go where they wanted

  const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";
  if (session) {
    redirect(safeCallBack);
  }

  return (
    <CenteringUI >
      <SignInForm />
    </CenteringUI>
  );
}
