export function RepoLegend() {
  return (
    <div className="flex items-center gap-6 text-sm text-gray-700">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-indigo-500" />
        <span>backend</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
        <span>frontend</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
        <span>workspace</span>
      </div>
    </div>
  );
}
