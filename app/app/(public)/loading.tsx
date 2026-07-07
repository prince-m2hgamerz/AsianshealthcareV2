export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-canvas-light flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-aloe-10/30 border-t-aloe-10 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-body-md text-shade-40">Loading...</p>
      </div>
    </div>
  );
}
