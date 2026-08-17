export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">VISTAR Real Estate</h1>
        <p className="text-gray-500 mb-8">Furniture Rental Management System</p>
        <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Sign In
        </a>
      </div>
    </div>
  );
}