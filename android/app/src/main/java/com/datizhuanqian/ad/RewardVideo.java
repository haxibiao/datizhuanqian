package com.datizhuanqian.ad;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import androidx.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.datizhuanqian.MainApplication;
import com.datizhuanqian.ad.ttad.TToast;
import com.datizhuanqian.ad.ttad.config.TTAdManagerHolder;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.datizhuanqian.ad.RewardActivity;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RewardVideo extends ReactContextBaseJavaModule {

    protected Context mContext;

    public RewardVideo(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;

        // 保存reactConext到application
        MainApplication.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RewardVideo";
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
            loadAdSlot(options, TTAdConstant.VERTICAL, _this, promise);
        });
    }

    private void loadAdSlot(ReadableMap options, int orientation, final Activity _this, final Promise promise) {
        String tt_codeid = options.hasKey("tt_codeid") ? options.getString("tt_codeid") : "916518846";
        // step4:创建广告请求参数AdSlot,具体参数含义参考文档
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(tt_codeid)
                .setSupportDeepLink(true)
                .setImageAcceptedSize(1080, 1920).setRewardName(options.getString("rewardname")) // 奖励的名称
                .setRewardAmount(options.getInt("rewardamount")) // 奖励的数量
                .setUserID(options.getInt("uid") + "")// 用户id,必传参数
                .setMediaExtra("media_extra") // 附加参数，可选
                .setOrientation(orientation) // 必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                .build();

        // step5:请求广告
        MainApplication.mTTAdNative.loadRewardVideoAd(adSlot, new TTAdNative.RewardVideoAdListener() {
            @Override
            public void onError(int code, String message) {
                TToast.show(_this, message);
                if (promise != null)
                    promise.resolve(false);
            }

            // 视频广告加载后，视频资源缓存到本地的回调，在此回调后，播放本地视频，流畅不阻塞。
            @Override
            public void onRewardVideoCached() {
                TToast.show(_this, "奖励视频加载缓存成功");
                sendEvent("VideoCached", null);
            }

            // 视频广告的素材加载完毕，比如视频url等，在此回调后，可以播放在线视频，网络不好可能出现加载缓冲，影响体验。
            @Override
            public void onRewardVideoAdLoad(TTRewardVideoAd ad) {
                TToast.show(_this, "奖励广告加载好了");
                sendEvent("AdLoaded", null);
                MainApplication.ad = ad;
                if (promise != null) {
                    promise.resolve(true);
                }

                // 加载好了之后自动播放广告
                // startAd(null, null);
            }
        });
    }

    @ReactMethod
    public void startAd(ReadableMap options, final Promise promise) {

        // 每次启动可以重新加载不同的视频
        if (options != null) {
            loadAd(options, null);
        }

        Intent intent = new Intent(mContext, RewardActivity.class);
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

    // TODO: 事件返回给前端，具体做什么反应先不确定
    public static void sendEvent(String eventName, @Nullable WritableMap params) {
        MainApplication.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("RewardVideo-" + eventName, params);
    }
}
