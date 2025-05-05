import Hero from "@/components/main-page-components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <Hero />
      </div>

      {/* Mobile and Tablet View */}
      <div className="lg:hidden flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Not available for mobile</h1>
          <p className="text-gray-300">Please visit on a desktop device for the full experience.</p>
        </div>
      </div>
    </main>
  );
}
