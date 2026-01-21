import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
            Dan's
          </h1>
          <p className="text-zinc-400 uppercase tracking-[0.4em] text-sm">
            AUTO <span className="text-red-600">BODY</span>
          </p>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">Client Portal</h2>
        <p className="text-zinc-400 mb-8">
          Track your vehicle's repair progress and communicate with our team.
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-red-600 text-white px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-red-700 transition-all rounded-sm"
          >
            Client Login
          </Link>
          
          <a
            href="https://dansautobodyma.com"
            className="block w-full bg-zinc-800 text-white px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-zinc-700 transition-all rounded-sm"
          >
            Back to Website
          </a>
        </div>

        <p className="mt-8 text-zinc-500 text-sm">
          Need help? Call us at <a href="tel:9785873341" className="text-red-600 hover:text-red-500">(978) 587-3341</a>
        </p>
      </div>
    </main>
  );
}
