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

const TITULO = "Proyecto F(x) II · El Reencuentro";
const DESCRIPCION = "Villeta, 14 al 17 de noviembre. Piscina, Poker, Néctar y cero responsabilidades. Plan aprobado por Cabito.";

// La imagen de vista previa (opengraph-image.png) y los íconos (icon.png, apple-icon.png)
// están en src/app/ y Next los enlaza solos. metadataBase hace que la URL sea absoluta,
// que es lo que exigen WhatsApp y las demás apps para mostrar la vista previa.
export const metadata: Metadata = {
  metadataBase: new URL("https://proyecto-fx-ii.vercel.app"),
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "/",
    siteName: "Proyecto F(x) II",
    locale: "es_CO",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
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
