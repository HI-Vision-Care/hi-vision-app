package com.anonymous.HI_Vision_Mobile_App

import android.content.Context
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import androidx.work.CoroutineWorker
import org.json.JSONObject
import java.time.Duration
import java.time.Instant
import java.util.concurrent.TimeUnit

class MedicationWidgetRefreshWorker(
  appContext: Context,
  params: WorkerParameters
) : CoroutineWorker(appContext, params) {
  override suspend fun doWork(): Result {
    val manager = GlanceAppWidgetManager(applicationContext)
    val widget = NewsCardGlanceWidget()
    val ids = manager.getGlanceIds(NewsCardGlanceWidget::class.java)
    ids.forEach { glanceId -> widget.update(applicationContext, glanceId) }
    return Result.success()
  }
}

object WidgetRefreshScheduler {
  private const val WORK_TAG = "medication_widget_refresh"

  fun scheduleFromPayload(context: Context, payloadJson: String) {
    val payload = runCatching { JSONObject(payloadJson) }.getOrNull() ?: return
    val preview = payload.optJSONArray("preview") ?: return

    val workManager = WorkManager.getInstance(context)
    workManager.cancelAllWorkByTag(WORK_TAG)

    val now = Instant.now()
    var firstInstant: Instant? = null
    for (i in 0 until preview.length()) {
      val item = preview.optJSONObject(i) ?: continue
      val iso = item.optString("timeISO").takeIf { it.isNotBlank() } ?: continue
      val instant = parseInstant(iso) ?: continue
      if (instant.isBefore(now.minusSeconds(30))) continue

      if (firstInstant == null || instant.isBefore(firstInstant)) {
        firstInstant = instant
      }

      enqueueOne(workManager, instant, now, "dose")
      enqueueOne(workManager, instant.plus(Duration.ofHours(2)), now, "late")
      enqueueOne(workManager, instant.plus(Duration.ofHours(12)), now, "reset")
    }

    firstInstant?.let { scheduleCountdownTicks(workManager, it, now) }
  }

  fun cancelMedication(context: Context) {
    WorkManager.getInstance(context).cancelAllWorkByTag(WORK_TAG)
  }

  private fun enqueueOne(workManager: WorkManager, instant: Instant, now: Instant, suffix: String) {
    val delayMillis = Duration.between(now, instant).toMillis().coerceAtLeast(0)
    val request = OneTimeWorkRequestBuilder<MedicationWidgetRefreshWorker>()
      .setInitialDelay(delayMillis, TimeUnit.MILLISECONDS)
      .setInputData(workDataOf("reason" to suffix))
      .addTag(WORK_TAG)
      .build()

    val uniqueName = "${WORK_TAG}_${suffix}_${instant.epochSecond}"
    workManager.enqueueUniqueWork(uniqueName, ExistingWorkPolicy.REPLACE, request)
  }

  private fun parseInstant(value: String): Instant? =
    runCatching { Instant.parse(value) }.getOrNull()

  private fun scheduleCountdownTicks(workManager: WorkManager, target: Instant, now: Instant) {
    if (!target.isAfter(now)) return

    val hoursAhead = Duration.between(now, target).toHours().coerceAtMost(24)
    for (h in hoursAhead.toInt() downTo 1) {
      val tick = target.minus(Duration.ofHours(h.toLong()))
      if (tick.isAfter(now)) {
        enqueueOne(workManager, tick, now, "tick")
      }
    }

    var tick = target.minus(Duration.ofHours(2))
    while (tick.isAfter(now) && tick.isBefore(target)) {
      enqueueOne(workManager, tick, now, "tick_fine")
      tick = tick.plus(Duration.ofMinutes(30))
    }
  }
}
