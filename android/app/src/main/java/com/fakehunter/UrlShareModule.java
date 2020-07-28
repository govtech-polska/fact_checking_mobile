package com.fakehunter;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class UrlShareModule extends ReactContextBaseJavaModule {

    private static final String URL_ACTION_ID = "shareUrl";
    private static final String NAME = "UrlShareModule";

    private ReactContext mReactContext;

    public UrlShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void getShareUrl() {
        if (mReactContext.getApplicationContext() instanceof MainApplication) {
            String url = ((MainApplication) mReactContext.getApplicationContext()).getShareUrl();
            if (url != null) {
                WritableMap map = Arguments.createMap();
                map.putString("url", url);
                sendEvent(mReactContext, URL_ACTION_ID, map);
            }
        }
    }

    @ReactMethod
    private void clearActionUrl() {
        if (mReactContext.getApplicationContext() instanceof MainApplication) {
            ((MainApplication) mReactContext.getApplicationContext()).setShareUrl(null);
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
