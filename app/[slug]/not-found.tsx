import Link from "next/link";
import { poppins } from "../fonts";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-6 sm:px-8">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 ${poppins.className}`}
        >
          404
        </h1>
        <p
          className={`text-lg sm:text-xl text-white/80 mb-8 ${poppins.className}`}
        >
          Service not found
        </p>
        <Link
          href="/"
          className={`inline-block px-8 py-4 bg-[#FBEAAB] text-black rounded-lg text-lg font-semibold hover:bg-[#F5E19A] transition-colors ${poppins.className}`}
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
