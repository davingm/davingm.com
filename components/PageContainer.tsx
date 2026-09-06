export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-5 sm:px-8">
      {children}
    </div>
  );
}
