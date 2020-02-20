package com.datizhuanqian.alipayapi;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.app.OpenAuthTask;
import com.alipay.sdk.app.PayTask;

import com.datizhuanqian.R;

class AlipayEntryModule extends ReactContextBaseJavaModule {

    private String mScope = "user_info";
    static Promise promise = null;

    public static final String CODE_KEY = "code";

    private Context mContext;

    AlipayEntryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext.getApplicationContext();

    }

    @Override
    public String getName() {
        return "AlipayEntryModule";
    }

    final OpenAuthTask.Callback openAuthCallback = new OpenAuthTask.Callback() {
        @Override
        public void onResult(int i, String s, Bundle bundle) {
            if (bundle == null) {
                AlipayEntryModule.promise.reject("授权失败，请检查是否更新登录或未关闭支付保护");
            } else {
                String code = bundle.getString("auth_code");
                AlipayEntryModule.promise.resolve(code);
            }
        }
    };

    private static String bundleToString(Bundle bundle) {
        if (bundle == null) {
            return "null";
        }

        final StringBuilder sb = new StringBuilder();
        for (String key : bundle.keySet()) {
            sb.append(key).append("=>").append(bundle.get(key)).append("\n");
        }
        return sb.toString();
    }

    @ReactMethod
    public void AlipayAuth(Promise promise) {
        AlipayEntryModule.promise = promise;

        // 传递给支付宝应用的业务参数
        final Map<String, String> bizParams = new HashMap<>();
        bizParams.put("url",
                "https://authweb.alipay.com/auth?auth_type=PURE_OAUTH_SDK&app_id=2019112969489742&scope=auth_user&state=init");

        // 支付宝回跳到你的应用时使用的 Intent Scheme。请设置为不和其它应用冲突的值。
        // 如果不设置，将无法使用 H5 中间页的方法(OpenAuthTask.execute() 的最后一个参数)回跳至
        // 你的应用。
        //
        // 参见 AndroidManifest 中 <AlipayResultActivity> 的 android:scheme，此两处
        // 必须设置为相同的值。
        final String scheme = "dtzq";
        final Activity _this = getCurrentActivity();
        // 唤起授权业务
        final OpenAuthTask task = new OpenAuthTask(_this);
        task.execute(scheme, // Intent Scheme
                OpenAuthTask.BizType.AccountAuth, // 业务类型
                bizParams, // 业务参数
                openAuthCallback, // 业务结果回调。注意：此回调必须被你的应用保持强引用
                false); // 是否需要在用户未安装支付宝 App 时，使用 H5 中间页中转
    }

}