package com.anonymous.HI_Vision_Mobile_App

import android.content.Context
import android.content.SharedPreferences

object WidgetStorage {
  const val PREFS_NAME = "widget_bridge"
  const val KEY_MODE = "mode"
  const val KEY_BLOG_TITLE = "blog_title"
  const val KEY_BLOG_IMAGE = "blog_image"
  const val KEY_MEDICATION_JSON = "medication_json"
  const val KEY_MEDICATION_CONFIRMED_SCHEDULE = "medication_confirmed_schedule"
  const val KEY_MEDICATION_CONFIRMED_AT = "medication_confirmed_at"
  const val KEY_MEDICATION_ACTIVE_ISO = "medication_active_iso"
  const val MODE_BLOG = "blog"
  const val MODE_MEDICATION = "medication"
}

val Context.widgetPrefs: SharedPreferences
  get() = getSharedPreferences(WidgetStorage.PREFS_NAME, Context.MODE_PRIVATE)
