"use client";

import GoogleLoginButton from "./components/google-login-button";

export default function SignForm({
  errorMessage,
}: {
  errorMessage: string | undefined | string[];
}) {
  return (
    <div className="grid h-screen items-center text-center">
      <div>
        <div className="text-center mb-20">
          <p className="text-2xl font-medium text-gray-800">
            유튜브 계정이 없으면 정상적으로 이용하지 못할 수 있습니다.
          </p>
          <p className="text-xl text-gray-500 mt-1">
            로그인 시 선택한 계정의 재생목록 데이터를 기반으로 대시보드가
            구성됩니다.
          </p>
        </div>
        <GoogleLoginButton />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
