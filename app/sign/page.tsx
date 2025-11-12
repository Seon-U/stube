import { use } from "react";
import SignForm from "./sign-form";

type SearchParams = Promise<{ error: string }>;
export default function Sign({ searchParams }: { searchParams: SearchParams }) {
  const { error } = use(searchParams);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh - 160px)] px-4">
      <SignForm errorMessage={error} />
    </div>
  );
}
