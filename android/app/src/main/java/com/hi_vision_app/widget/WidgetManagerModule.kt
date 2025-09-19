package com.hi_vision_app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.anonymous.HI_Vision_Mobile_App.MySmallWidget
import com.anonymous.HI_Vision_Mobile_App.WidgetPinnedReceiver
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WidgetManagerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "WidgetManager"

  @ReactMethod
  fun requestPinWidget() {
    val context: Context = reactApplicationContext
    val appWidgetManager = context.getSystemService(AppWidgetManager::class.java) ?: return

    if (!appWidgetManager.isRequestPinAppWidgetSupported) return

    val provider = ComponentName(context, MySmallWidget::class.java)
    val callbackIntent = Intent(context, WidgetPinnedReceiver::class.java)
    val pendingIntent = PendingIntent.getBroadcast(
      context,
      0,
      callbackIntent,
      PendingIntent.FLAG_IMMUTABLE
    )

    appWidgetManager.requestPinAppWidget(provider, null, pendingIntent)
  }
}
