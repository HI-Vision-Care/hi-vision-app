package com.anonymous.HI_Vision_Mobile_App

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PorterDuff
import android.graphics.PorterDuffXfermode
import android.graphics.RectF
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import kotlin.math.sqrt
import java.net.HttpURLConnection
import java.net.URL

class MyFirstWidget : AppWidgetProvider() {

  private val defaultTitle = "65% người dân ủng hộ hôn nhân đồng giới"
  private val defaultImage = "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/491419671_122184810890500724_7772420299609524587_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YPisds6QH8YQ7kNvwE0Bt1E&_nc_oc=Adn8TfELPtJqXy703VxhNT3beMoH021zVP7_BugTH86tKPfCnIi1oycZF6qhQq0k6VY&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=EJ8uIpO-a0AAGx_Iel87Yw&oh=00_AfXAZGkfN1hGcrqdwTsZwWH2XdPRiYPqKi8x0CKaG9c_aw&oe=68B9EA1B"

  override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
    super.onUpdate(context, appWidgetManager, appWidgetIds)

    for (appWidgetId in appWidgetIds) {
      val layoutId = layoutForCurrentWidth(context, appWidgetId, null)
      val views = RemoteViews(context.packageName, layoutId)
      views.setTextViewText(R.id.widget_title, defaultTitle)

      val localRes = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
      val fallbackRes = if (localRes != 0) localRes else R.drawable.splashscreen_logo

      // Hiển thị tức thời
      views.setImageViewResource(R.id.widget_bg, fallbackRes)

      val optsNow = AppWidgetManager.getInstance(context).getAppWidgetOptions(appWidgetId)
      val minW = optsNow?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
      val minH = optsNow?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0

      if (layoutId == R.layout.widget_news_card_wide && minW > 0 && minH > 0) {
        val density = context.resources.displayMetrics.density
        val canvasW = (minW * density).toInt().coerceAtLeast(1)
        val canvasH = (minH * density).toInt().coerceAtLeast(1)
        val padWpx = (minW * PADDING_H_RATIO * density).toInt()
        val padHpx = (minH * PADDING_V_RATIO * density).toInt()
        computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
        views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
        views.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

        val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
        val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
        val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
        val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

        // scale → round → rotate  (bo trước, xoay sau)
        val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
        val rounded = roundedCornersBitmap(scaled, 16f)
        val rotated = rotateBitmap(rounded, -8f)

        views.setImageViewBitmap(R.id.widget_thumb, rotated)
        views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
      } else {
        views.setViewVisibility(R.id.widget_thumb, View.GONE)
      }
      appWidgetManager.updateAppWidget(appWidgetId, views)

      // Hậu xử lý nền mờ + thử tải ảnh mặc định
      Thread {
        val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
        val blurred = blurBitmapCompat(src, BLUR_RADIUS)
        val chosenLayout = layoutForCurrentWidth(context, appWidgetId, null)
        val v = RemoteViews(context.packageName, chosenLayout)

        if (chosenLayout == R.layout.widget_news_card_wide) {
          val opts = AppWidgetManager.getInstance(context).getAppWidgetOptions(appWidgetId)
          val minW2 = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
          val minH2 = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
          val density = context.resources.displayMetrics.density
          val canvasW = (minW2 * density).toInt().coerceAtLeast(1)
          val canvasH = (minH2 * density).toInt().coerceAtLeast(1)

          v.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurred, BG_DARKEN_ALPHA))
          val padWpx = (minW2 * PADDING_H_RATIO * density).toInt()
          val padHpx = (minH2 * PADDING_V_RATIO * density).toInt()
          computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
          v.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
          v.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

          val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
          val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
          val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

          val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
          val rounded = roundedCornersBitmap(scaled, 16f)
          val rotated = rotateBitmap(rounded, -8f)

          v.setImageViewBitmap(R.id.widget_thumb, rotated)
          v.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
        } else {
          v.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurred, BG_DARKEN_ALPHA))
          v.setViewVisibility(R.id.widget_thumb, View.GONE)
        }
        v.setTextViewText(R.id.widget_title, defaultTitle)
        AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId, v)
      }.start()

      Companion.currentTitle = defaultTitle
      Companion.currentImageUrl = defaultImage
      loadImageAndUpdate(context, appWidgetId, defaultImage)
    }
  }

  override fun onAppWidgetOptionsChanged(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int,
    newOptions: Bundle
  ) {
    super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)

    val layoutId = layoutForCurrentWidth(context, appWidgetId, newOptions)
    val views = RemoteViews(context.packageName, layoutId)
    views.setTextViewText(R.id.widget_title, defaultTitle)

    val localRes = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
    val fallbackRes = if (localRes != 0) localRes else R.drawable.splashscreen_logo
    views.setImageViewResource(R.id.widget_bg, fallbackRes)

    val minWInit = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0)
    val minHInit = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0)

    if (layoutId == R.layout.widget_news_card_wide && minWInit > 0 && minHInit > 0) {
      val density = context.resources.displayMetrics.density
      val canvasW = (minWInit * density).toInt().coerceAtLeast(1)
      val canvasH = (minHInit * density).toInt().coerceAtLeast(1)
      val padWpx = (minWInit * PADDING_H_RATIO * density).toInt()
      val padHpx = (minHInit * PADDING_V_RATIO * density).toInt()
      computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
      views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
      views.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

      val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
      val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
      val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
      val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

      val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
      val rounded = roundedCornersBitmap(scaled, 16f)
      val rotated = rotateBitmap(rounded, -8f)

      views.setImageViewBitmap(R.id.widget_thumb, rotated)
      views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
    } else {
      views.setViewVisibility(R.id.widget_thumb, View.GONE)
    }
    appWidgetManager.updateAppWidget(appWidgetId, views)

    Thread {
      val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
      val layoutId2 = layoutForCurrentWidth(context, appWidgetId, newOptions)
      val v = RemoteViews(context.packageName, layoutId2)

      if (layoutId2 == R.layout.widget_news_card_wide) {
        val minW = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0)
        val minH = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0)
        val density = context.resources.displayMetrics.density
        val canvasW = (minW * density).toInt().coerceAtLeast(1)
        val canvasH = (minH * density).toInt().coerceAtLeast(1)

        v.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurBitmapCompat(src, BLUR_RADIUS), BG_DARKEN_ALPHA))
        val padWpx = (minW * PADDING_H_RATIO * density).toInt()
        val padHpx = (minH * PADDING_V_RATIO * density).toInt()
        computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
        v.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
        v.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

        val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
        val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
        val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

        val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
        val rounded = roundedCornersBitmap(scaled, 16f)
        val rotated = rotateBitmap(rounded, -8f)

        v.setImageViewBitmap(R.id.widget_thumb, rotated)
        v.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
      } else {
        v.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurBitmapCompat(src, BLUR_RADIUS), BG_DARKEN_ALPHA))
        v.setViewVisibility(R.id.widget_thumb, View.GONE)
      }
      v.setTextViewText(R.id.widget_title, defaultTitle)
      AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId, v)
    }.start()

    val title = currentTitle ?: defaultTitle
    val image = currentImageUrl
    if (!image.isNullOrEmpty()) {
      loadImageAndUpdate(context, appWidgetId, image, newOptions)
    }
  }

  companion object {
    private const val TAG = "HiVisionWidget"
    private const val PADDING_H_RATIO = 0.0f
    private const val PADDING_V_RATIO = 0.0f
    private const val BG_DARKEN_ALPHA = 160
    private const val BLUR_RADIUS = 12
    private const val CORNER_INSET_RATIO = 0.06f
    private const val CARD_SCALE = 1.2f
    private const val THUMB_SCALE = 0.7f

    const val DEFAULT_TITLE = "65% người dân ủng hộ hôn nhân đồng giới"
    const val DEFAULT_IMAGE = "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/491419671_122184810890500724_7772420299609524587_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YPisds6QH8YQ7kNvwE0Bt1E&_nc_oc=Adn8TfELPtJqXy703VxhNT3beMoH021zVP7_BugTH86tKPfCnIi1oycZF6qhQq0k6VY&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=EJ8uIpO-a0AAGx_Iel87Yw&oh=00_AfXAZGkfN1hGcrqdwTsZwWH2XdPRiYPqKi8x0CKaG9c_aw&oe=68B9EA1B"

    var currentTitle: String? = null
    var currentImageUrl: String? = null

    fun updateAll(context: Context, title: String?, imageUrl: String?) {
      val manager = AppWidgetManager.getInstance(context)
      val component = ComponentName(context, MyFirstWidget::class.java)
      val ids = manager.getAppWidgetIds(component)
      if (ids.isEmpty()) return

      currentTitle = title
      currentImageUrl = imageUrl
      for (id in ids) {
        val layoutId = layoutForCurrentWidth(context, id, null)
        val views = RemoteViews(context.packageName, layoutId)
        if (layoutId == R.layout.widget_news_card_wide) {
          val opts = AppWidgetManager.getInstance(context).getAppWidgetOptions(id)
          val minW = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
          val minH = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
          val density = context.resources.displayMetrics.density
          val lr = (minW * PADDING_H_RATIO * density).toInt()
          val tb = (minH * PADDING_V_RATIO * density).toInt()
          views.setViewPadding(R.id.wide_content, lr, tb, lr, tb)
        }
        views.setTextViewText(R.id.widget_title, title ?: "HiVision Widget")
        views.setViewVisibility(R.id.widget_thumb, if (layoutId == R.layout.widget_news_card_wide) View.VISIBLE else View.GONE)
        manager.updateAppWidget(id, views)
        if (!imageUrl.isNullOrEmpty()) {
          loadImageAndUpdate(context, id, imageUrl)
        }
      }
    }

    private fun loadImageAndUpdate(context: Context, appWidgetId: Int, imageUrl: String, optsOverride: Bundle? = null, layoutOverride: Int? = null) {
      Thread {
        var bitmap: Bitmap? = null
        try {
          val url = URL(imageUrl)
          val connection = url.openConnection() as HttpURLConnection
          connection.connectTimeout = 5000
          connection.readTimeout = 5000
          connection.instanceFollowRedirects = true
          connection.doInput = true
          connection.connect()
          connection.inputStream.use { input ->
            bitmap = BitmapFactory.decodeStream(input)
          }
        } catch (_: Exception) {
          bitmap = null
        }

        val layoutId = layoutOverride ?: layoutForCurrentWidth(context, appWidgetId, optsOverride)
        val views = RemoteViews(context.packageName, layoutId)

        val bmp = bitmap
        if (bmp != null) {
          if (layoutId == R.layout.widget_news_card_wide) {
            val opts = optsOverride ?: AppWidgetManager.getInstance(context).getAppWidgetOptions(appWidgetId)
            val minW = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
            val minH = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
            val density = context.resources.displayMetrics.density
            val canvasW = (minW * density).toInt().coerceAtLeast(1)
            val canvasH = (minH * density).toInt().coerceAtLeast(1)

            val bgBlur = blurBitmapCompat(bmp, BLUR_RADIUS)
            views.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(bgBlur, BG_DARKEN_ALPHA))

            val padWpx = (minW * PADDING_H_RATIO * density).toInt()
            val padHpx = (minH * PADDING_V_RATIO * density).toInt()
            computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            views.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, bmp.width, bmp.height)

            val scaled = Bitmap.createScaledBitmap(bmp, imgW, imgH, true)
            val rounded = roundedCornersBitmap(scaled, 16f)
            val rotated = rotateBitmap(rounded, -8f)

            views.setImageViewBitmap(R.id.widget_thumb, rotated)
            views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            val blurred = blurBitmapCompat(bmp, BLUR_RADIUS)
            views.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurred, BG_DARKEN_ALPHA))
            views.setViewVisibility(R.id.widget_thumb, View.GONE)
          }
        } else {
          val localRes = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
          val fallbackRes = if (localRes != 0) localRes else R.drawable.splashscreen_logo
          val src = BitmapFactory.decodeResource(context.resources, fallbackRes)

          if (layoutId == R.layout.widget_news_card_wide) {
            val opts = optsOverride ?: AppWidgetManager.getInstance(context).getAppWidgetOptions(appWidgetId)
            val minW = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
            val minH = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
            val density = context.resources.displayMetrics.density
            val canvasW = (minW * density).toInt().coerceAtLeast(1)
            val canvasH = (minH * density).toInt().coerceAtLeast(1)

            views.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurBitmapCompat(src, BLUR_RADIUS), BG_DARKEN_ALPHA))

            val padWpx = (minW * PADDING_H_RATIO * density).toInt()
            val padHpx = (minH * PADDING_V_RATIO * density).toInt()
            computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            views.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

            val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
            val rounded = roundedCornersBitmap(scaled, 16f)
            val rotated = rotateBitmap(rounded, -8f)

            views.setImageViewBitmap(R.id.widget_thumb, rotated)
            views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            val blurred = blurBitmapCompat(src, BLUR_RADIUS)
            views.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurred, BG_DARKEN_ALPHA))
            views.setViewVisibility(R.id.widget_thumb, View.GONE)
          }
        }

        AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId, views)
      }.start()
    }

    fun updateAllFixed(
      context: Context,
      providerClass: Class<*>,
      layoutId: Int,
      title: String?,
      imageUrl: String?
    ) {
      val manager = AppWidgetManager.getInstance(context)
      val component = ComponentName(context, providerClass)
      val ids = manager.getAppWidgetIds(component)
      if (ids.isEmpty()) return

      for (id in ids) {
        val views = RemoteViews(context.packageName, layoutId)
        views.setTextViewText(R.id.widget_title, title ?: "HiVision Widget")

        val localRes = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
        val fallbackRes = if (localRes != 0) localRes else R.drawable.splashscreen_logo
        views.setImageViewResource(R.id.widget_bg, fallbackRes)

        if (layoutId == R.layout.widget_news_card_wide) {
          val opts = AppWidgetManager.getInstance(context).getAppWidgetOptions(id)
          val minW = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
          val minH = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
          if (minW > 0 && minH > 0) {
            val density = context.resources.displayMetrics.density
            val canvasW = (minW * density).toInt().coerceAtLeast(1)
            val canvasH = (minH * density).toInt().coerceAtLeast(1)
            val padWpx = (minW * PADDING_H_RATIO * density).toInt()
            val padHpx = (minH * PADDING_V_RATIO * density).toInt()
            computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            views.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

            val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

            val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
            val rounded = roundedCornersBitmap(scaled, 16f)
            val rotated = rotateBitmap(rounded, -8f)

            views.setImageViewBitmap(R.id.widget_thumb, rotated)
            views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            views.setViewVisibility(R.id.widget_thumb, View.GONE)
          }
        } else {
          views.setViewVisibility(R.id.widget_thumb, View.GONE)
        }
        manager.updateAppWidget(id, views)

        // Hậu xử lý & ảnh từ network
        Thread {
          val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
          val v = RemoteViews(context.packageName, layoutId)
          if (layoutId == R.layout.widget_news_card_wide) {
            val density = context.resources.displayMetrics.density
            val canvasW = (270 * density).toInt()
            val canvasH = (110 * density).toInt()
            val bgBlur = blurBitmapCompat(src, BLUR_RADIUS)
            v.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(bgBlur, BG_DARKEN_ALPHA))

            val padWpx = (270 * PADDING_H_RATIO * density).toInt()
            val padHpx = (110 * PADDING_V_RATIO * density).toInt()
            computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            v.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            v.setViewPadding(R.id.widget_title, 0, 0, 0, 0)

            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            val (imgW, imgH) = computeThumbSizePreserveRatio(containerH, availW, density, src.width, src.height)

            val scaled = Bitmap.createScaledBitmap(src, imgW, imgH, true)
            val rounded = roundedCornersBitmap(scaled, 16f)
            val rotated = rotateBitmap(rounded, -8f)

            v.setImageViewBitmap(R.id.widget_thumb, rotated)
            v.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            val blurred = blurBitmapCompat(src, BLUR_RADIUS)
            v.setImageViewBitmap(R.id.widget_bg, applyDarkOverlay(blurred, BG_DARKEN_ALPHA))
            v.setViewVisibility(R.id.widget_thumb, View.GONE)
          }
          v.setTextViewText(R.id.widget_title, title ?: "HiVision Widget")
          manager.updateAppWidget(id, v)
        }.start()

        if (!imageUrl.isNullOrEmpty()) {
          loadImageAndUpdate(context, id, imageUrl, null, layoutId)
        }
      }
    }

    private fun layoutForCurrentWidth(context: Context, appWidgetId: Int, optsOverride: Bundle?): Int {
      val manager = AppWidgetManager.getInstance(context)
      val opts = optsOverride ?: manager.getAppWidgetOptions(appWidgetId)
      val minWidthDp = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
      val minHeightDp = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0

      val w = if (minWidthDp <= 0) 1 else minWidthDp
      val h = if (minHeightDp <= 0) 1 else minHeightDp
      val ratio = w.toFloat() / h.toFloat()
      val isWide = (ratio >= 1.35f) && (w >= 170)
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "options w=$minWidthDp h=$minHeightDp ratio=$ratio -> isWide=$isWide")
      }
      return if (isWide) R.layout.widget_news_card_wide else R.layout.widget_news_card_compact
    }

    private fun blurBitmapCompat(src: Bitmap, radius: Int): Bitmap {
      val r = radius.coerceIn(1, 25)
      val scale = 0.5f
      val w = (src.width * scale).toInt().coerceAtLeast(1)
      val h = (src.height * scale).toInt().coerceAtLeast(1)
      val input = Bitmap.createScaledBitmap(src, w, h, true).copy(Bitmap.Config.ARGB_8888, true)
      val out = stackBlur(input, r)
      return Bitmap.createScaledBitmap(out, src.width, src.height, true)
    }

    // Stack blur đơn giản
    private fun stackBlur(sentBitmap: Bitmap, radius: Int): Bitmap {
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
      while (i < dv.size) {
        dv[i] = i / divsumSq
        i++
      }

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
          sir[2] = (p and 0x0000ff)
          rbs = r1 - kotlin.math.abs(i)
          rsum += sir[0] * rbs
          gsum += sir[1] * rbs
          bsum += sir[2] * rbs
          if (i > 0) {
            rinsum += sir[0]; ginsum += sir[1]; binsum += sir[2]
          } else {
            routsum += sir[0]; goutsum += sir[1]; boutsum += sir[2]
          }
          i++
        }
        stackpointer = radius
        x = 0
        while (x < w) {
          r[yi] = dv[rsum]; g[yi] = dv[gsum]; b[yi] = dv[bsum]
          rsum -= routsum; gsum -= goutsum; bsum -= boutsum
          stackstart = stackpointer - radius + div
          sir = stack[stackstart % div]
          routsum -= sir[0]; goutsum -= sir[1]; boutsum -= sir[2]
          if (y == 0) vmin[x] = kotlin.math.min(x + radius + 1, wm)
          p = pix[yw + vmin[x]]
          sir[0] = (p and 0xff0000) shr 16
          sir[1] = (p and 0x00ff00) shr 8
          sir[2] = (p and 0x0000ff)
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
          if (i > 0) { rinsum += sir[0]; ginsum += sir[1]; binsum += sir[2] }
          else { routsum += sir[0]; goutsum += sir[1]; boutsum += sir[2] }
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
          if (x == 0) vmin[y] = kotlin.math.min(y + r1, h - 1) * w
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

    private fun roundedCornersBitmap(src: Bitmap, radiusDp: Float): Bitmap {
      // Bo góc ngay trên ảnh gốc (chưa xoay)
      val radiusPx = radiusDp * (src.width.coerceAtLeast(src.height) / 200f).coerceAtLeast(1f)
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

    private fun applyDarkOverlay(src: Bitmap, alpha: Int = BG_DARKEN_ALPHA): Bitmap {
      val out = src.copy(Bitmap.Config.ARGB_8888, true)
      val c = Canvas(out)
      val p = Paint(Paint.ANTI_ALIAS_FLAG)
      p.color = Color.argb(alpha, 0, 0, 0)
      c.drawRect(0f, 0f, out.width.toFloat(), out.height.toFloat(), p)
      return scaleDownIfNeeded(out)
    }

    private fun scaleDownIfNeeded(src: Bitmap, maxPixels: Int = 250_000): Bitmap {
      val pixels = src.width * src.height
      if (pixels <= maxPixels) return src
      val ratio = sqrt(maxPixels.toDouble() / pixels.toDouble())
      val newW = (src.width * ratio).toInt().coerceAtLeast(1)
      val newH = (src.height * ratio).toInt().coerceAtLeast(1)
      return Bitmap.createScaledBitmap(src, newW, newH, true)
    }

    private fun computeTitleLeft(canvasW: Int, canvasH: Int, padW: Int, padH: Int): Int = padW

    private fun computeThumbSizePreserveRatio(
      containerH: Int,
      availW: Int,
      density: Float,
      srcW: Int,
      srcH: Int
    ): Pair<Int, Int> {
      val boundW = availW.coerceAtLeast(1)
      val boundH = containerH.coerceAtLeast(1)
      val w = srcW.coerceAtLeast(1).toFloat()
      val h = srcH.coerceAtLeast(1).toFloat()
      val scale = kotlin.math.min(boundW / w, boundH / h)
      val baseW = kotlin.math.max(1, kotlin.math.floor(w * scale).toInt())
      val baseH = kotlin.math.max(1, kotlin.math.floor(h * scale).toInt())
      val upScale = THUMB_SCALE
      val upW = (baseW * upScale).toInt()
      val upH = (baseH * upScale).toInt()
      val overW = upW > boundW
      val overH = upH > boundH
      val finalScale = if (overW || overH) {
        val sW = boundW.toFloat() / baseW.toFloat()
        val sH = boundH.toFloat() / baseH.toFloat()
        kotlin.math.min(sW, sH)
      } else upScale
      val outW = kotlin.math.max(1, (baseW * finalScale).toInt())
      val outH = kotlin.math.max(1, (baseH * finalScale).toInt())
      return Pair(outW, outH)
    }

    private fun centerCropTo(src: Bitmap, targetW: Int, targetH: Int): Bitmap {
      if (targetW <= 0 || targetH <= 0) return src
      val scale = maxOf(targetW.toFloat() / src.width, targetH.toFloat() / src.height)
      val scaledW = (src.width * scale).toInt()
      val scaledH = (src.height * scale).toInt()
      val scaled = Bitmap.createScaledBitmap(src, scaledW, scaledH, true)
      val x = ((scaledW - targetW) / 2).coerceAtLeast(0)
      val y = ((scaledH - targetH) / 2).coerceAtLeast(0)
      return Bitmap.createBitmap(scaled, x, y, targetW.coerceAtMost(scaledW - x), targetH.coerceAtMost(scaledH - y))
    }

    private fun rotateBitmap(src: Bitmap, angle: Float): Bitmap {
      val matrix = android.graphics.Matrix()
      matrix.postRotate(angle)
      return Bitmap.createBitmap(src, 0, 0, src.width, src.height, matrix, true)
    }
  }
}
