package com.anonymous.HI_Vision_Mobile_App

import android.util.Log
import androidx.glance.appwidget.GlanceAppWidgetManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.time.Instant

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val appContext: ReactApplicationContext = reactContext
  private val refreshScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

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

  @ReactMethod
  fun recordMedicationConfirmation(scheduleIso: String, confirmedAtIso: String?) {
    if (scheduleIso.isBlank()) {
      Log.w(TAG, "recordMedicationConfirmation received blank scheduleIso")
      return
    }

    val confirmedIso = confirmedAtIso?.takeIf { it.isNotBlank() } ?: Instant.now().toString()
    val prefs = appContext.widgetPrefs

    prefs.edit()
      .putString(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE, scheduleIso)
      .putString(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT, confirmedIso)
      .putString(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO, scheduleIso)
      .apply()

    appendConfirmationHistory(prefs, scheduleIso, confirmedIso)

    prefs.getString(WidgetStorage.KEY_MEDICATION_JSON, null)?.let {
      WidgetRefreshScheduler.scheduleFromPayload(appContext, it)
    }

    requestWidgetRefresh()
  }

  @ReactMethod
  fun getMedicationConfirmedHistory(promise: Promise) {
    val history = loadConfirmationHistory(appContext.widgetPrefs)
    val array = Arguments.createArray()
    history.forEach { entry ->
      array.pushString(entry.scheduleIso)
    }
    promise.resolve(array)
  }

  @ReactMethod
  fun clearMedicationConfirmedHistory(promise: Promise) {
    clearConfirmationHistory(appContext.widgetPrefs)
    promise.resolve(null)
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
    val context = appContext.applicationContext
    val widget = NewsCardGlanceWidget()
    refreshScope.launch {
      val manager = try {
        GlanceAppWidgetManager(context)
      } catch (error: Exception) {
        Log.e(TAG, "Unable to create Glance manager", error)
        return@launch
      }

      val ids = try {
        manager.getGlanceIds(NewsCardGlanceWidget::class.java)
      } catch (error: Exception) {
        Log.e(TAG, "Failed to load widget ids", error)
        return@launch
      }

      if (ids.isEmpty()) return@launch

      ids.forEach { glanceId ->
        try {
          widget.update(context, glanceId)
        } catch (error: Exception) {
          Log.e(TAG, "Failed to refresh widget id=$glanceId", error)
        }
      }
    }
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()
    refreshScope.cancel()
  }

  companion object {
    private const val TAG = "WidgetBridgeModule"
  }
}
