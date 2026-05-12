import Link from "next/link";

import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-[300px] flex-col items-center px-[15px] py-9 sm:w-[468px]">
      <h2 className="mb-8 font-serif text-[40px]">로그인</h2>

      <SignInForm />

      <Link href="/sign-up" className="mt-4 text-gray-600 underline">
        계정 생성
      </Link>
    </div>
  );
}
