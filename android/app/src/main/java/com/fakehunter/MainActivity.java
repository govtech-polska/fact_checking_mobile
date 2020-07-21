package com.fakehunter;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.annotation.Nullable;

public class MainActivity extends ReactActivity {

  public static String TAG = "FH_LOG";

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    handleIncomingIntent(getIntent());
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    handleIncomingIntent(intent);
    setIntent(intent);
  }

  private void handleIncomingIntent(Intent intent) {
    try {
      if (intent == null) return;
      String action = intent.getAction();
      Log.d(TAG, "handleIncomingIntent: ");
      Log.d(TAG, action);
      Log.d(TAG, intent.getExtras().toString());
      if (action.equalsIgnoreCase(Intent.ACTION_SEND) && intent.hasExtra(Intent.EXTRA_TEXT)) {
        String s = intent.getStringExtra(Intent.EXTRA_TEXT);
        Log.d(TAG, "handleIncomingIntent: ");
        Log.d(TAG, s);
        try {
          WritableMap map = Arguments.createMap();
          map.putString("url", s);
          ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext()
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("shareUrl", map);
          ((MainApplication) getApplication()).setShareUrl(s);
        } catch (Exception e) {
          ((MainApplication) getApplication()).setShareUrl(s);
        }
      }
    } catch (Exception e) {
      Log.d(TAG, e.getMessage());
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FakeHunter";
  }
}
