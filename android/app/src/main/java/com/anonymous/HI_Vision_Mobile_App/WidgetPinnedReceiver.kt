package com.anonymous.HI_Vision_Mobile_App

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast

class WidgetPinnedReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    Toast.makeText(context, "Widget đã được thêm vào màn hình chính", Toast.LENGTH_SHORT).show()
  }
}
