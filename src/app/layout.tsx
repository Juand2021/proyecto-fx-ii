import type { Metadata, Viewport } from "next";
import { Archivo, Shrikhand } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const shrikhand = Shrikhand({
  variable: "--font-shrikhand",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proyecto F(x) II · El Reencuentro",
  description: "Villeta, 14 al 17 de noviembre. Piscina, Águila, Néctar y cero responsabilidades.",
};

export const viewport: Viewport = {
  themeColor: "#0b3d2e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${shrikhand.variable} ${archivo.variable} antialiased`}>
      <body className="min-h-dvh">
        <Nav />
        {children}
      </body>
    </html>
  );
}
