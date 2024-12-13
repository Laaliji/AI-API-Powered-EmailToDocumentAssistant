import { Card, CardContent } from "@/components/ui/card"

export function Loading() {
  return <>
    <div className="flex flex-col gap-4">
      <Card className="dark:bg-gray-800">
        <CardContent className="flex items-center p-4">
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="ml-4 space-y-2 flex-1">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardContent>
      </Card>
      <Card className="dark:bg-gray-800">
      <CardContent className="flex items-center p-4">
        <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="ml-4 space-y-2 flex-1">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardContent>
    </Card>
    <Card className="dark:bg-gray-800">
      <CardContent className="flex items-center p-4">
        <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="ml-4 space-y-2 flex-1">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardContent>
    </Card>
    <Card className="dark:bg-gray-800">
      <CardContent className="flex items-center p-4">
        <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="ml-4 space-y-2 flex-1">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardContent>
    </Card>
    </div>
  </>
}

