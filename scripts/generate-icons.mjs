import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 6 // color type RGBA
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0
  const ihdr = chunk('IHDR', ihdrData)

  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter type none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = chunk('IDAT', deflateSync(raw, { level: 9 }))
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function makeIcon(size) {
  const bg = hexToRgb('#E8873F') // warm orange
  const bgDeep = hexToRgb('#C1602A')
  const card = hexToRgb('#FFFDF9')
  const accent = hexToRgb('#E07A3F')

  const buf = Buffer.alloc(size * size * 4)

  const pad = Math.round(size * 0.15)
  const cardLeft = pad
  const cardRight = size - pad
  const cardTop = Math.round(size * 0.24)
  const cardBottom = size - pad
  const headerBottom = cardTop + Math.round((cardBottom - cardTop) * 0.24)
  const cardRadius = Math.round(size * 0.06)

  const ringW = Math.max(2, Math.round(size * 0.045))
  const ring1X = cardLeft + Math.round((cardRight - cardLeft) * 0.22)
  const ring2X = cardLeft + Math.round((cardRight - cardLeft) * 0.78)
  const ringTop = cardTop - Math.round(size * 0.07)
  const ringBottom = cardTop + Math.round(size * 0.03)

  const dotSize = Math.round(size * 0.11)
  const dotCx = cardLeft + Math.round((cardRight - cardLeft) * 0.5)
  const dotCy = headerBottom + Math.round((cardBottom - headerBottom) * 0.42)

  function inRoundedRect(x, y, left, top, right, bottom, radius) {
    if (x < left || x >= right || y < top || y >= bottom) return false
    const cornerChecks = [
      [left + radius, top + radius],
      [right - radius, top + radius],
      [left + radius, bottom - radius],
      [right - radius, bottom - radius]
    ]
    if (x < left + radius && y < top + radius) {
      return dist(x, y, cornerChecks[0]) <= radius
    }
    if (x >= right - radius && y < top + radius) {
      return dist(x, y, cornerChecks[1]) <= radius
    }
    if (x < left + radius && y >= bottom - radius) {
      return dist(x, y, cornerChecks[2]) <= radius
    }
    if (x >= right - radius && y >= bottom - radius) {
      return dist(x, y, cornerChecks[3]) <= radius
    }
    return true
  }

  function dist(x, y, [cx, cy]) {
    return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let [r, g, b] = bg
      // subtle diagonal shading toward deeper orange
      const shade = (x + y) / (size * 2)
      r = Math.round(r + (bgDeep[0] - r) * shade * 0.35)
      g = Math.round(g + (bgDeep[1] - g) * shade * 0.35)
      b = Math.round(b + (bgDeep[2] - b) * shade * 0.35)

      const inCard = inRoundedRect(x, y, cardLeft, cardTop, cardRight, cardBottom, cardRadius)
      if (inCard) {
        if (y < headerBottom) {
          ;[r, g, b] = bgDeep
        } else {
          ;[r, g, b] = card
        }
      }

      const inRing1 = x >= ring1X - ringW / 2 && x <= ring1X + ringW / 2 && y >= ringTop && y <= ringBottom
      const inRing2 = x >= ring2X - ringW / 2 && x <= ring2X + ringW / 2 && y >= ringTop && y <= ringBottom
      if (inRing1 || inRing2) {
        ;[r, g, b] = card
      }

      if (inCard && y >= headerBottom) {
        const d = dist(x, y, [dotCx, dotCy])
        if (d <= dotSize / 2) {
          ;[r, g, b] = accent
        }
      }

      const idx = (y * size + x) * 4
      buf[idx] = r
      buf[idx + 1] = g
      buf[idx + 2] = b
      buf[idx + 3] = 255
    }
  }

  return buf
}

for (const size of [192, 512]) {
  const rgba = makeIcon(size)
  const png = encodePNG(size, size, rgba)
  writeFileSync(join(outDir, `icon-${size}.png`), png)
  console.log(`wrote icon-${size}.png`)
}
