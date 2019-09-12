package com.datizhuanqian;

import android.app.Application;

import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.bytedance.sdk.openadsdk.TTFullScreenVideoAd;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import cn.jpush.reactnativejpush.JPushPackage;
import cn.jpush.android.api.JPushInterface;

import com.haxibiao.toolkits.UploaderModule;
import com.haxibiao.toolkits.DownloadApk;
import com.haxibiao.share.NativeSharePackage;
import com.haxibiao.toolkits.ToolkitsPackage;

import com.datizhuanqian.ad.TtAdvertPackage;
import com.datizhuanqian.wxapi.WxEntryPackage;

import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;

import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    public static TTAdNative mTTAdNative;
    public static ReactApplicationContext reactContext;
    public static TTRewardVideoAd ad = null;
    public static TTFullScreenVideoAd fullAd = null;
    public static ArrayBlockingQueue<String> myBlockingQueue = new ArrayBlockingQueue<String>(1);

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }


        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            packages.add(new JPushPackage(true, true));

            packages.add(new NativeSharePackage());
            packages.add(new TtAdvertPackage());
            packages.add(new WxEntryPackage());
            packages.add(new ToolkitsPackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        JPushInterface.init(this);
    }
}
