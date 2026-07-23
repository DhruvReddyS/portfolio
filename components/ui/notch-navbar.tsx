"use client";

import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Expertise", href: "#expertise" },
  { label: "About", href: "#about" },
];

export function NotchNavbar({
  className,
  logo,
  ...props
}: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className={cn("fixed inset-x-0 top-0 z-50 flex h-16 px-0", className)}
        {...props}
      >
        <div className="nav-rail flex-1" />
        <div className="notch-shell">
          <div className="notch-corner notch-corner-left" />
          <div className="notch-center">
            <button
              className="nav-menu-button"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            <nav className="nav-links" aria-label="Primary navigation">
              {links.slice(0, 2).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link href="#home" className="nav-monogram" aria-label="Dhruv Reddy home">
              {logo || (
                <>
                  <span>DR</span>
                  <i />
                </>
              )}
            </Link>

            <nav className="nav-links nav-links-right" aria-label="Secondary navigation">
              {links.slice(2).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a className="resume-link" href="/assets/dhruv-reddy-resume.pdf" target="_blank">
                Résumé <Download size={13} />
              </a>
            </nav>
          </div>
          <div className="notch-corner notch-corner-right" />
        </div>
        <div className="nav-rail flex-1" />
      </header>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a href="/assets/dhruv-reddy-resume.pdf" target="_blank">
            Download résumé
          </a>
        </nav>
      )}
    </>
  );
}

export default NotchNavbar;
