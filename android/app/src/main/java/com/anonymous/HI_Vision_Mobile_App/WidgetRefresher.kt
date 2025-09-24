package com.anonymous.HI_Vision_Mobile_App

import android.content.Context
import android.util.Log
import androidx.glance.appwidget.GlanceAppWidgetManager
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.MainCoroutineDispatcher
import kotlinx.coroutines.withContext

object WidgetRefresher {
  private const val TAG = "WidgetRefresher"

  suspend fun refresh(context: Context) {
    val appContext = context.applicationContext
    val dispatcher = resolveDispatcher()

    withContext(dispatcher) {
      val widget = NewsCardGlanceWidget()

      val manager = try {
        GlanceAppWidgetManager(appContext)
      } catch (error: Exception) {
        if (error is CancellationException) throw error
        Log.e(TAG, "Unable to create Glance manager", error)
        return@withContext
      }

      val ids = try {
        manager.getGlanceIds(NewsCardGlanceWidget::class.java)
      } catch (error: Exception) {
        if (error is CancellationException) throw error
        Log.e(TAG, "Failed to load widget ids", error)
        return@withContext
      }

      if (ids.isEmpty()) return@withContext

      ids.forEach { glanceId ->
        try {
          widget.update(appContext, glanceId)
        } catch (error: Exception) {
          if (error is CancellationException) throw error
          Log.e(TAG, "Failed to refresh widget id=$glanceId", error)
        }
      }
    }
  }

  private fun resolveDispatcher(): CoroutineDispatcher {
    val main = runCatching { Dispatchers.Main }.getOrElse { error ->
      Log.w(TAG, "Dispatchers.Main unavailable; falling back to Dispatchers.Default", error)
      return Dispatchers.Default
    }

    val immediate = runCatching {
      (main as? MainCoroutineDispatcher)?.immediate
    }.getOrNull()

    return immediate ?: main
  }
}
