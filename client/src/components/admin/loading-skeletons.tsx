export const RecentUsersSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mt-1" />
          </div>
        </div>
        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
      </div>
    ))}
  </div>
);

export const RecentResumesSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mt-1" />
          </div>
        </div>
        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
      </div>
    ))}
  </div>
);

export const UsersTableSkeleton = () => (
  <div className="rounded-md border">
    <div className="h-10 bg-gray-100 border-b flex items-center px-4">
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
    </div>
    <div className="divide-y">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const ResumesTableSkeleton = () => (
  <div className="rounded-md border">
    <div className="h-10 bg-gray-100 border-b flex items-center px-4">
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
    </div>
    <div className="divide-y">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ApiKeysTableSkeleton = () => (
  <div className="rounded-md border">
    <div className="h-10 bg-gray-100 border-b flex items-center px-4">
      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mr-6" />
      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
    </div>
    <div className="divide-y">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex space-x-2">
            <div className="h-6 w-12 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
