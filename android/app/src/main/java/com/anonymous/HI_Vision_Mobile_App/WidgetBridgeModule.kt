package com.anonymous.HI_Vision_Mobile_App

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val appContext: ReactApplicationContext = reactContext

  override fun getName(): String = "WidgetBridge"

  // Update the widget's content (title + optional image url)
  @ReactMethod
  fun setBlogCard(title: String, imageUrl: String?) {
    // Update both fixed-size widgets
    MySmallWidget.updateAll(appContext, title, imageUrl)
    MyLargeWidget.updateAll(appContext, title, imageUrl)
  }
}
