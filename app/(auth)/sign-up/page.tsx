import Link from "next/link";

import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-[300px] flex-col items-center px-[15px] py-9 sm:w-[468px]">
      <h2 className="mb-8 font-serif text-[40px]">회원가입</h2>

      <SignUpForm />

      <Link href="/sign-in" className="mt-4 text-gray-600 underline">
        로그인하기
      </Link>
    </div>
  );
}
