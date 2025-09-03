package com.anonymous.HI_Vision_Mobile_App

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context

class MySmallWidget : AppWidgetProvider() {
  override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
    super.onUpdate(context, appWidgetManager, appWidgetIds)
    MyFirstWidget.updateAllFixed(
      context,
      MySmallWidget::class.java,
      R.layout.widget_news_card_compact,
      MyFirstWidget.DEFAULT_TITLE,
      MyFirstWidget.DEFAULT_IMAGE
    )
  }

  companion object {
    fun updateAll(context: Context, title: String?, imageUrl: String?) {
      MyFirstWidget.updateAllFixed(
        context,
        MySmallWidget::class.java,
        R.layout.widget_news_card_compact,
        title,
        imageUrl
      )
    }
  }
}

