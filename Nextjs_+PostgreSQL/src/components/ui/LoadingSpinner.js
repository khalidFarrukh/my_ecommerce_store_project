export default function LoadingSpinner({ text = "Loading...", className }) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <div className={`w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin ${className}`} />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}