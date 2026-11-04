"""
Recorta a Cabito (mascota de la Tadeo) de assets/cabito.png:
quita el fondo morado con confeti y el círculo blanco, deja solo el perrito.

- El círculo blanco se quita con relleno desde el borde, así se conservan los blancos
  internos (brillo de ojos, lengua) porque el perrito tiene contorno negro.
- Todo lo que está fuera del círculo (morado y confeti) se descarta.
- Escala x3 para que se vea nítido en pantallas retina.

Uso: python scripts/procesar-cabito.py
"""

import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
im = Image.open(RAIZ / "assets" / "cabito.png").convert("RGB")
w, h = im.size
px = im.load()


def blanco(c):
    return min(c) > 215


# 1) región blanca conectada (el círculo), desde un punto blanco arriba al centro
semilla = next((x, y) for y in range(h) for x in range(w // 2 - 10, w // 2 + 10) if blanco(px[x, y]))
fondo = [[False] * w for _ in range(h)]
cola = deque([semilla])
fondo[semilla[1]][semilla[0]] = True
while cola:
    x, y = cola.popleft()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not fondo[ny][nx] and blanco(px[nx, ny]):
            fondo[ny][nx] = True
            cola.append((nx, ny))

# 2) círculo: extremos de la región blanca
xs = [x for y in range(h) for x in range(w) if fondo[y][x]]
ys = [y for y in range(h) for x in range(w) if fondo[y][x]]
izq, der, arriba = min(xs), max(xs), min(ys)
R = (der - izq) / 2
cx, cy = (izq + der) / 2, arriba + R
R_util = R - 1.5  # deja por fuera el aro morado del círculo

# 3) máscara: dentro del círculo y no es el blanco de fondo
alfa = Image.new("L", (w, h), 0)
ap = alfa.load()
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        morado = r - g > 40 and b - g > 60  # aro y fondo morado (la camiseta azul tiene g > r)
        if (x - cx) ** 2 + (y - cy) ** 2 <= R_util**2 and not fondo[y][x] and not morado:
            ap[x, y] = 255

# limpiar pixeles sueltos y suavizar el borde
alfa = alfa.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
caja = alfa.getbbox()
rgba = im.convert("RGBA")
rgba.putalpha(alfa)
rgba = rgba.crop(caja)

ESC = 3
grande = rgba.resize((rgba.width * ESC, rgba.height * ESC), Image.LANCZOS)
a = grande.getchannel("A").filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: 0 if v < 60 else min(255, int((v - 60) * 1.4)))
grande = grande.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
grande.putalpha(a)

destino = RAIZ / "public" / "cabito.webp"
grande.save(destino, quality=92)

# posición de los ojos (en % del recorte) para ponerle las gafas encima
ojos = {"izq": (99, 89), "der": (143, 86)}  # medidos sobre la imagen original
datos = {
    "ancho": grande.width,
    "alto": grande.height,
    "ojos": {k: [round((x - caja[0]) / (caja[2] - caja[0]) * 100, 2), round((y - caja[1]) / (caja[3] - caja[1]) * 100, 2)] for k, (x, y) in ojos.items()},
}
print(json.dumps(datos), destino.stat().st_size // 1024, "KB")
