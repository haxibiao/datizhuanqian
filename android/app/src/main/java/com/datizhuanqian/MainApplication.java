package com.datizhuanqian;


import com.haxibiao.ad.AdPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import cn.jpush.reactnativejpush.JPushPackage;
import cn.jpush.android.api.JPushInterface;


import com.haxibiao.toolkits.ToolkitsPackage;

import com.bytedance.sdk.open.aweme.TikTokOpenApiFactory;
import com.bytedance.sdk.open.aweme.TikTokOpenConfig;

// import com.datizhuanqian.wxapi.WxEntryPackage;
import com.datizhuanqian.tiktokapi.TikTokEntryPackage;
import com.datizhuanqian.alipayapi.AlipayEntryPackage;
import com.haxibiao.reactnativematomo.MatomoPackage;

import java.util.List;

import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

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
            packages.add(new AdPackage());
            // packages.add(new WxEntryPackage());
            packages.add(new ToolkitsPackage());
            packages.add(new TikTokEntryPackage());
            packages.add(new AlipayEntryPackage());
            packages.add(new MatomoPackage());
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
        String clientkey = "awutk5784jtmdygh"; // 需要到开发者网站申请并替换
        TikTokOpenApiFactory.init(new TikTokOpenConfig(clientkey));
    }
}
