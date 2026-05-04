import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CenteringUI from "@/components/auth/CenteringUI";
import SignUpForm from "@/components/SignUpForm";

export default async function SignUpPage({ searchParams }) {
  // const session = await auth();

  // const _searchParams = await searchParams;

  // const callbackUrl = _searchParams?.callbackUrl || "/";

  // // already logged in → go where they wanted

  // const safeCallBack = callbackUrl.startsWith("/") ? callbackUrl : "/";
  // if (session) {
  //   redirect(safeCallBack);
  // }

  return (
    <CenteringUI >
      <SignUpForm />
    </CenteringUI>);
}
