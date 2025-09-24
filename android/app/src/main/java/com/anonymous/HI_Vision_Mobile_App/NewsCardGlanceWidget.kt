package com.anonymous.HI_Vision_Mobile_App

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.*
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.action.ActionParameters
import androidx.glance.action.actionParametersOf
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
import java.time.LocalDate
import java.time.DayOfWeek
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
    val dueTimeLabel = formatTimeLabel(nextTime, zone)
    val showButton = !data.isConfirmed && (state == DoseState.WINDOW || state == DoseState.MISSED)
    val medicineLabel = nextEntry.medicineName ?: "thuốc"

    val primaryMessage = when (state) {
      DoseState.WAITING -> "${medicineLabel.capitalizeWords()} kế tiếp lúc $dueTimeLabel"
      DoseState.WINDOW -> "Đến giờ uống ${medicineLabel}!"
      DoseState.MISSED -> "Bạn đã bỏ lỡ liều ${medicineLabel} hôm nay."
      DoseState.TAKEN_ON_TIME -> "Tuyệt vời! Đã ghi nhận ${medicineLabel} hôm nay."
      DoseState.TAKEN_LATE -> "Đã ghi nhận liều ${medicineLabel} (trễ)."
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
        val confirmedLabel = if (data.isConfirmed) {
          data.confirmedAt?.let { formatTimeLabel(it, zone) } ?: dueTimeLabel
        } else {
          dueTimeLabel
        }
        Text(
          text = if (data.isConfirmed) "Đã xác nhận lúc $confirmedLabel" else "Uống lúc $confirmedLabel",
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

      nextEntry.planName?.takeIf { it.isNotBlank() }?.let { planName ->
        Text(
          text = planName,
          style = TextStyle(
            color = ColorProvider(Color(0xFF1E40AF)),
            fontWeight = FontWeight.Medium,
            fontSize = 12.sp
          ),
          maxLines = 1,
          modifier = GlanceModifier.padding(top = 2.dp)
        )
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
        val confirmParams = actionParametersOf(
          ConfirmDoseAction.DOSE_ISO_PARAM to (nextEntry.iso ?: ""),
        )
        Box(
          contentAlignment = Alignment.Center,
          modifier = GlanceModifier
            .padding(top = 12.dp)
            .fillMaxWidth()
            .height(if (isWide) 42.dp else 38.dp)
            .background(ColorProvider(Color(0xFF2563EB)))
            .clickable(actionRunCallback<ConfirmDoseAction>(confirmParams))
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
      val version = json.optInt("version", 1)
      val timezoneId = json.optString("timezone").takeIf { it.isNotBlank() }
      val zoneId = runCatching { timezoneId?.let { ZoneId.of(it) } ?: ZoneId.systemDefault() }.getOrDefault(ZoneId.systemDefault())

      val previewItems = parsePreviewItems(json.optJSONArray("preview"))
      if (previewItems.isEmpty()) return WidgetContent.Empty

      val now = Instant.now()
      val prefs = context.widgetPrefs

      val nextObj = json.optJSONObject("next")
      val nextIso = nextObj?.optString("timeISO")?.takeIf { it.isNotBlank() }
      val nextEntryFromPreview = nextIso?.let { iso -> previewItems.firstOrNull { it.iso == iso } }

      val candidate = when {
        nextEntryFromPreview != null -> nextEntryFromPreview
        nextIso != null -> {
          val time = parseInstant(nextIso)
          PreviewEntry(
            label = nextObj?.optString("label")?.takeIf { it.isNotBlank() }
              ?: previewItems.first().label,
            note = nextObj?.optString("note")?.takeIf { it.isNotBlank() },
            iso = nextIso,
            time = time,
            pills = nextObj?.optInt("pills", 1) ?: 1,
            planName = nextObj?.optString("planName")?.takeIf { it.isNotBlank() },
            medicineName = nextObj?.optString("medicine")?.takeIf { it.isNotBlank() }
          )
        }
        else -> {
          val active = previewItems.firstOrNull { entry ->
            val entryTime = entry.time
            entryTime != null && entryTime.isAfter(now.minus(Duration.ofHours(12)))
          }
          active ?: previewItems.first()
        }
      }

      val nextEntry = candidate

      nextEntry.iso?.let {
        prefs.edit().putString(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO, it).apply()
      }

      val confirmedIso = prefs.getString(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE, null)
      val confirmedAtPref = prefs.getString(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT, null)?.let { parseInstant(it) }

      val historyMatch = loadConfirmationHistory(prefs).firstOrNull { entry ->
        val entryIso = entry.scheduleIso
        val entryInstant = runCatching { Instant.parse(entryIso) }.getOrNull()
        when {
          entryIso.isBlank() -> false
          nextEntry.iso != null -> entryIso == nextEntry.iso
          nextEntry.time != null && entryInstant != null -> entryInstant == nextEntry.time
          else -> false
        }
      }

      val confirmedIsoInstant = confirmedIso?.let { runCatching { Instant.parse(it) }.getOrNull() }
      val nextIsoInstant = nextEntry.iso?.let { runCatching { Instant.parse(it) }.getOrNull() }

      val keyMatches = when {
        confirmedIsoInstant != null && nextEntry.time != null -> confirmedIsoInstant == nextEntry.time
        confirmedIsoInstant != null && nextIsoInstant != null -> confirmedIsoInstant == nextIsoInstant
        confirmedIso != null && nextEntry.iso != null -> confirmedIso == nextEntry.iso
        else -> false
      }

      val recentConfirmation = when {
        confirmedAtPref != null && nextEntry.time != null ->
          confirmedAtPref.isAfter(nextEntry.time.minus(Duration.ofHours(12)))
        confirmedAtPref != null -> confirmedAtPref.isAfter(Instant.now().minus(Duration.ofHours(12)))
        else -> false
      }

      val isConfirmed = keyMatches || historyMatch != null || recentConfirmation
      val confirmedAt = historyMatch?.confirmedAtIso?.let { parseInstant(it) }
        ?: confirmedAtPref

      val summary = json.optJSONObject("summary")
      val totalSchedules = summary?.optInt("totalUpcoming", previewItems.size)
        ?: json.optInt("totalSchedules", previewItems.size.coerceAtLeast(1))

      val weeklyProgress = parseWeeklyProgress(json.optJSONArray("weeklyProgress"))

      val notes = when {
        nextObj?.optString("note")?.isNotBlank() == true -> nextObj.optString("note")
        else -> json.optString("notes").takeIf { it.isNotBlank() }
      }?.let { truncateText(it, 90) }

      val planName = nextEntry.planName
        ?: nextObj?.optString("planName")?.takeIf { it.isNotBlank() }
        ?: if (version >= 2) "Lịch uống thuốc" else json.optString("regimen").ifBlank { "Lịch nhắc thuốc" }

      val data = MedicationWidgetData(
        planName = planName,
        next = nextEntry,
        preview = previewItems,
        weeklyProgress = weeklyProgress,
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
      val pills = when {
        obj.has("quantity") -> obj.optInt("quantity", 1)
        else -> obj.optInt("pills", 0)
      }
      val planName = obj.optString("planName").takeIf { it.isNotBlank() }
      val medicine = obj.optString("medicine").takeIf { it.isNotBlank() }
      items.add(
        PreviewEntry(
          label = label,
          note = note,
          iso = iso,
          time = time,
          pills = pills,
          planName = planName,
          medicineName = medicine
        )
      )
    }
    return items
  }

  private fun parseWeeklyProgress(array: JSONArray?): List<WeeklyProgressEntry> {
    if (array == null) return emptyList()
    val items = mutableListOf<WeeklyProgressEntry>()
    for (i in 0 until array.length()) {
      val obj = array.optJSONObject(i) ?: continue
      val dateIso = obj.optString("dateISO").takeIf { it.isNotBlank() } ?: continue
      val instant = runCatching { Instant.parse(dateIso) }.getOrNull() ?: continue
      val total = obj.optInt("total", 0)
      val confirmed = obj.optInt("confirmed", 0)
      items.add(WeeklyProgressEntry(instant, total, confirmed))
    }
    return items
  }

  private fun truncateText(value: String, max: Int): String {
    if (value.length <= max) return value
    if (max <= 1) return value.first().toString()
    return value.take(max - 1) + "…"
  }

  private fun String.capitalizeWords(): String {
    if (isBlank()) return this
    val locale = Locale("vi", "VN")
    return trim().split(Regex("\\s+")).joinToString(" ") { part ->
      part.lowercase(locale).replaceFirstChar { ch ->
        if (ch.isLowerCase()) ch.titlecase(locale) else ch.toString()
      }
    }
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

  @Composable
  private fun WeeklyProgressRow(entries: List<WeeklyProgressEntry>, zone: ZoneId) {
    val today = ZonedDateTime.now(zone).toLocalDate()
    Row(
      modifier = GlanceModifier
        .fillMaxWidth()
        .padding(top = 12.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      entries.forEach { entry ->
        val date = ZonedDateTime.ofInstant(entry.date, zone).toLocalDate()
        val label = formatWeekdayLabel(date)
        val isToday = date == today
        val symbol = computePillSymbol(entry)
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = GlanceModifier.padding(horizontal = 3.dp)
        ) {
          Text(
            text = symbol,
            style = TextStyle(
              color = ColorProvider(if (isToday) Color(0xFF15803D) else Color(0xFF4B5563)),
              fontSize = 16.sp,
              fontWeight = FontWeight.Bold,
              textAlign = TextAlign.Center
            ),
            maxLines = 1
          )
          Text(
            text = label,
            style = TextStyle(
              color = ColorProvider(if (isToday) Color(0xFF0F172A) else Color(0xFF4B5563)),
              fontSize = 10.sp,
              fontWeight = if (isToday) FontWeight.Medium else FontWeight.Normal
            ),
            maxLines = 1,
            modifier = GlanceModifier.padding(top = 2.dp)
          )
        }
      }
    }
  }

  private fun computePillSymbol(entry: WeeklyProgressEntry): String {
    if (entry.total <= 0) return "○"
    val ratio = entry.confirmed.toFloat() / entry.total.toFloat()
    return when {
      ratio >= 0.95f -> "●"
      ratio >= 0.75f -> "◕"
      ratio >= 0.5f -> "◑"
      ratio > 0f -> "◔"
      else -> "○"
    }
  }

  private fun formatWeekdayLabel(date: LocalDate): String = when (date.dayOfWeek) {
    DayOfWeek.MONDAY -> "T2"
    DayOfWeek.TUESDAY -> "T3"
    DayOfWeek.WEDNESDAY -> "T4"
    DayOfWeek.THURSDAY -> "T5"
    DayOfWeek.FRIDAY -> "T6"
    DayOfWeek.SATURDAY -> "T7"
    DayOfWeek.SUNDAY -> "CN"
  }

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
    val pills: Int,
    val planName: String?,
    val medicineName: String?
  )

  private data class WeeklyProgressEntry(
    val date: Instant,
    val total: Int,
    val confirmed: Int
  )

  private data class MedicationWidgetData(
    val planName: String,
    val next: PreviewEntry,
    val preview: List<PreviewEntry>,
    val weeklyProgress: List<WeeklyProgressEntry>,
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
    val isoFromParams = parameters[DOSE_ISO_PARAM]?.takeIf { it.isNotBlank() }
    val storedActiveIso = prefs.getString(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO, null)
    val isoToConfirm = isoFromParams ?: storedActiveIso ?: resolveActiveDoseIso(prefs)

    if (isoToConfirm.isNullOrBlank()) {
      Log.w(CONFIRM_LOG_TAG, "Unable to resolve active medication schedule for confirmation")
      return
    }

    val nowIso = Instant.now().toString()

    prefs.edit().also { editor ->
      editor.putString(WidgetStorage.KEY_MEDICATION_CONFIRMED_SCHEDULE, isoToConfirm)
      editor.putString(WidgetStorage.KEY_MEDICATION_CONFIRMED_AT, nowIso)
      if (storedActiveIso != isoToConfirm) {
        editor.putString(WidgetStorage.KEY_MEDICATION_ACTIVE_ISO, isoToConfirm)
      }
    }.apply()

    appendConfirmationHistory(prefs, isoToConfirm, nowIso)

    prefs.getString(WidgetStorage.KEY_MEDICATION_JSON, null)?.let {
      WidgetRefreshScheduler.scheduleFromPayload(context.applicationContext, it)
    }

    val appContext = context.applicationContext
    WidgetRefresher.refresh(appContext)
  }

  companion object {
    private const val CONFIRM_LOG_TAG = "ConfirmDoseAction"
    internal val DOSE_ISO_PARAM = ActionParameters.Key<String>("dose_iso")
  }
}

private fun resolveActiveDoseIso(prefs: SharedPreferences): String? {
  val raw = prefs.getString(WidgetStorage.KEY_MEDICATION_JSON, null) ?: return null
  val json = runCatching { JSONObject(raw) }.getOrNull() ?: return null
  val now = Instant.now()

  val preview = json.optJSONArray("preview")
  if (preview != null && preview.length() > 0) {
    val earlyWindow = Duration.ofHours(2)
    val lateWindow = Duration.ofHours(12)
    var recentIso: String? = null
    var recentInstant: Instant? = null
    var upcomingIso: String? = null
    var upcomingInstant: Instant? = null

    for (index in 0 until preview.length()) {
      val item = preview.optJSONObject(index) ?: continue
      val iso = item.optString("timeISO").takeIf { it.isNotBlank() } ?: continue
      val instant = runCatching { Instant.parse(iso) }.getOrNull() ?: continue

      if (instant.isBefore(now)) {
        val lateDiff = Duration.between(instant, now)
        if (lateDiff <= lateWindow) {
          if (recentInstant == null || instant.isAfter(recentInstant)) {
            recentInstant = instant
            recentIso = iso
          }
        }
      } else {
        val futureDiff = Duration.between(now, instant)
        if (upcomingInstant == null || instant.isBefore(upcomingInstant)) {
          upcomingInstant = instant
          upcomingIso = iso
        }
        if (futureDiff <= earlyWindow) {
          // User can confirm up to ~1 hour early, so prefer the upcoming dose when we're still before it.
          return iso
        }
      }
    }

    if (upcomingIso != null && upcomingInstant != null && now.isBefore(upcomingInstant)) {
      return upcomingIso
    }

    if (recentIso != null) return recentIso
    if (upcomingIso != null) return upcomingIso
  }

  return json.optJSONObject("next")?.optString("timeISO")?.takeIf { it.isNotBlank() }
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
