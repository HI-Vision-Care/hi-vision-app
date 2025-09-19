package com.anonymous.HI_Vision_Mobile_App

import android.content.Context
import android.content.Intent
import android.graphics.*
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.layout.height
import androidx.glance.layout.size
import androidx.glance.layout.Alignment
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import org.json.JSONArray
import org.json.JSONObject
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sin

/**
 * Glance-based AppWidget: nền ảnh full (overlay tối) + text phải.
 * Ở chế độ rộng: thumbnail bên trái là KHUNG bo góc đã xoay nguyên khung.
 */
class NewsCardGlanceWidget : GlanceAppWidget() {

  override val sizeMode: SizeMode = SizeMode.Responsive(
    setOf(
      DpSize(110.dp, 110.dp), // 2x2
      DpSize(270.dp, 110.dp)  // 4x2
    )
  )

  override suspend fun provideGlance(context: Context, id: GlanceId) {
    val local = context.resources.getIdentifier("widget_bg_fallback", "drawable", context.packageName)
    val fallbackResId = if (local != 0) local else R.drawable.splashscreen_logo
    val widgetContent = loadWidgetContent(context)

    provideContent { Content(fallbackResId, widgetContent) }
  }

  @Composable
  private fun Content(fallbackResId: Int, widgetContent: WidgetContent) {
    val context = LocalContext.current
    val size = LocalSize.current
    val isWide = size.width >= 240.dp && size.width > size.height
    val density = context.resources.displayMetrics.density
    val launchIntent = Intent(context, MainActivity::class.java)

    when (widgetContent) {
      is WidgetContent.Medication -> MedicationLayout(widgetContent.data, launchIntent, isWide)
      is WidgetContent.Blog -> BlogLayout(
        title = widgetContent.title,
        fallbackResId = fallbackResId,
        launchIntent = launchIntent,
        isWide = isWide,
        density = density,
        size = size
      )
      WidgetContent.Empty -> BlogLayout(
        title = DEFAULT_TITLE,
        fallbackResId = fallbackResId,
        launchIntent = launchIntent,
        isWide = isWide,
        density = density,
        size = size
      )
    }
  }

