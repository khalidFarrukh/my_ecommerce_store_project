import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-60px-98px-176px)] md:min-h-[calc(100vh-60px-98px-140px)] flex items-center justify-center">
      <LoadingSpinner text="Loading" />
    </div>
  );
}
