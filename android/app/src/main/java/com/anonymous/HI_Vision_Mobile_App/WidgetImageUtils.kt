package com.anonymous.HI_Vision_Mobile_App

import android.graphics.*
import kotlin.math.sqrt

internal fun blurBitmapCompat(src: Bitmap, radius: Int): Bitmap {
  val r = radius.coerceIn(1, 25)
  val scale = 0.5f
  val w = (src.width * scale).toInt().coerceAtLeast(1)
  val h = (src.height * scale).toInt().coerceAtLeast(1)
  val input = Bitmap.createScaledBitmap(src, w, h, true).copy(Bitmap.Config.ARGB_8888, true)
  val out = stackBlur(input, r)
  return Bitmap.createScaledBitmap(out, src.width, src.height, true)
}

// Simple stack blur implementation (same as before)
internal fun stackBlur(sentBitmap: Bitmap, radius: Int): Bitmap {
  if (radius < 1) return sentBitmap
  val bitmap = sentBitmap.copy(Bitmap.Config.ARGB_8888, true)
  val w = bitmap.width
  val h = bitmap.height
  val pix = IntArray(w * h)
  bitmap.getPixels(pix, 0, w, 0, 0, w, h)

  val wm = w - 1
  val hm = h - 1
  val wh = w * h
  val div = radius + radius + 1

  val r = IntArray(wh)
  val g = IntArray(wh)
  val b = IntArray(wh)
  var rsum: Int
  var gsum: Int
  var bsum: Int
  var x: Int
  var y: Int
  var i: Int
  var p: Int
  var yp: Int
  var yi = 0
  var yw = 0
  val vmin = IntArray(kotlin.math.max(w, h))

  val divsum = (div + 1) shr 1
  val divsumSq = divsum * divsum
  val dv = IntArray(256 * divsumSq)
  i = 0
  while (i < dv.size) { dv[i] = i / divsumSq; i++ }

  val stack = Array(div) { IntArray(3) }
  var stackpointer: Int
  var stackstart: Int
  var sir: IntArray
  var rbs: Int
  val r1 = radius + 1
  var routsum: Int
  var goutsum: Int
  var boutsum: Int
  var rinsum: Int
  var ginsum: Int
  var binsum: Int

  y = 0
  while (y < h) {
    rinsum = 0; ginsum = 0; binsum = 0
    routsum = 0; goutsum = 0; boutsum = 0
    rsum = 0; gsum = 0; bsum = 0
    i = -radius
    while (i <= radius) {
      p = pix[yi + kotlin.math.min(wm, kotlin.math.max(i, 0))]
      sir = stack[i + radius]
      sir[0] = (p and 0xff0000) shr 16
      sir[1] = (p and 0x00ff00) shr 8
      sir[2] = p and 0x0000ff
      rbs = r1 - kotlin.math.abs(i)
      rsum += sir[0] * rbs
      gsum += sir[1] * rbs
      bsum += sir[2] * rbs
      if (i > 0) { rinsum += sir[0]; ginsum += sir[1]; binsum += sir[2] } else { routsum += sir[0]; goutsum += sir[1]; boutsum += sir[2] }
      i++
    }
    stackpointer = radius
    x = 0
    while (x < w) {
      r[yi] = dv[rsum]
      g[yi] = dv[gsum]
      b[yi] = dv[bsum]
      rsum -= routsum; gsum -= goutsum; bsum -= boutsum
      stackstart = stackpointer - radius + div
      sir = stack[stackstart % div]
      routsum -= sir[0]; goutsum -= sir[1]; boutsum -= sir[2]
      if (y == 0) vmin[x] = kotlin.math.min(x + r1, wm)
      p = pix[yw + vmin[x]]
      sir[0] = (p and 0xff0000) shr 16
      sir[1] = (p and 0x00ff00) shr 8
      sir[2] = p and 0x0000ff
      rinsum += sir[0]; ginsum += sir[1]; binsum += sir[2]
      rsum += rinsum; gsum += ginsum; bsum += binsum
      stackpointer = (stackpointer + 1) % div
      sir = stack[stackpointer]
      routsum += sir[0]; goutsum += sir[1]; boutsum += sir[2]
      rinsum -= sir[0]; ginsum -= sir[1]; binsum -= sir[2]
      yi++; x++
    }
    yw += w; y++
  }

  x = 0
  while (x < w) {
    rinsum = 0; ginsum = 0; binsum = 0
    routsum = 0; goutsum = 0; boutsum = 0
    rsum = 0; gsum = 0; bsum = 0
    yp = -radius * w
    i = -radius
    while (i <= radius) {
      yi = kotlin.math.max(0, yp) + x
      sir = stack[i + radius]
      sir[0] = r[yi]; sir[1] = g[yi]; sir[2] = b[yi]
      rbs = r1 - kotlin.math.abs(i)
      rsum += r[yi] * rbs; gsum += g[yi] * rbs; bsum += b[yi] * rbs
      if (i > 0) { rinsum += sir[0]; ginsum += sir[1]; binsum += sir[2] } else { routsum += sir[0]; goutsum += sir[1]; boutsum += sir[2] }
      if (i < h - 1) yp += w
      i++
    }
    yi = x
    stackpointer = radius
    y = 0
    while (y < h) {
      pix[yi] = (0xff000000.toInt() and pix[yi]) or (dv[rsum] shl 16) or (dv[gsum] shl 8) or dv[bsum]
      rsum -= routsum; gsum -= goutsum; bsum -= boutsum
      stackstart = stackpointer - radius + div
      sir = stack[stackstart % div]
      routsum -= sir[0]; goutsum -= sir[1]; boutsum -= sir[2]
      if (x == 0) vmin[y] = kotlin.math.min(y + r1, hm) * w
      p = x + vmin[y]
      sir[0] = r[p]; sir[1] = g[p]; sir[2] = b[p]
      rinsum += sir[0]; ginsum += sir[1]; binsum += sir[2]
      rsum += rinsum; gsum += ginsum; bsum += binsum
      stackpointer = (stackpointer + 1) % div
      sir = stack[stackpointer]
      routsum += sir[0]; goutsum += sir[1]; boutsum += sir[2]
      rinsum -= sir[0]; ginsum -= sir[1]; binsum -= sir[2]
      yi += w; y++
    }
    x++
  }

  bitmap.setPixels(pix, 0, w, 0, 0, w, h)
  return bitmap
}

