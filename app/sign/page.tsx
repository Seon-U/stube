import { use } from "react";
import SignForm from "./sign-form";

type SearchParams = Promise<{ error: string }>;
export default function Sign({ searchParams }: { searchParams: SearchParams }) {
  const { error } = use(searchParams);
  // const searchParams = useSearchParams();
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   const error = searchParams.get("error");
  //   if (error) {
  //     setErrorMessage(decodeURIComponent(error));
  //     const timer = setTimeout(() => setErrorMessage(null), 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh - 160px)] px-4">
      <SignForm errorMessage={error} />
    </div>
  );
}
