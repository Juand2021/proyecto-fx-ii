"""
Convierte las fotos de assets/productos/ en texturas para la escena 3D.

- Objetos redondos (lata, botella): saca la silueta (perfil de radio por altura) y
  "desenrolla" la foto para envolverla alrededor de un sólido de revolución sin estirar
  la etiqueta. Frente en u=0 (como LatheGeometry de three.js).
- Tetrapak: recorta el frente y arma la textura de los costados con el color de los bordes.

Uso: python scripts/procesar-productos.py
"""

import json
import math
from pathlib import Path

from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "assets" / "productos"
DESTINO = RAIZ / "public" / "productos"
PERFILES = RAIZ / "src" / "components" / "home" / "productos-perfiles.json"
DESTINO.mkdir(parents=True, exist_ok=True)

ALFA = 40


def recortar(im: Image.Image) -> Image.Image:
    caja = im.getchannel("A").point(lambda v: 255 if v > ALFA else 0).getbbox()
    return im.crop(caja)


def redondo(nombre: str, ancho_tex: int = 1024, puntos: int = 48) -> dict:
    im = recortar(Image.open(ORIGEN / f"{nombre}.png").convert("RGBA"))
    w, h = im.size
    px = im.load()

    izq, der = [], []
    for y in range(h):
        xs = [x for x in range(w) if px[x, y][3] > ALFA]
        izq.append(xs[0] if xs else None)
        der.append(xs[-1] if xs else None)

    # centro: mediana de los centros de cada fila
    centros = sorted((l + r) / 2 for l, r in zip(izq, der) if l is not None)
    cx = centros[len(centros) // 2]
    radios = [((r - l) / 2 if l is not None else 0.0) for l, r in zip(izq, der)]

    # suavizado (media móvil de 5 filas)
    suave = []
    for y in range(h):
        v = radios[max(0, y - 2): y + 3]
        suave.append(sum(v) / len(v))

    # textura desenrollada: alto = alto de la foto escalado al ancho de textura
    alto_tex = min(2048, round(ancho_tex * h / (2 * max(suave) * math.pi) * math.pi / 2))
    alto_tex = max(256, alto_tex)
    tex = Image.new("RGB", (ancho_tex, alto_tex))
    tp = tex.load()
    rgb = im.convert("RGB")
    rp = rgb.load()
    for v in range(alto_tex):
        y = min(h - 1, int(v / alto_tex * h))
        # 90% del radio: deja por fuera los bordes que la foto ya trae oscuros;
        # el volumen lo pone la luz de la escena 3D
        r = max(suave[y] * 0.9 - 1.5, 0.5)
        for u in range(ancho_tex):
            th = (u / ancho_tex) * 2 * math.pi
            s = math.sin(th)
            x = cx + r * s if math.cos(th) >= 0 else cx - r * s
            xi = min(w - 1, max(0, int(round(x))))
            # si cae en un pixel transparente, buscar hacia el centro
            while px[xi, y][3] <= ALFA and abs(xi - cx) > 1:
                xi += 1 if xi < cx else -1
            tp[u, v] = rp[xi, y]
    tex = tex.filter(ImageFilter.SMOOTH)
    tex.save(DESTINO / f"{nombre}.webp", quality=88)

    # perfil: de abajo hacia arriba, normalizado a alto 1
    perfil = []
    for i in range(puntos):
        y = int((1 - i / (puntos - 1)) * (h - 1))
        perfil.append([round(max(suave[y], 0.5) / h, 5), round(i / (puntos - 1), 5)])

    tapa_arriba = rp[int(cx), next(y for y in range(h) if izq[y] is not None)]
    tapa_abajo = rp[int(cx), max(y for y in range(h) if izq[y] is not None)]
    return {
        "perfil": perfil,
        "aspecto": round(w / h, 4),
        "tapaArriba": "#%02x%02x%02x" % tapa_arriba,
        "tapaAbajo": "#%02x%02x%02x" % tapa_abajo,
    }


def caja(nombre: str) -> dict:
    im = recortar(Image.open(ORIGEN / f"{nombre}.png").convert("RGBA"))
    w, h = im.size
    fondo = Image.new("RGB", im.size, (20, 120, 50))
    fondo.paste(im, mask=im.getchannel("A"))
    fondo.save(DESTINO / f"{nombre}-frente.webp", quality=90)

    # costado: el color promedio por fila del 6% izquierdo, estirado y con sombra suave
    franja = fondo.crop((int(w * 0.03), 0, int(w * 0.09), h)).resize((1, h), Image.BOX)
    costado = franja.resize((128, h), Image.NEAREST)
    sombra = Image.linear_gradient("L").rotate(90).resize((128, h))
    costado = Image.composite(costado, Image.new("RGB", costado.size, (0, 0, 0)), sombra.point(lambda v: 170 + v // 3))
    costado.save(DESTINO / f"{nombre}-costado.webp", quality=88)

    arriba = fondo.crop((0, 0, w, max(4, int(h * 0.03)))).resize((1, 1), Image.BOX).getpixel((0, 0))
    return {"aspecto": round(w / h, 4), "tapaArriba": "#%02x%02x%02x" % arriba}


if __name__ == "__main__":
    datos = {"poker": redondo("poker"), "smirnoff": redondo("smirnoff"), "nectar": caja("nectar")}
    PERFILES.write_text(json.dumps(datos, indent=1), encoding="utf-8")
    for k, v in datos.items():
        print(k, {kk: vv for kk, vv in v.items() if kk != "perfil"}, "puntos:", len(v.get("perfil", [])))
    for f in sorted(DESTINO.iterdir()):
        print(f.name, f.stat().st_size // 1024, "KB")
