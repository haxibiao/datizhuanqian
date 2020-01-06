package com.datizhuanqian.wxapi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.ByteArrayOutputStream;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap.CompressFormat;
import android.net.Uri;
import android.util.Log;

import com.datizhuanqian.R;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMiniProgramObject;
import com.tencent.mm.opensdk.modelmsg.SendAuth;

class WxEntryModule extends ReactContextBaseJavaModule {

    private IWXAPI api;
    static String APP_ID = null;
    static Promise promise = null;
    private Context mContext;

    WxEntryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        api = WXAPIFactory.createWXAPI(reactContext, null);
        this.mContext = reactContext.getApplicationContext();
    }

    @Override
    public String getName() {
        return "WxEntryModule";
    }

    @ReactMethod
    public void registerApp(String APP_ID) { // 向微信注册
        WxEntryModule.APP_ID = APP_ID;
        api.registerApp(APP_ID);
    }

    @ReactMethod
    public void isSupported(Promise promise) { // 判断是否支持调用微信SDK
        boolean isSupported = api.isWXAppInstalled();
        promise.resolve(isSupported);
    }

    @ReactMethod
    public void shareMiniProgram(final ReadableMap info) {

        WXMiniProgramObject miniProgram = new WXMiniProgramObject();
        miniProgram.webpageUrl = info.getString("webpageUrl");
        miniProgram.miniprogramType = info.getInt("miniprogramType");// 正式版:0，测试版:1，体验版:2
        miniProgram.userName = info.getString("userName"); // 小程序原始id
        miniProgram.path = info.getString("path"); // 小程序页面路径
        WXMediaMessage mediaMessage = new WXMediaMessage(miniProgram);
        mediaMessage.title = info.getString("title");// 自定义
        // mediaMessage.description = "分享小程序";//自定义
        Bitmap bitmap = BitmapFactory.decodeResource(mContext.getResources(), R.mipmap.ic_launcher);
        Bitmap sendBitmap = Bitmap.createScaledBitmap(bitmap, 1080, 1080, true);
        bitmap.recycle();
        mediaMessage.thumbData = bmpToByteArray(sendBitmap, true);
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = "";
        req.scene = SendMessageToWX.Req.WXSceneSession;
        req.message = mediaMessage;
        api.sendReq(req);
    }

    // 微信登录页
    @ReactMethod
    private void wxLogin(Promise promise) {

        WxEntryModule.promise = promise;

        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "skit_wx_login";// 这个字段可以任意更改
        api.sendReq(req);

    }

    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    public static byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(CompressFormat.PNG, 100, output);
        if (needRecycle) {
            bmp.recycle();
        }

        byte[] result = output.toByteArray();
        try {
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

}