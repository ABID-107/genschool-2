export default function SuperAdminLoading() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-8 w-48 skeleton mb-2" />
          <div className="h-4 w-72 skeleton mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-28 rounded-xl skeleton" />
            ))}
          </div>
          <div className="h-64 rounded-xl skeleton" />
        </div>
      ))}
    </div>
  );
}
