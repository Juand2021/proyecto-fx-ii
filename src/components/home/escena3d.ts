// Escena 3D del inventario: lata Poker, tetrapak Néctar y botella Smirnoff.
// Se carga con import() dinámico para que three.js solo baje cuando hace falta.
// Renderiza solo cuando cambia el scroll (no hay loop permanente): ahorra batería.

import * as THREE from "three";
import perfiles from "./productos-perfiles.json";

type Redondo = { perfil: number[][]; aspecto: number; tapaArriba: string; tapaAbajo: string };

export type Escena = { dibujar: (progreso: number) => void; destruir: () => void };

const ALTOS = { poker: 1.05, nectar: 1.5, smirnoff: 1.85 };
const PISO = -0.85;

function textura(loader: THREE.TextureLoader, url: string, alListo: () => void) {
  const t = loader.load(url, alListo);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function redondo(datos: Redondo, alto: number, mapa: THREE.Texture, brillo: { rugosidad: number; metal: number }) {
  const g = new THREE.Group();
  const puntos = datos.perfil.map(([r, y]) => new THREE.Vector2(r * alto, y * alto));
  const cuerpo = new THREE.Mesh(
    new THREE.LatheGeometry(puntos, 72),
    new THREE.MeshStandardMaterial({ map: mapa, roughness: brillo.rugosidad, metalness: brillo.metal, side: THREE.DoubleSide }),
  );
  g.add(cuerpo);
  const tapa = (r: number, y: number, color: string, arriba: boolean) => {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(r, 48),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 }),
    );
    m.rotation.x = arriba ? -Math.PI / 2 : Math.PI / 2;
    m.position.y = y;
    g.add(m);
  };
  const p = datos.perfil;
  tapa(p[p.length - 1][0] * alto, alto, datos.tapaArriba, true);
  tapa(p[0][0] * alto, 0, datos.tapaAbajo, false);
  g.position.y = PISO;
  return g;
}

export function crearEscena(canvas: HTMLCanvasElement): Escena {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(28, 1, 0.1, 50);

  escena.add(new THREE.HemisphereLight(0xffffff, 0x7a9a80, 2.2));
  const sol = new THREE.DirectionalLight(0xffffff, 2.2);
  sol.position.set(-2, 3, 4);
  escena.add(sol);
  const contra = new THREE.DirectionalLight(0xc4f135, 1.2);
  contra.position.set(3, 1, -3);
  escena.add(contra);

  let pedido = 0;
  let ultimo = 0;
  const dibujarYa = () => {
    pedido = 0;
    renderer.render(escena, camara);
  };
  const pedirDibujo = () => {
    if (!pedido) pedido = requestAnimationFrame(dibujarYa);
  };

  const loader = new THREE.TextureLoader();
  const base = "/productos/";
  const poker = redondo(perfiles.poker as Redondo, ALTOS.poker, textura(loader, `${base}poker.webp`, pedirDibujo), {
    rugosidad: 0.35,
    metal: 0.25,
  });
  const smirnoff = redondo(perfiles.smirnoff as Redondo, ALTOS.smirnoff, textura(loader, `${base}smirnoff.webp`, pedirDibujo), {
    rugosidad: 0.15,
    metal: 0.05,
  });

  // Tetrapak: caja con foto al frente y atrás
  const n = perfiles.nectar;
  const anchoN = ALTOS.nectar * n.aspecto;
  const frente = textura(loader, `${base}nectar-frente.webp`, pedirDibujo);
  const costado = textura(loader, `${base}nectar-costado.webp`, pedirDibujo);
  const mat = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, ...o });
  const nectar = new THREE.Mesh(new THREE.BoxGeometry(anchoN, ALTOS.nectar, anchoN * 0.62), [
    mat({ map: costado }),
    mat({ map: costado }),
    mat({ color: n.tapaArriba }),
    mat({ color: "#e9ece4" }),
    mat({ map: frente }),
    mat({ map: frente }),
  ]);
  nectar.position.y = PISO + ALTOS.nectar / 2;
  const grupoNectar = new THREE.Group();
  grupoNectar.add(nectar);

  const productos = [poker, grupoNectar, smirnoff];
  const xs = [-1.02, 0, 1.02];
  productos.forEach((p, i) => {
    p.position.x = xs[i];
    escena.add(p);
  });

  const ajustar = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    // encuadre: que quepan ~3.3 de ancho y ~2.2 de alto
    const t = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
    const d = Math.max(1.05 / t, 1.62 / (t * camara.aspect));
    camara.position.set(0, 0.25, d);
    camara.lookAt(0, 0.05, 0);
    camara.updateProjectionMatrix();
    dibujar(ultimo);
  };

  const dibujar = (prog: number) => {
    ultimo = prog;
    const entrada = Math.min(1, prog / 0.18);
    const suave = 1 - Math.pow(1 - entrada, 3);
    productos.forEach((p, i) => {
      const base = i === 1 ? PISO + ALTOS.nectar / 2 : PISO;
      const obj = i === 1 ? nectar : p;
      p.rotation.y = prog * Math.PI * 4 * (i === 1 ? -1 : 1) + i * 0.6 - 0.3;
      p.rotation.z = Math.sin(prog * Math.PI * 6 + i) * 0.06;
      obj.position.y = (i === 1 ? base : PISO) - (1 - suave) * 2.4;
      p.scale.setScalar(0.6 + 0.4 * suave);
    });
    pedirDibujo();
  };

  const obs = new ResizeObserver(ajustar);
  obs.observe(canvas);
  ajustar();

  return {
    dibujar,
    destruir: () => {
      obs.disconnect();
      cancelAnimationFrame(pedido);
      escena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = Array.isArray(o.material) ? o.material : [o.material];
          m.forEach((x: THREE.MeshStandardMaterial) => {
            x.map?.dispose();
            x.dispose();
          });
        }
      });
      renderer.dispose();
    },
  };
}
