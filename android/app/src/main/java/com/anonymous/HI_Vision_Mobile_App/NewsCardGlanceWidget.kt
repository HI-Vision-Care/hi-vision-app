package com.anonymous.HI_Vision_Mobile_App

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import android.util.Log
import android.graphics.BitmapFactory
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.GlanceId
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.background
import androidx.glance.layout.Box
import androidx.glance.Image
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxHeight
import androidx.glance.layout.padding
import androidx.glance.layout.Row
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.LocalSize
import androidx.glance.layout.ContentScale
import androidx.glance.ImageProvider

/**
 * A Glance-based AppWidget that replaces the old RemoteViews + XML layouts.
 * It adapts between 2x2 (compact) and 4x2 (wide) using SizeMode.Responsive.
 */
class NewsCardGlanceWidget : GlanceAppWidget() {

  override val sizeMode: SizeMode = SizeMode.Responsive(
    setOf(
      DpSize(110.dp, 110.dp), // approx 2x2
      DpSize(270.dp, 110.dp)  // approx 4x2
    )
  )

  override suspend fun provideGlance(context: Context, id: GlanceId) {
    val local = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
    val fallbackResId = if (local != 0) local else R.drawable.splashscreen_logo
    provideContent { Content(fallbackResId) }
  }

  @Composable
  private fun Content(fallbackResId: Int) {
    val context = LocalContext.current
    val size = LocalSize.current
    val isWide = size.width >= 240.dp && size.width > size.height
    val title = DEFAULT_TITLE

    val launchIntent = Intent(context, MainActivity::class.java)

    Box(
      modifier = GlanceModifier
        .fillMaxSize()
        .background(ColorProvider(Color(0xFF111111)))
        .padding(8.dp)
        .clickable(actionStartActivity(launchIntent))
    ) {
      Image(provider = ImageProvider(fallbackResId), contentDescription = null, contentScale = ContentScale.FillBounds, modifier = GlanceModifier.fillMaxSize())
      if (isWide) {
        Row(modifier = GlanceModifier.fillMaxSize().padding(8.dp)) {
          Image(provider = ImageProvider(fallbackResId), contentDescription = null, contentScale = ContentScale.Fit, modifier = GlanceModifier.fillMaxHeight().width(96.dp))
          Text(
            text = title,
            style = TextStyle(
              color = ColorProvider(Color.White),
              fontWeight = FontWeight.Bold,
              fontSize = 22.sp
            ),
            maxLines = 5,
            modifier = GlanceModifier.padding(start = 8.dp)
          )
        }
      } else {
        Text(
          text = title,
          style = TextStyle(
            color = ColorProvider(Color.White),
            fontWeight = FontWeight.Medium,
            fontSize = 16.sp
          ),
          maxLines = 3,
          modifier = GlanceModifier.padding(8.dp)
        )
      }
    }
  }

  companion object {
    const val DEFAULT_TITLE = "65% người dân ủng hộ hôn nhân đồng giới"
  }
}

/**
 * Glance receivers that replace the legacy AppWidgetProvider classes.
 * Manifest receivers can keep the same class names.
 */
class MySmallWidget : GlanceAppWidgetReceiver() {
  override val glanceAppWidget: GlanceAppWidget = NewsCardGlanceWidget()
  override fun onUpdate(context: Context, appWidgetManager: android.appwidget.AppWidgetManager, appWidgetIds: IntArray) {
    Log.d(TAG, "MySmallWidget onUpdate ids=${appWidgetIds.joinToString()}")
    super.onUpdate(context, appWidgetManager, appWidgetIds)
  }
  override fun onEnabled(context: Context) {
    Log.d(TAG, "MySmallWidget onEnabled")
    super.onEnabled(context)
  }
}

class MyLargeWidget : GlanceAppWidgetReceiver() {
  override val glanceAppWidget: GlanceAppWidget = NewsCardGlanceWidget()
  override fun onUpdate(context: Context, appWidgetManager: android.appwidget.AppWidgetManager, appWidgetIds: IntArray) {
    Log.d(TAG, "MyLargeWidget onUpdate ids=${appWidgetIds.joinToString()}")
    super.onUpdate(context, appWidgetManager, appWidgetIds)
  }
  override fun onEnabled(context: Context) {
    Log.d(TAG, "MyLargeWidget onEnabled")
    super.onEnabled(context)
  }
}

private const val TAG = "HiVisionGlance"
