import { Final } from "@/components/home/Final";
import { Finca } from "@/components/home/Finca";
import { Hero } from "@/components/home/Hero";
import { Inventario } from "@/components/home/Inventario";
import { Itinerario } from "@/components/home/Itinerario";
import { Manifiesto } from "@/components/home/Manifiesto";
import { Plata } from "@/components/home/Plata";
import { Recuerdo } from "@/components/home/Recuerdo";
import { Ruta } from "@/components/home/Ruta";
import { SmoothScroll } from "@/components/home/SmoothScroll";

// Home: historia con animaciones atadas al scroll. Contenido fijo, sin base de datos.
// Entre secciones van fotos de recuerdo (Recuerdo) que aparecen al hacer scroll.
export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Hero />
      <Manifiesto />
      <Recuerdo n={0} desde="#16c6d4" hasta="#5d7f93" />
      <Ruta />
      <Recuerdo n={1} desde="#5d7f93" hasta="#0b3d2e" />
      <Inventario />
      <Finca />
      <Recuerdo n={2} desde="#16c6d4" hasta="#fff8e7" />
      <Itinerario />
      <Recuerdo n={3} desde="#fff8e7" hasta="#ff4f8b" />
      <Plata />
      <Recuerdo n={4} desde="#ff4f8b" hasta="#0b3d2e" />
      <Final />
    </main>
  );
}
