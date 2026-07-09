export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-body-md text-shade-40">Loading...</p>
      </div>
    </div>
  );
}
