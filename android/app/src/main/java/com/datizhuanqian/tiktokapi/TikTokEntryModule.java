package com.datizhuanqian.tiktokapi;


import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import com.bytedance.sdk.open.aweme.TikTokConstants;
import com.bytedance.sdk.open.aweme.TikTokOpenApiFactory;
import com.bytedance.sdk.open.aweme.TikTokOpenConfig;
import com.bytedance.sdk.open.aweme.api.TiktokOpenApi;
import com.bytedance.sdk.open.aweme.authorize.model.Authorization;


class TikTokEntryModule extends ReactContextBaseJavaModule {
    TiktokOpenApi bdOpenApi;
    private String mScope = "user_info";
    static Promise promise = null;

    public static final String CODE_KEY = "code";

    public static int targetAppId = TikTokConstants.TARGET_APP.AWEME; // 默认抖音

    private Context mContext;

    TikTokEntryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext.getApplicationContext();

    }

    @Override
    public String getName() {
        return "TikTokEntryModule";
    }


    @ReactMethod
    public void registerApp(String clientkey) { // 向微信注册
        TikTokOpenApiFactory.init(new TikTokOpenConfig(clientkey));
    }

    @ReactMethod
    public void douyinLogin(Promise promise){
        TikTokEntryModule.promise = promise;
        bdOpenApi = TikTokOpenApiFactory.create(mContext, TikTokConstants.TARGET_APP.AWEME);
        targetAppId = TikTokConstants.TARGET_APP.AWEME;
        sendAuth();
    }

    private boolean sendAuth() {
        Authorization.Request request = new Authorization.Request();
        request.scope = mScope;                          // 用户授权时必选权限
        request.state = "ww";                                   // 用于保持请求和回调的状态，授权请求后原样带回给第三方。
        return bdOpenApi.authorize(request);               // 优先使用抖音app进行授权，如果抖音app因版本或者其他原因无法授权，则使用wap页授权

    }

}