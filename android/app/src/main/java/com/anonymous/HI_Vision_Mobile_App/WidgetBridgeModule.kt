package com.anonymous.HI_Vision_Mobile_App

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import androidx.glance.appwidget.GlanceAppWidgetManager
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val appContext: ReactApplicationContext = reactContext

  override fun getName(): String = "WidgetBridge"

  // Update the widget's content (title + optional image url)
  @ReactMethod
  fun setBlogCard(title: String, imageUrl: String?) {
    // TODO: Persist title/imageUrl (Datastore/Preferences) and read them in Content()
    // For now just trigger a refresh for all Glance widget instances
    val manager = GlanceAppWidgetManager(appContext)
    val widget = NewsCardGlanceWidget()
    GlobalScope.launch {
      val ids = manager.getGlanceIds(NewsCardGlanceWidget::class.java)
      ids.forEach { glanceId ->
        widget.update(appContext, glanceId)
      }
    }
  }
}
