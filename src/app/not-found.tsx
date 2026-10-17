import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-md shadow-amber-500/20 mb-6">
        🐝
      </div>
      <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
        404 &bull; Hive Coordinate Not Found
      </span>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
        Page Swarmed Away
      </h1>
      <p className="text-sm text-slate-600 max-w-md mt-2 mb-8 leading-relaxed">
        The hive section or telemetry node you are looking for does not exist or has been relocated to another apiary station.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all"
      >
        Return to Command Center
      </Link>
    </div>
  );
}
