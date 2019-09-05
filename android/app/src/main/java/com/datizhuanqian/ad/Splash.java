package com.datizhuanqian.ad;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/**
 * 开屏广告Activity示例
 */
public class Splash extends ReactContextBaseJavaModule{

    protected Context mContext;

    @Override
    public String getName() {
        return "Splash";
    }

    public Splash(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }


    @ReactMethod
    public void loadSplashAd(ReadableMap options) {
        final Activity _this = getCurrentActivity();

        Intent intent = new Intent(mContext, SplashActivity.class);
        try {
            String tt_appid = options.hasKey("tt_appid") ? options.getString("tt_appid") : "5016518";
            String tt_codeid = options.hasKey("tt_codeid") ? options.getString("tt_codeid") : "816518857";
            intent.putExtra("appid",tt_appid);
            intent.putExtra("codeid",tt_codeid);
            getCurrentActivity().startActivityForResult(intent, 10000);
            getCurrentActivity().overridePendingTransition(0,0);
        }catch (Exception e) {
            e.printStackTrace();
        }

    }

}
