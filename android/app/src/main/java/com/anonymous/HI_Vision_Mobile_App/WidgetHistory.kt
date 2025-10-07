package com.anonymous.HI_Vision_Mobile_App

import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

private const val HISTORY_LIMIT = 120

data class MedicationConfirmationEntry(
  val scheduleIso: String,
  val confirmedAtIso: String
)

fun appendConfirmationHistory(
  prefs: SharedPreferences,
  scheduleIso: String,
  confirmedAtIso: String
) {
  if (scheduleIso.isBlank()) return

  val confirmationIso = confirmedAtIso.ifBlank { scheduleIso }
  val existing = loadConfirmationHistory(prefs)
  val merged = ArrayList<MedicationConfirmationEntry>(minOf(existing.size + 1, HISTORY_LIMIT))
  merged.add(MedicationConfirmationEntry(scheduleIso, confirmationIso))

  for (entry in existing) {
    if (entry.scheduleIso == scheduleIso) continue
    merged.add(entry)
    if (merged.size >= HISTORY_LIMIT) break
  }

  saveConfirmationHistory(prefs, merged)
}

fun loadConfirmationHistory(prefs: SharedPreferences): List<MedicationConfirmationEntry> {
  val raw = prefs.getString(WidgetStorage.KEY_MEDICATION_HISTORY, null) ?: return emptyList()
  val array = runCatching { JSONArray(raw) }.getOrNull() ?: return emptyList()
  if (array.length() == 0) return emptyList()

  val result = mutableListOf<MedicationConfirmationEntry>()
  for (index in 0 until array.length()) {
    val obj = array.optJSONObject(index) ?: continue
    val scheduleIso = obj.optString("scheduleISO")
    if (scheduleIso.isNullOrBlank()) continue
    val confirmedIso = obj.optString("confirmedAt").takeIf { !it.isNullOrBlank() } ?: scheduleIso
    result.add(MedicationConfirmationEntry(scheduleIso, confirmedIso))
  }
  return result
}

fun saveConfirmationHistory(
  prefs: SharedPreferences,
  entries: List<MedicationConfirmationEntry>
) {
  if (entries.isEmpty()) {
    prefs.edit().remove(WidgetStorage.KEY_MEDICATION_HISTORY).apply()
    return
  }

  val array = JSONArray()
  entries.forEach { entry ->
    val obj = JSONObject()
    obj.put("scheduleISO", entry.scheduleIso)
    obj.put("confirmedAt", entry.confirmedAtIso)
    array.put(obj)
  }

  prefs.edit().putString(WidgetStorage.KEY_MEDICATION_HISTORY, array.toString()).apply()
}

fun clearConfirmationHistory(prefs: SharedPreferences) {
  prefs.edit().remove(WidgetStorage.KEY_MEDICATION_HISTORY).apply()
}
