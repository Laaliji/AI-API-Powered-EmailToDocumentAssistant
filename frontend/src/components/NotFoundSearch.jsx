import { FileSearch } from "lucide-react";

export default function NotFoundSearch({ searchValue }) {
  return <>
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileSearch className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        No results found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        We couldn't find any emails matching "{searchValue}"
      </p>
    </div>
  </>
}