  @Composable
  private fun BlogLayout(
    title: String,
    fallbackResId: Int,
    launchIntent: Intent,
    isWide: Boolean,
    density: Float,
    size: DpSize
  ) {
    Box(
      modifier = GlanceModifier
        .fillMaxSize()
        .background(ColorProvider(Color(0xFF111111)))
        .clickable(actionStartActivity(launchIntent))
    ) {
      Image(
        provider = ImageProvider(fallbackResId),
        contentDescription = null,
        contentScale = ContentScale.FillBounds,
        modifier = GlanceModifier.fillMaxSize()
      )
      Box(modifier = GlanceModifier.fillMaxSize().background(ColorProvider(Color(0x70000000)))) {}

      if (isWide) {
        Row(
          modifier = GlanceModifier.fillMaxSize().padding(8.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          val radiusPx = 20f * density
          val padPx = 6f * density
          val strokePx = 1.25f * density
          val angle = -8f

          val availHdp = (size.height - 16.dp)
          val maxHdp = 128.dp
          val thumbHdp = if (availHdp < maxHdp) availHdp else maxHdp
          val thumbHpx = (thumbHdp.value * density).toInt()

          val thumb = createRotatedRoundedThumbByHeight(
            context = LocalContext.current,
            resId = fallbackResId,
            targetH = thumbHpx,
            cornerRadiusPx = radiusPx,
            angleDeg = angle,
            padPx = padPx,
            strokePx = strokePx,
            strokeColor = 0x66FFFFFF.toInt()
          )

          Image(
            provider = ImageProvider(thumb),
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = GlanceModifier.height(thumbHdp)
          )

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

  @Composable
  private fun MedicationLayout(data: MedicationWidgetData, launchIntent: Intent, isWide: Boolean) {
    val padding = if (isWide) 16.dp else 12.dp
    val zone = data.zoneId
    val now = Instant.now()
    val nextEntry = data.next
    val nextTime = nextEntry.time ?: return
    val hourBefore = nextTime.minus(Duration.ofHours(1))
    val hourAfter = nextTime.plus(Duration.ofHours(1))
    val resetAfter = nextTime.plus(Duration.ofHours(12))

    val state = when {
      data.isConfirmed -> if (data.confirmedAt?.isAfter(hourAfter) == true) DoseState.TAKEN_LATE else DoseState.TAKEN_ON_TIME
      now.isBefore(hourBefore) -> DoseState.WAITING
      now.isBefore(hourAfter) -> DoseState.WINDOW
      now.isBefore(resetAfter) -> DoseState.MISSED
      else -> DoseState.WAITING
    }

    val countdownLabel = when (state) {
      DoseState.WAITING -> "⏳ ${formatCompactDuration(Duration.between(now, nextTime))} nữa"
      DoseState.WINDOW -> if (now.isBefore(nextTime)) "⏰ Còn ${formatCompactDuration(Duration.between(now, nextTime))}" else "⏰ Đến giờ uống!"
      DoseState.MISSED -> "⚠️ Trễ ${formatCompactDuration(Duration.between(hourAfter, now))}"
      DoseState.TAKEN_ON_TIME -> "✅ Đã uống hôm nay"
      DoseState.TAKEN_LATE -> "✅ Đã uống (trễ)"
    }

    val backgroundColor = backgroundColorForState(state)
    val statusColor = statusColorForState(state)
    val indicatorColor = indicatorColorForState(state)
    val dateLabel = formatDateLabel(zone)
    val dueTimeLabel = formatTimeLabel(nextTime, zone)
    val progress = computeProgress(now, nextTime)
    val showButton = !data.isConfirmed && (state == DoseState.WINDOW || state == DoseState.MISSED)

    val primaryMessage = when (state) {
      DoseState.WAITING -> "Liều kế tiếp lúc $dueTimeLabel"
      DoseState.WINDOW -> "Đến giờ uống thuốc!"
      DoseState.MISSED -> "Bạn đã bỏ lỡ liều hôm nay."
      DoseState.TAKEN_ON_TIME -> "Tuyệt vời! Bạn đã hoàn thành liều hôm nay."
      DoseState.TAKEN_LATE -> "Đã ghi nhận liều hôm nay (trễ)."
    }

    val secondaryMessage = when (state) {
      DoseState.WAITING -> nextEntry.note ?: "Chuẩn bị thuốc để uống đúng giờ."
      DoseState.WINDOW -> nextEntry.note ?: "Hãy uống và xác nhận ngay sau khi dùng."
      DoseState.MISSED -> "Bạn vẫn có thể bấm \"Đã uống\" để ghi nhận trễ."
      DoseState.TAKEN_ON_TIME -> data.notes ?: "Giữ vững thói quen nhé!"
      DoseState.TAKEN_LATE -> "Nhớ đặt nhắc nhở để đúng giờ lần sau."
    }

    val entryNote = nextEntry.note
    val customNotes = data.notes
    val upcoming = data.preview.filter { it.iso != nextEntry.iso }

    Column(
      modifier = GlanceModifier
        .fillMaxSize()
        .background(ColorProvider(backgroundColor))
        .clickable(actionStartActivity(launchIntent))
        .padding(padding)
    ) {
      Row(
        modifier = GlanceModifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          text = countdownLabel,
          style = TextStyle(
            color = ColorProvider(Color(0xFF0F172A)),
            fontWeight = FontWeight.Bold,
            fontSize = if (isWide) 18.sp else 16.sp
          ),
          maxLines = 1,
          modifier = GlanceModifier.padding(end = 6.dp)
        )
        Text(
          text = dateLabel,
          style = TextStyle(
            color = ColorProvider(Color(0xFF1F2937)),
            fontWeight = FontWeight.Medium,
            fontSize = 12.sp,
            textAlign = TextAlign.End
          ),
          maxLines = 1,
          modifier = GlanceModifier.fillMaxWidth()
        )
      }

      Text(
        text = "Uống lúc $dueTimeLabel",
        style = TextStyle(
          color = ColorProvider(Color(0xFF1F2937)),
          fontWeight = FontWeight.Medium,
          fontSize = 13.sp
        ),
        maxLines = 1,
        modifier = GlanceModifier.padding(top = 4.dp)
      )

      Row(
        modifier = GlanceModifier
          .fillMaxWidth()
          .padding(top = 8.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        val steps = (progress * 12).roundToInt().coerceIn(0, 12)
        for (index in 0 until 12) {
          val filled = index < steps
          Box(
            modifier = GlanceModifier
              .padding(end = if (index == 11) 0.dp else 2.dp)
              .size(if (isWide) 10.dp else 8.dp)
              .background(ColorProvider(if (filled) indicatorColor else Color(0x33FFFFFF)))
          ) {}
        }
      }

      Text(
        text = primaryMessage,
        style = TextStyle(
          color = ColorProvider(statusColor),
          fontWeight = FontWeight.Bold,
          fontSize = if (isWide) 15.sp else 14.sp
        ),
        maxLines = 2,
        modifier = GlanceModifier.padding(top = 10.dp)
      )

      secondaryMessage?.let {
        Text(
          text = it,
          style = TextStyle(
            color = ColorProvider(Color(0xFF1F2937)),
            fontWeight = FontWeight.Normal,
            fontSize = 12.sp
          ),
          maxLines = 2,
          modifier = GlanceModifier.padding(top = 4.dp)
        )
      }

      entryNote?.takeIf { it.isNotBlank() && it != secondaryMessage }?.let {
        Text(
          text = it,
          style = TextStyle(
            color = ColorProvider(Color(0xFF1E3A8A)),
            fontWeight = FontWeight.Normal,
            fontSize = 12.sp
          ),
          maxLines = 2,
          modifier = GlanceModifier.padding(top = 4.dp)
        )
      }

      customNotes?.let {
        Text(
          text = "Ghi chú: $it",
          style = TextStyle(
            color = ColorProvider(Color(0xFF1E3A8A)),
            fontWeight = FontWeight.Normal,
            fontSize = 12.sp
          ),
          maxLines = if (isWide) 2 else 1,
          modifier = GlanceModifier.padding(top = 4.dp)
        )
      }

      if (showButton) {
        Box(
          contentAlignment = Alignment.Center,
          modifier = GlanceModifier
            .padding(top = 12.dp)
            .fillMaxWidth()
            .height(if (isWide) 42.dp else 38.dp)
            .background(ColorProvider(Color(0xFF2563EB)))
            .clickable(actionRunCallback<ConfirmDoseAction>())
        ) {
          Text(
            text = "Đã uống liều hôm nay",
            style = TextStyle(
              color = ColorProvider(Color.White),
              fontWeight = FontWeight.Bold,
              fontSize = 13.sp
            ),
            maxLines = 1
          )
        }
      } else if (state == DoseState.TAKEN_ON_TIME || state == DoseState.TAKEN_LATE) {
        Text(
          text = if (state == DoseState.TAKEN_LATE) "Đã ghi nhận liều trễ của bạn." else "Thuốc đã được ghi nhận cho hôm nay.",
          style = TextStyle(
            color = ColorProvider(Color(0xFF14532D)),
            fontWeight = FontWeight.Medium,
            fontSize = 12.sp
          ),
          maxLines = 2,
          modifier = GlanceModifier.padding(top = 12.dp)
        )
      }

      if (upcoming.isNotEmpty()) {
        Text(
          text = "Sắp tới:",
          style = TextStyle(
            color = ColorProvider(Color(0xFF1F2937)),
            fontWeight = FontWeight.Medium,
            fontSize = 12.sp
          ),
          maxLines = 1,
          modifier = GlanceModifier.padding(top = 12.dp)
        )

        upcoming.take(if (isWide) 3 else 2).forEach { item ->
          Text(
            text = "• ${item.label}",
            style = TextStyle(
              color = ColorProvider(Color(0xFF1F2937)),
              fontWeight = FontWeight.Normal,
              fontSize = 12.sp
            ),
            maxLines = 1,
            modifier = GlanceModifier.padding(top = 4.dp)
          )
        }
      }

      Text(
        text = "Tổng lịch: ${data.totalSchedules}",
        style = TextStyle(
          color = ColorProvider(Color(0xFF1F2937)),
          fontWeight = FontWeight.Medium,
          fontSize = 11.sp
        ),
        maxLines = 1,
        modifier = GlanceModifier.padding(top = 12.dp)
      )
    }
  }

  private fun loadWidgetContent(context: Context): WidgetContent {
    val prefs = context.widgetPrefs
    val mode = prefs.getString(WidgetStorage.KEY_MODE, WidgetStorage.MODE_BLOG) ?: WidgetStorage.MODE_BLOG

    return when (mode) {
      WidgetStorage.MODE_MEDICATION -> parseMedicationPayload(context, prefs.getString(WidgetStorage.KEY_MEDICATION_JSON, null))
      WidgetStorage.MODE_BLOG -> {
        val title = prefs.getString(WidgetStorage.KEY_BLOG_TITLE, null) ?: DEFAULT_TITLE
        WidgetContent.Blog(title)
      }
      else -> {
        val fallbackTitle = prefs.getString(WidgetStorage.KEY_BLOG_TITLE, null) ?: DEFAULT_TITLE
        WidgetContent.Blog(fallbackTitle)
      }
    }
  }

  private fun parseMedicationPayload(context: Context, raw: String?): WidgetContent {
    if (raw.isNullOrBlank()) return WidgetContent.Empty

    return try {
      val json = JSONObject(raw)
      val regimen = json.optString("regimen").ifBlank { "Lịch nhắc thuốc" }
      val notes = json.optString("notes").takeIf { it.isNotBlank() }?.let { truncateText(it, 90) }
      val total = json.optInt("totalSchedules", 0)
      val timezoneId = json.optString("timezone").takeIf { it.isNotBlank() }
      val zoneId = runCatching { timezoneId?.let { ZoneId.of(it) } ?: ZoneId.systemDefault() }.getOrDefault(ZoneId.systemDefault())

      val previewItems = parsePreviewItems(json.optJSONArray("preview"))
      val now = Instant.now()
      val activeItems = previewItems.filter { entry -> entry.time == null || entry.time!!.isAfter(now.minus(Duration.ofHours(12))) }
      val nextEntry = (activeItems + previewItems).firstOrNull { it.time != null } ?: return WidgetContent.Empty

      val prefs = context.widgetPrefs
      prefs.edit().putString(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO, nextEntry.iso).apply()

      val confirmedIso = prefs.getString(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE, null)
      val confirmedAt = prefs.getString(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT, null)?.let { parseInstant(it) }
      val isConfirmed = confirmedIso != null && confirmedIso == nextEntry.iso

      val displayPreview = buildList {
        add(nextEntry)
        previewItems.filter { it.iso != null && it.iso != nextEntry.iso }.forEach { add(it) }
      }.take(4)

      val totalSchedules = if (total > 0) total else previewItems.size.coerceAtLeast(1)

      val data = MedicationWidgetData(
        regimen = regimen,
        next = nextEntry,
        preview = displayPreview,
        notes = notes,
        totalSchedules = totalSchedules,
        isConfirmed = isConfirmed,
        confirmedAt = confirmedAt,
        zoneId = zoneId
      )

      WidgetContent.Medication(data)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to parse medication payload", e)
      WidgetContent.Empty
    }
  }

  private fun parsePreviewItems(array: JSONArray?): List<PreviewEntry> {
    if (array == null) return emptyList()
    val items = mutableListOf<PreviewEntry>()
    for (i in 0 until array.length()) {
      val obj = array.optJSONObject(i) ?: continue
      val label = obj.optString("label").takeIf { it.isNotBlank() } ?: continue
      val iso = obj.optString("timeISO").takeIf { it.isNotBlank() }
      val time = iso?.let { parseInstant(it) }
      val note = obj.optString("note").takeIf { it.isNotBlank() }
      val pills = obj.optInt("pills", 0)
      items.add(PreviewEntry(label = label, note = note, iso = iso, time = time, pills = pills))
    }
    return items
  }

  private fun truncateText(value: String, max: Int): String {
    if (value.length <= max) return value
    if (max <= 1) return value.first().toString()
    return value.take(max - 1) + "…"
  }

  private fun computeProgress(now: Instant, nextTime: Instant): Float {
    val windowStart = nextTime.minus(Duration.ofHours(12))
    val totalMillis = Duration.between(windowStart, nextTime).toMillis().coerceAtLeast(1)
    val elapsed = when {
      now <= windowStart -> 0L
      now >= nextTime -> totalMillis
      else -> Duration.between(windowStart, now).toMillis()
    }
    return (elapsed.toFloat() / totalMillis.toFloat()).coerceIn(0f, 1f)
  }

  private fun backgroundColorForState(state: DoseState): Color = when (state) {
    DoseState.WAITING -> Color(0xFFE0F2FE)
    DoseState.WINDOW -> Color(0xFFFFEDD5)
    DoseState.MISSED -> Color(0xFFFEE2E2)
    DoseState.TAKEN_ON_TIME -> Color(0xFFDCFCE7)
    DoseState.TAKEN_LATE -> Color(0xFFFDE68A)
  }

  private fun statusColorForState(state: DoseState): Color = when (state) {
    DoseState.WAITING -> Color(0xFF1D4ED8)
    DoseState.WINDOW -> Color(0xFFEA580C)
    DoseState.MISSED -> Color(0xFFB91C1C)
    DoseState.TAKEN_ON_TIME -> Color(0xFF047857)
    DoseState.TAKEN_LATE -> Color(0xFFB45309)
  }

  private fun indicatorColorForState(state: DoseState): Color = when (state) {
    DoseState.WAITING -> Color(0xFF1D4ED8)
    DoseState.WINDOW -> Color(0xFFF97316)
    DoseState.MISSED -> Color(0xFFDC2626)
    DoseState.TAKEN_ON_TIME -> Color(0xFF16A34A)
    DoseState.TAKEN_LATE -> Color(0xFFF59E0B)
  }

  private fun formatCompactDuration(duration: Duration): String {
    val totalMinutes = duration.toMinutes().coerceAtLeast(0)
    val hours = totalMinutes / 60
    val minutes = (totalMinutes % 60).toInt()
    return when {
      hours > 0 && minutes > 0 -> "${hours}h ${minutes}m"
      hours > 0 -> "${hours}h"
      minutes > 0 -> "${minutes}m"
      else -> "vài phút"
    }
  }

  private fun formatDateLabel(zone: ZoneId): String = DATE_FORMAT.format(ZonedDateTime.now(zone))

  private fun formatTimeLabel(instant: Instant, zone: ZoneId): String = TIME_FORMAT.format(ZonedDateTime.ofInstant(instant, zone))

  private fun parseInstant(value: String): Instant? = runCatching { Instant.parse(value) }.getOrNull()

  private sealed interface WidgetContent {
    data class Blog(val title: String) : WidgetContent
    data class Medication(val data: MedicationWidgetData) : WidgetContent
    data object Empty : WidgetContent
  }

  private data class PreviewEntry(
    val label: String,
    val note: String?,
    val iso: String?,
    val time: Instant?,
    val pills: Int
  )

  private data class MedicationWidgetData(
    val regimen: String,
    val next: PreviewEntry,
    val preview: List<PreviewEntry>,
    val notes: String?,
    val totalSchedules: Int,
    val isConfirmed: Boolean,
    val confirmedAt: Instant?,
    val zoneId: ZoneId
  )

  private enum class DoseState {
    WAITING, WINDOW, MISSED, TAKEN_ON_TIME, TAKEN_LATE
  }

  companion object {
    const val DEFAULT_TITLE = "65% người dân ủng hộ hôn nhân đồng giới"
    private val DATE_FORMAT = DateTimeFormatter.ofPattern("EEE - dd/MM", Locale("vi", "VN"))
    private val TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm", Locale("vi", "VN"))
  }
}

class ConfirmDoseAction : ActionCallback {
  override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
    val prefs = context.widgetPrefs
    val activeIso = prefs.getString(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO, null) ?: return

    prefs.edit()
      .putString(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE, activeIso)
      .putString(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT, Instant.now().toString())
      .apply()

    prefs.getString(WidgetStorage.KEY_MEDICATION_JSON, null)?.let {
      WidgetRefreshScheduler.scheduleFromPayload(context, it)
    }

    NewsCardGlanceWidget().update(context, glanceId)
  }
}

/* ====================== Helpers ====================== */

/** Decode drawable (kể cả vector) và fit vào khung outW/outH, giữ alpha. */
private fun decodeDrawableToBitmap(context: Context, resId: Int, outW: Int, outH: Int): Bitmap {
  // Thử vector/drawable trước
  val dr = try { androidx.appcompat.content.res.AppCompatResources.getDrawable(context, resId) } catch (_: Throwable) { null }
  if (dr != null) {
    val bw = outW.coerceAtLeast(1)
    val bh = outH.coerceAtLeast(1)
    val bm = Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888)
    val c = Canvas(bm)
    dr.setBounds(0, 0, bw, bh)
    dr.draw(c)
    return bm
  }

  // Fallback bitmap (PNG/JPG/WebP)
  val r = context.resources
  val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
  BitmapFactory.decodeResource(r, resId, bounds)

  var sample = 1
  while ((bounds.outWidth / sample) > outW * 2 || (bounds.outHeight / sample) > outH * 2) sample *= 2
  val opts = BitmapFactory.Options().apply { inSampleSize = sample }
  val decoded = BitmapFactory.decodeResource(r, resId, opts)

  val scale = min(outW.toFloat() / decoded.width.coerceAtLeast(1), outH.toFloat() / decoded.height.coerceAtLeast(1))
  val sw = max(1, (decoded.width * scale).toInt())
  val sh = max(1, (decoded.height * scale).toInt())
  val scaled = if (sw != decoded.width || sh != decoded.height) Bitmap.createScaledBitmap(decoded, sw, sh, true) else decoded

  val out = Bitmap.createBitmap(outW, outH, Bitmap.Config.ARGB_8888)
  val canvas = Canvas(out)
  canvas.drawARGB(0, 0, 0, 0)
  val left = ((outW - sw) / 2f)
  val top = ((outH - sh) / 2f)
  canvas.drawBitmap(scaled, left, top, null)
  return out
}

/** Center-crop bitmap vào kích thước target. */
private fun centerCropBitmap(src: Bitmap, targetW: Int, targetH: Int): Bitmap {
  if (src.width == targetW && src.height == targetH) return src
  val scale = max(targetW.toFloat() / src.width, targetH.toFloat() / src.height)
  val sw = (src.width * scale).toInt().coerceAtLeast(1)
  val sh = (src.height * scale).toInt().coerceAtLeast(1)
  val scaled = if (sw != src.width || sh != src.height) Bitmap.createScaledBitmap(src, sw, sh, true) else src
  val x = ((sw - targetW) / 2).coerceAtLeast(0)
  val y = ((sh - targetH) / 2).coerceAtLeast(0)
  return Bitmap.createBitmap(scaled, x, y, targetW.coerceAtMost(sw - x), targetH.coerceAtMost(sh - y))
}

/** Bo góc và thêm viền cho bitmap (không xoay). */
private fun makeRoundedFrame(src: Bitmap, radiusPx: Float, strokePx: Float, strokeColor: Int): Bitmap {
  val out = Bitmap.createBitmap(src.width, src.height, Bitmap.Config.ARGB_8888)
  val canvas = Canvas(out)
  val rect = RectF(0f, 0f, src.width.toFloat(), src.height.toFloat())

  // mask bo góc
  val maskPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = android.graphics.Color.WHITE }
  canvas.drawARGB(0, 0, 0, 0)
  canvas.drawRoundRect(rect, radiusPx, radiusPx, maskPaint)

  // áp ảnh bằng SRC_IN
  val imgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { xfermode = PorterDuffXfermode(PorterDuff.Mode.SRC_IN) }
  canvas.drawBitmap(src, 0f, 0f, imgPaint)
  imgPaint.xfermode = null

  // viền mảnh để thấy rõ bo góc
  if (strokePx > 0f) {
    val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply {
      style = Paint.Style.STROKE
      color = strokeColor
      strokeWidth = strokePx
    }
    val inset = strokePx / 2f
    canvas.drawRoundRect(RectF(inset, inset, rect.right - inset, rect.bottom - inset), radiusPx - inset, radiusPx - inset, stroke)
  }
  return out
}

/** Xoay toàn bộ bitmap và thêm padding trong suốt để không bị crop. */
private fun rotateWithPadding(src: Bitmap, angleDeg: Float, padPx: Float): Bitmap {
  val rad = Math.toRadians(angleDeg.toDouble())
  val cosA = abs(cos(rad))
  val sinA = abs(sin(rad))
  val newW = (src.width * cosA + src.height * sinA).toInt()
  val newH = (src.width * sinA + src.height * cosA).toInt()
  val pad = padPx.toInt()

  val out = Bitmap.createBitmap(newW + pad * 2, newH + pad * 2, Bitmap.Config.ARGB_8888)
  val canvas = Canvas(out)
  canvas.drawARGB(0, 0, 0, 0)

  // quay quanh tâm
  val cx = (out.width / 2f)
  val cy = (out.height / 2f)
  canvas.save()
  canvas.translate(cx, cy)
  canvas.rotate(angleDeg)
  canvas.drawBitmap(src, -src.width / 2f, -src.height / 2f, Paint(Paint.ANTI_ALIAS_FLAG))
  canvas.restore()
  return out
}

/**
 * Tạo thumbnail nghiêng NGUYÊN KHUNG:
 * - fit & center-crop ảnh vào kích thước khung
 * - bo góc + viền
 * - xoay cả khung + thêm padding trong suốt
 */
private fun createRotatedRoundedThumb(
  context: Context,
  resId: Int,
  frameW: Int,
  frameH: Int,
  cornerRadiusPx: Float,
  angleDeg: Float,
  padPx: Float,
  strokePx: Float,
  strokeColor: Int
): Bitmap {
  val fitted = decodeDrawableToBitmap(context, resId, frameW, frameH)
  val cropped = centerCropBitmap(fitted, frameW, frameH)
  val framed = makeRoundedFrame(cropped, cornerRadiusPx, strokePx, strokeColor)
  return rotateWithPadding(framed, angleDeg, padPx)
}

/**
 * Decode drawable (kể cả vector) theo CHIỀU CAO, giữ nguyên tỉ lệ.
 */
private fun decodeToHeightKeepAspect(context: Context, resId: Int, targetH: Int): Bitmap {
  val dr = try { androidx.appcompat.content.res.AppCompatResources.getDrawable(context, resId) } catch (_: Throwable) { null }
  if (dr != null) {
    val iw = maxOf(1, dr.intrinsicWidth)
    val ih = maxOf(1, dr.intrinsicHeight)
    val outH = targetH.coerceAtLeast(1)
    val outW = maxOf(1, (iw * (outH.toFloat() / ih)).toInt())
    val bm = Bitmap.createBitmap(outW, outH, Bitmap.Config.ARGB_8888)
    val c = Canvas(bm)
    dr.setBounds(0, 0, outW, outH)
    dr.draw(c)
    return bm
  }

  // raster
  val r = context.resources
  val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
  BitmapFactory.decodeResource(r, resId, bounds)
  var sample = 1
  while ((bounds.outHeight / sample) > targetH * 2) sample *= 2
  val opts = BitmapFactory.Options().apply { inSampleSize = sample }
  val decoded = BitmapFactory.decodeResource(r, resId, opts)

  val scale = targetH.toFloat() / decoded.height.coerceAtLeast(1)
  val outW = maxOf(1, (decoded.width * scale).toInt())
  val outH = maxOf(1, (decoded.height * scale).toInt())
  return if (outW != decoded.width || outH != decoded.height)
    Bitmap.createScaledBitmap(decoded, outW, outH, true) else decoded
}

/**
 * API tạo thumbnail nghiêng NGUYÊN KHUNG theo chiều cao (giữ tỉ lệ)
 */
private fun createRotatedRoundedThumbByHeight(
  context: Context,
  resId: Int,
  targetH: Int,
  cornerRadiusPx: Float,
  angleDeg: Float,
  padPx: Float,
  strokePx: Float,
  strokeColor: Int
): Bitmap {
  val fitted = decodeToHeightKeepAspect(context, resId, targetH)   // giữ tỉ lệ
  val framed = makeRoundedFrame(fitted, cornerRadiusPx, strokePx, strokeColor)
  return rotateWithPadding(framed, angleDeg, padPx)
}

/** Receivers giữ nguyên */
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
