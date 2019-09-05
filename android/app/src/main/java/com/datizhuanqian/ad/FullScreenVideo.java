package com.datizhuanqian.ad;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTFullScreenVideoAd;
import com.datizhuanqian.MainApplication;
import com.datizhuanqian.ad.ttad.TToast;
import com.datizhuanqian.ad.ttad.config.TTAdManagerHolder;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;


/**
 * Created by bytedance on 2018/2/1.
 */

public class FullScreenVideo extends ReactContextBaseJavaModule {

//    private TTAdNative mTTAdNative;
//    private TTFullScreenVideoAd mttFullVideoAd;

    protected Context mContext;

    public FullScreenVideo(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;

        // 保存reactConext到application
        MainApplication.reactContext = reactContext;
    }


    @Override
    public String getName() {
        return "FullScreenVideo";
    }

    @ReactMethod
    public void loadAd(ReadableMap options, final Promise promise) {

        final Activity _this = getCurrentActivity();
        String tt_appid = options.hasKey("tt_appid") ? options.getString("tt_appid") : "5016518";
        TTAdManagerHolder.init(_this, tt_appid);

        // step1:初始化sdk
        TTAdManager ttAdManager = TTAdManagerHolder.get();

        // step2:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        TTAdManagerHolder.get().requestPermissionIfNecessary(mContext);

        // step3:创建TTAdNative对象,用于调用广告请求接口
        MainApplication.mTTAdNative = ttAdManager.createAdNative(mContext);


        _this.runOnUiThread(() -> {
            // 加载广告
            loadAdSlot(options, TTAdConstant.VERTICAL,_this, promise);
        });
    }


    private void loadAdSlot(ReadableMap options, int orientation , final Activity _this, final Promise promise) {
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        String tt_codeid = options.hasKey("tt_codeid") ? options.getString("tt_codeid") : "916518198";
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(tt_codeid)
                .setSupportDeepLink(true)
                .setImageAcceptedSize(1080, 1920)
                .setOrientation(orientation)//必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                .build();
        //step5:请求广告
        MainApplication.mTTAdNative.loadFullScreenVideoAd(adSlot, new TTAdNative.FullScreenVideoAdListener() {
            @Override
            public void onError(int code, String message) {
                TToast.show(_this, message);

            }

            @Override
            public void onFullScreenVideoCached() {

//                TToast.show(_this, "视频已缓存");
            }

            @Override
            public void onFullScreenVideoAdLoad(TTFullScreenVideoAd ad) {
//                TToast.show(_this, "全屏广告加载好了");

                MainApplication.fullAd=ad;
                if (promise != null) {
                    promise.resolve(true);
                }
            }
        });
    }

    @ReactMethod
    public void startAd(ReadableMap options,final Promise promise) {

        // 每次启动可以重新加载不同的视频
        if (options != null) {
            loadAd(options, null);
        }

        Intent intent = new Intent(mContext, FullScreenActivity.class);
        getCurrentActivity().startActivityForResult(intent, 10000);

        String result = null;
        try {
            result = MainApplication.myBlockingQueue.take();
            Log.e("reward 结果", result);
            promise.resolve(result);
        } catch (InterruptedException e) {
            Log.e("reward 结果", "结果出错了");
            e.printStackTrace();
            promise.reject("START_AD_ERROR", e.toString());
        }
    }



}
