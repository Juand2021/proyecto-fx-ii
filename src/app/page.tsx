import { Final } from "@/components/home/Final";
import { Hero } from "@/components/home/Hero";
import { Inventario } from "@/components/home/Inventario";
import { Itinerario } from "@/components/home/Itinerario";
import { Manifiesto } from "@/components/home/Manifiesto";
import { Plata } from "@/components/home/Plata";
import { Ruta } from "@/components/home/Ruta";
import { SmoothScroll } from "@/components/home/SmoothScroll";

// Home: historia con animaciones atadas al scroll. Contenido fijo, sin base de datos.
export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Hero />
      <Manifiesto />
      <Ruta />
      <Inventario />
      <Itinerario />
      <Plata />
      <Final />
    </main>
  );
}