internal fun roundedCornersBitmap(src: Bitmap, radiusPx: Float): Bitmap {
  val output = Bitmap.createBitmap(src.width, src.height, Bitmap.Config.ARGB_8888)
  val canvas = Canvas(output)
  val paint = Paint(Paint.ANTI_ALIAS_FLAG)
  val rect = RectF(0f, 0f, src.width.toFloat(), src.height.toFloat())
  paint.color = Color.WHITE
  canvas.drawRoundRect(rect, radiusPx, radiusPx, paint)
  paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.SRC_IN)
  canvas.drawBitmap(src, 0f, 0f, paint)
  paint.xfermode = null
  return output
}

internal fun applyDarkOverlay(src: Bitmap, alpha: Int = 160): Bitmap {
  val out = src.copy(Bitmap.Config.ARGB_8888, true)
  val c = Canvas(out)
  val p = Paint(Paint.ANTI_ALIAS_FLAG)
  p.color = Color.argb(alpha, 0, 0, 0)
  c.drawRect(0f, 0f, out.width.toFloat(), out.height.toFloat(), p)
  return scaleDownIfNeeded(out)
}

internal fun scaleDownIfNeeded(src: Bitmap, maxPixels: Int = 250_000): Bitmap {
  val pixels = src.width * src.height
  if (pixels <= maxPixels) return src
  val ratio = sqrt(maxPixels.toDouble() / pixels.toDouble())
  val newW = (src.width * ratio).toInt().coerceAtLeast(1)
  val newH = (src.height * ratio).toInt().coerceAtLeast(1)
  return Bitmap.createScaledBitmap(src, newW, newH, true)
}

internal fun rotateBitmap(src: Bitmap, angle: Float): Bitmap {
  val matrix = Matrix()
  matrix.postRotate(angle)
  return Bitmap.createBitmap(src, 0, 0, src.width, src.height, matrix, true)
}

