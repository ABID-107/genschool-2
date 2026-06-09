import type { Metadata } from "next";
<<<<<<< HEAD
import { Bricolage_Grotesque, DM_Sans, Manrope, Noto_Serif, Tiro_Bangla, Fjalla_One } from "next/font/google";
=======
import { Bricolage_Grotesque, DM_Sans, Manrope, Noto_Serif, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
import "./globals.css";
import GlobalLanguageToggle from "@/components/GlobalLanguageToggle";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage-next",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-next",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope-next",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif-next",
  subsets: ["latin"],
  weight: ["400", "700"],
});

<<<<<<< HEAD
const tiroBangla = Tiro_Bangla({
  variable: "--font-tiro-bangla-next",
  subsets: ["bengali", "latin"],
  weight: "400",
});

const fjallaOne = Fjalla_One({
  variable: "--font-fjalla-next",
  subsets: ["latin"],
  weight: "400",
=======
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-next",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali-next",
  subsets: ["bengali", "latin"],
  weight: ["400", "700"],
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
});

export const metadata: Metadata = {
  title: "GenSchool — Smart Education Management Platform",
  description: "All-in-One Smart Education Management Platform for schools, colleges, coaching centers, and universities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${manrope.variable} ${notoSerif.variable} ${tiroBangla.variable} ${fjallaOne.variable} h-full antialiased scroll-smooth`} suppressHydrationWarning>
      <head>
=======
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${manrope.variable} ${notoSerif.variable} ${hindSiliguri.variable} ${notoBengali.variable} h-full antialiased scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="font" type="font/woff2" href="https://banglawebfonts.pages.dev/fonts/ekush/ekush-regular.woff2" crossOrigin="anonymous" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
<<<<<<< HEAD
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
=======
      <body className="min-h-full flex flex-col">
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
        {children}
        <GlobalLanguageToggle />
      </body>
    </html>
  );
}

