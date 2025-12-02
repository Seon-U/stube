import { use } from "react";
import SignForm from "./sign-form";

type SearchParams = Promise<{ error: string }>;
/**
 * Render the sign page with a centered form.
 *
 * Resolves `searchParams` to extract an `error` value and passes it to `SignForm` as `errorMessage`.
 *
 * @param searchParams - A promise resolving to an object `{ error: string }` containing an optional error message from the query string.
 * @returns The sign page JSX with the `SignForm` centered in the viewport.
 */
export default function Sign({ searchParams }: { searchParams: SearchParams }) {
  const { error } = use(searchParams);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh - 160px)] px-4">
      <SignForm errorMessage={error} />
    </div>
  );
}