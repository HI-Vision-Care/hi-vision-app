package com.anonymous.HI_Vision_Mobile_App

import android.util.Log
import androidx.glance.appwidget.GlanceAppWidgetManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.json.JSONObject

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val appContext: ReactApplicationContext = reactContext

  override fun getName(): String = "WidgetBridge"

  // Update the widget's content (title + optional image url)
  @ReactMethod
  fun setBlogCard(title: String, imageUrl: String?) {
    appContext.widgetPrefs.edit()
      .putString(WidgetStorage.KEY_MODE, WidgetStorage.MODE_BLOG)
      .putString(WidgetStorage.KEY_BLOG_TITLE, title)
      .putString(WidgetStorage.KEY_BLOG_IMAGE, imageUrl)
      .remove(WidgetStorage.KEY_MEDICATION_JSON)
      .remove(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE)
      .remove(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT)
      .remove(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO)
      .apply()

    WidgetRefreshScheduler.cancelMedication(appContext)
    requestWidgetRefresh()
  }

  @ReactMethod
  fun setMedicationReminder(payloadJson: String) {
    if (payloadJson.isBlank()) {
      Log.w(TAG, "Received empty payload for setMedicationReminder")
      return
    }

    appContext.widgetPrefs.edit()
      .putString(WidgetStorage.KEY_MODE, WidgetStorage.MODE_MEDICATION)
      .putString(WidgetStorage.KEY_MEDICATION_JSON, payloadJson)
      .remove(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO)
      .apply()

    maybeResetConfirmation(payloadJson)
    WidgetRefreshScheduler.scheduleFromPayload(appContext, payloadJson)
    requestWidgetRefresh()
  }

  private fun maybeResetConfirmation(payloadJson: String) {
    val prefs = appContext.widgetPrefs
    val confirmedIso = prefs.getString(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE, null) ?: return

    val json = runCatching { JSONObject(payloadJson) }.getOrNull() ?: return
    val nextIso = json.optJSONObject("next")?.optString("timeISO")?.takeIf { it.isNotBlank() }
    val preview = json.optJSONArray("preview")

    val stillExists = when {
      confirmedIso == nextIso -> true
      preview == null -> false
      else -> {
        var found = false
        for (i in 0 until preview.length()) {
          val item = preview.optJSONObject(i) ?: continue
          val iso = item.optString("timeISO")
          if (iso.isNotBlank() && iso == confirmedIso) {
            found = true
            break
          }
        }
        found
      }
    }

    if (!stillExists) {
      prefs.edit()
        .remove(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE)
        .remove(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT)
        .remove(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO)
        .apply()
    }
  }

  private fun requestWidgetRefresh() {
    val manager = GlanceAppWidgetManager(appContext)
    val widget = NewsCardGlanceWidget()
    GlobalScope.launch {
      val ids = manager.getGlanceIds(NewsCardGlanceWidget::class.java)
      ids.forEach { glanceId ->
        widget.update(appContext, glanceId)
      }
    }
  }

  companion object {
    private const val TAG = "WidgetBridgeModule"
  }
}
