import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Archivo variable: wght 300..800 + wdth 62..125 axis so font-stretch values work.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata = {
  title: "Shinho Global",
  description: "International materials & manufacturing partner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
