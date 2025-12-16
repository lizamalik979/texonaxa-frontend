import Image from "next/image";
import Link from "next/link";
import { poppins } from "../../fonts";
import Logo from "../../../public/images/logo.svg";

const navItems = [
  { label: "Services", href: "/web-development" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "#contact" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src={Logo} alt="Tex Naxa Logo" priority className="h-8 w-auto" />
        </Link>

        <nav className="flex items-center gap-8 text-white">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm sm:text-base font-medium hover:text-amber-200 transition-colors ${poppins.className}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}