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
import android.graphics.Path
import android.graphics.PorterDuff
import android.graphics.PorterDuffXfermode
import android.graphics.RectF
import android.os.Build
import android.os.Bundle
import android.util.Log
import kotlin.math.ceil
// RenderEffect requires API 31+; we'll use a CPU stack-blur to support older versions reliably
import android.widget.RemoteViews
import android.view.View
import java.net.HttpURLConnection
import java.net.URL

class MyFirstWidget : AppWidgetProvider() {
  private val defaultTitle = "65% người dân ủng hộ hôn nhân đồng giới"
  private val defaultImage = "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/491419671_122184810890500724_7772420299609524587_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YPisds6QH8YQ7kNvwE0Bt1E&_nc_oc=Adn8TfELPtJqXy703VxhNT3beMoH021zVP7_BugTH86tKPfCnIi1oycZF6qhQq0k6VY&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=EJ8uIpO-a0AAGx_Iel87Yw&oh=00_AfXAZGkfN1hGcrqdwTsZwWH2XdPRiYPqKi8x0CKaG9c_aw&oe=68B9EA1B"
  override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
    super.onUpdate(context, appWidgetManager, appWidgetIds)
    // Default initial content
    for (appWidgetId in appWidgetIds) {
      val layoutId = layoutForCurrentWidth(context, appWidgetId, null)
      val views = RemoteViews(context.packageName, layoutId)
      views.setTextViewText(R.id.widget_title, defaultTitle)
      val localRes = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
      val fallbackRes = if (localRes != 0) localRes else R.drawable.splashscreen_logo
      // Show immediate images
      views.setImageViewResource(R.id.widget_bg, fallbackRes)
      val optsNow = AppWidgetManager.getInstance(context).getAppWidgetOptions(appWidgetId)
      val minW = optsNow?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
      val minH = optsNow?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
      if (layoutId == R.layout.widget_news_card_wide && minW > 0 && minH > 0) {
        val density = context.resources.displayMetrics.density
        val canvasW = (minW * density).toInt().coerceAtLeast(1)
        val canvasH = (minH * density).toInt().coerceAtLeast(1)
        val padWpx = (minW * PADDING_RATIO * density).toInt()
        val padHpx = (minH * PADDING_RATIO * density).toInt()
        val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
        views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
        views.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
        val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
        val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
        var imgH = containerH
        var imgW = ((imgH * 3f) / 4f).toInt()
        val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
        if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
        val cropped = centerCropTo(src, imgW, imgH)
        val rounded = roundedCornersBitmap(cropped, 16f)
        views.setImageViewBitmap(R.id.widget_thumb, rounded)
        views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
      } else {
        views.setViewVisibility(R.id.widget_thumb, View.GONE)
      }
      appWidgetManager.updateAppWidget(appWidgetId, views)

      // Post-process in background
      Thread {
        val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
        val blurred = blurBitmapCompat(src, 10)
        val chosenLayout = layoutForCurrentWidth(context, appWidgetId, null)
        val v = RemoteViews(context.packageName, chosenLayout)
        if (chosenLayout == R.layout.widget_news_card_wide) {
          val opts = AppWidgetManager.getInstance(context).getAppWidgetOptions(appWidgetId)
          val minW = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) ?: 0
          val minH = opts?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) ?: 0
          val density = context.resources.displayMetrics.density
          val canvasW = (minW * density).toInt().coerceAtLeast(1)
          val canvasH = (minH * density).toInt().coerceAtLeast(1)
          val composite = composeWideComposite(blurred, src, canvasW, canvasH, PADDING_RATIO)
          v.setImageViewBitmap(R.id.widget_bg, composite)
          // Push title to the right of the card
          val padWpx = (minW * PADDING_RATIO * density).toInt()
          val padHpx = (minH * PADDING_RATIO * density).toInt()
          val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
          v.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
          v.setViewVisibility(R.id.widget_thumb, View.GONE)
        } else {
          v.setImageViewBitmap(R.id.widget_bg, blurred)
          v.setViewVisibility(R.id.widget_thumb, View.GONE)
        }
        v.setTextViewText(R.id.widget_title, defaultTitle)
        AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId, v)
      }.start()

      // Then try remote default image asynchronously
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
    // Re-render when user resizes between 3x2 and 4x2
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
      val padWpx = (minWInit * PADDING_RATIO * density).toInt()
      val padHpx = (minHInit * PADDING_RATIO * density).toInt()
      val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
      views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
      views.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
      val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
      val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
      var imgH = containerH
      var imgW = ((imgH * 3f) / 4f).toInt()
      val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
      if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
      val cropped = centerCropTo(src, imgW, imgH)
      val rounded = roundedCornersBitmap(cropped, 16f)
      views.setImageViewBitmap(R.id.widget_thumb, rounded)
      views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
    } else {
      views.setViewVisibility(R.id.widget_thumb, View.GONE)
    }
    appWidgetManager.updateAppWidget(appWidgetId, views)
    // Re-apply processing async
    Thread {
      val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
      val layoutId = layoutForCurrentWidth(context, appWidgetId, newOptions)
      val v = RemoteViews(context.packageName, layoutId)
      if (layoutId == R.layout.widget_news_card_wide) {
        val minW = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0)
        val minH = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0)
        val density = context.resources.displayMetrics.density
        val canvasW = (minW * density).toInt().coerceAtLeast(1)
        val canvasH = (minH * density).toInt().coerceAtLeast(1)
        v.setImageViewBitmap(R.id.widget_bg, src)
        val padWpx = (minW * PADDING_RATIO * density).toInt()
        val padHpx = (minH * PADDING_RATIO * density).toInt()
        val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
        v.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
        v.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
        val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
        var imgH = containerH
        var imgW = ((imgH * 3f) / 4f).toInt()
        val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
        if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
        val cropped = centerCropTo(src, imgW, imgH)
        val rounded = roundedCornersBitmap(cropped, 16f)
        v.setImageViewBitmap(R.id.widget_thumb, rounded)
        v.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
      } else {
        v.setImageViewBitmap(R.id.widget_bg, src)
        v.setViewVisibility(R.id.widget_thumb, View.GONE)
      }
      v.setTextViewText(R.id.widget_title, defaultTitle)
      AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId, v)
    }.start()

    // Re-apply last known remote image & title if available
    val title = currentTitle ?: defaultTitle
    val image = currentImageUrl
    if (!image.isNullOrEmpty()) {
      loadImageAndUpdate(context, appWidgetId, image, newOptions)
    }
  }

  companion object {
    private const val TAG = "HiVisionWidget"
    private const val PADDING_RATIO = 0.08f
    private const val CARD_SCALE = 1.2f // enlarge left card while keeping 3:4
    // Card uses strict 3:4 crop; width derived from height and available space
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
          val lr = (minW * PADDING_RATIO * density).toInt()
          val tb = (minH * PADDING_RATIO * density).toInt()
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
            views.setImageViewBitmap(R.id.widget_bg, bmp)
            val padWpx = (minW * PADDING_RATIO * density).toInt()
            val padHpx = (minH * PADDING_RATIO * density).toInt()
            val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            views.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            var imgH = containerH
            var imgW = ((imgH * 3f) / 4f).toInt()
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
            val cropped = centerCropTo(bmp, imgW, imgH)
            val rounded = roundedCornersBitmap(cropped, 16f)
            views.setImageViewBitmap(R.id.widget_thumb, rounded)
            views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            views.setImageViewBitmap(R.id.widget_bg, bmp)
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
            views.setImageViewBitmap(R.id.widget_bg, src)
            val padWpx = (minW * PADDING_RATIO * density).toInt()
            val padHpx = (minH * PADDING_RATIO * density).toInt()
            val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            views.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            var imgH = containerH
            var imgW = ((imgH * 3f) / 4f).toInt()
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
            val cropped = centerCropTo(src, imgW, imgH)
            val rounded = roundedCornersBitmap(cropped, 16f)
            views.setImageViewBitmap(R.id.widget_thumb, rounded)
            views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            views.setImageViewBitmap(R.id.widget_bg, src)
            views.setViewVisibility(R.id.widget_thumb, View.GONE)
          }
        }
        AppWidgetManager.getInstance(context).updateAppWidget(appWidgetId, views)
      }.start()
    }

    // Used by fixed-size providers to update all instances of a given provider class with a specific layout
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
            val padWpx = (minW * PADDING_RATIO * density).toInt()
            val padHpx = (minH * PADDING_RATIO * density).toInt()
            val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            views.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            views.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
            val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            var imgH = containerH
            var imgW = ((imgH * 3f) / 4f).toInt()
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
            val cropped = centerCropTo(src, imgW, imgH)
            val rounded = roundedCornersBitmap(cropped, 16f)
            views.setImageViewBitmap(R.id.widget_thumb, rounded)
            views.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            views.setViewVisibility(R.id.widget_thumb, View.GONE)
          }
        } else {
          views.setViewVisibility(R.id.widget_thumb, View.GONE)
        }
        manager.updateAppWidget(id, views)

        // process & remote image
        Thread {
          val src = BitmapFactory.decodeResource(context.resources, fallbackRes)
          val v = RemoteViews(context.packageName, layoutId)
          if (layoutId == R.layout.widget_news_card_wide) {
            val density = context.resources.displayMetrics.density
            val canvasW = (270 * density).toInt()
            val canvasH = (110 * density).toInt()
            v.setImageViewBitmap(R.id.widget_bg, src)
            val padWpx = (270 * PADDING_RATIO * density).toInt()
            val padHpx = (110 * PADDING_RATIO * density).toInt()
            val titleLeft = computeTitleLeft(canvasW, canvasH, padWpx, padHpx)
            v.setViewPadding(R.id.wide_content, padWpx, padHpx, padWpx, padHpx)
            v.setViewPadding(R.id.widget_title, titleLeft, 0, padWpx, 0)
            val containerH = (canvasH - padHpx - padHpx).coerceAtLeast(1)
            var imgH = containerH
            var imgW = ((imgH * 3f) / 4f).toInt()
            val availW = (canvasW - padWpx - padWpx).coerceAtLeast(1)
            if (imgW > availW) { imgW = availW; imgH = ((imgW * 4f) / 3f).toInt() }
            val cropped = centerCropTo(src, imgW, imgH)
            val rounded = roundedCornersBitmap(cropped, 16f)
            v.setImageViewBitmap(R.id.widget_thumb, rounded)
            v.setViewVisibility(R.id.widget_thumb, View.VISIBLE)
          } else {
            v.setImageViewBitmap(R.id.widget_bg, src)
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

      // Robust detection across launchers: require both a wide ratio and a minimum width.
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
      // scale down for performance
      val scale = 0.5f
      val w = (src.width * scale).toInt().coerceAtLeast(1)
      val h = (src.height * scale).toInt().coerceAtLeast(1)
      val input = Bitmap.createScaledBitmap(src, w, h, true).copy(Bitmap.Config.ARGB_8888, true)
      val out = stackBlur(input, r)
      return Bitmap.createScaledBitmap(out, src.width, src.height, true)
    }

    // Lightweight stack blur implementation (box blur approximation)
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
            rinsum += sir[0]
            ginsum += sir[1]
            binsum += sir[2]
          } else {
            routsum += sir[0]
            goutsum += sir[1]
            boutsum += sir[2]
          }
          i++
        }
        stackpointer = radius

        x = 0
        while (x < w) {
          r[yi] = dv[rsum]
          g[yi] = dv[gsum]
          b[yi] = dv[bsum]

          rsum -= routsum
          gsum -= goutsum
          bsum -= boutsum

          stackstart = stackpointer - radius + div
          sir = stack[stackstart % div]

          routsum -= sir[0]
          goutsum -= sir[1]
          boutsum -= sir[2]

          if (y == 0) vmin[x] = kotlin.math.min(x + radius + 1, wm)
          p = pix[yw + vmin[x]]
          sir[0] = (p and 0xff0000) shr 16
          sir[1] = (p and 0x00ff00) shr 8
          sir[2] = (p and 0x0000ff)

          rinsum += sir[0]
          ginsum += sir[1]
          binsum += sir[2]

          rsum += rinsum
          gsum += ginsum
          bsum += binsum

          stackpointer = (stackpointer + 1) % div
          sir = stack[stackpointer]

          routsum += sir[0]
          goutsum += sir[1]
          boutsum += sir[2]
          rinsum -= sir[0]
          ginsum -= sir[1]
          binsum -= sir[2]

          yi++
          x++
        }
        yw += w
        y++
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
          sir[0] = r[yi]
          sir[1] = g[yi]
          sir[2] = b[yi]
          rbs = r1 - kotlin.math.abs(i)
          rsum += r[yi] * rbs
          gsum += g[yi] * rbs
          bsum += b[yi] * rbs
          if (i > 0) {
            rinsum += sir[0]
            ginsum += sir[1]
            binsum += sir[2]
          } else {
            routsum += sir[0]
            goutsum += sir[1]
            boutsum += sir[2]
          }
          if (i < hm) yp += w
          i++
        }
        yi = x
        stackpointer = radius
        y = 0
        while (y < h) {
          pix[yi] = (0xff000000.toInt() and pix[yi]) or (dv[rsum] shl 16) or (dv[gsum] shl 8) or dv[bsum]

          rsum -= routsum
          gsum -= goutsum
          bsum -= boutsum

          stackstart = stackpointer - radius + div
          sir = stack[stackstart % div]

          routsum -= sir[0]
          goutsum -= sir[1]
          boutsum -= sir[2]

          if (x == 0) vmin[y] = kotlin.math.min(y + r1, hm) * w
          p = x + vmin[y]
          sir[0] = r[p]
          sir[1] = g[p]
          sir[2] = b[p]

          rinsum += sir[0]
          ginsum += sir[1]
          binsum += sir[2]

          rsum += rinsum
          gsum += ginsum
          bsum += binsum

          stackpointer = (stackpointer + 1) % div
          sir = stack[stackpointer]
          routsum += sir[0]
          goutsum += sir[1]
          boutsum += sir[2]
          rinsum -= sir[0]
          ginsum -= sir[1]
          binsum -= sir[2]

          yi += w
          y++
        }
        x++
      }

      bitmap.setPixels(pix, 0, w, 0, 0, w, h)
      return bitmap
    }

    private fun roundedCornersBitmap(src: Bitmap, radiusDp: Float): Bitmap {
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

    private fun composeWideComposite(
      bgBlur: Bitmap,
      cardSrc: Bitmap,
      canvasW: Int,
      canvasH: Int,
      paddingRatio: Float
    ): Bitmap {
      val padW = (canvasW * paddingRatio).toInt()
      val padH = (canvasH * paddingRatio).toInt()

      // Background: cover (center-crop) and darken
      val bgCover = centerCropTo(bgBlur, canvasW, canvasH)
      val output = Bitmap.createBitmap(canvasW, canvasH, Bitmap.Config.ARGB_8888)
      val canvas = Canvas(output)
      canvas.drawBitmap(bgCover, 0f, 0f, null)
      val darkPaint = Paint(Paint.ANTI_ALIAS_FLAG)
      darkPaint.color = Color.argb(120, 0, 0, 0) // ~47% black overlay
      canvas.drawRect(0f, 0f, canvasW.toFloat(), canvasH.toFloat(), darkPaint)

      // Keep left card inside rounded corners by adding corner-safe padding
      // Dùng đúng padding tỷ lệ, bỏ tăng theo góc để tránh lệch trái quá nhiều
      val safePadL = padW
      val safePadT = padH

      // Container area for the card is the whole interior (left padded area)
      val availW = (canvasW - safePadL - padW).coerceAtLeast(1)
      val containerH = (canvasH - safePadT - padH).coerceAtLeast(1)
      // Strict 3:4 ratio (W:H). Maximize by height, clamp by available width.
      var imgH = containerH
      var imgW = ((imgH * 3f) / 4f).toInt()
      if (imgW > availW) {
        imgW = availW
        imgH = ((imgW * 4f) / 3f).toInt()
      }

      val cropped = centerCropTo(cardSrc, imgW, imgH)
      val rounded = roundedCornersBitmap(cropped, 16f)
      val drawX = safePadL // left align within padded area
      val drawY = safePadT + ((containerH - imgH) / 2) // vertically centered
      canvas.drawBitmap(rounded, drawX.toFloat(), drawY.toFloat(), null)
      return output
    }

    private fun computeTitleLeft(canvasW: Int, canvasH: Int, padW: Int, padH: Int): Int {
      val safePadL = padW
      val availW = (canvasW - safePadL - padW).coerceAtLeast(1)
      val containerH = (canvasH - padH - padH).coerceAtLeast(1)
      // 3:4 card width chosen by height, clamped by available width
      var cardW = ((containerH * 3f) / 4f).toInt()
      if (cardW > availW) cardW = availW
      return safePadL + cardW + (padW / 2)
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
  }
}
