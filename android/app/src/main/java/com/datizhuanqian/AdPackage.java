package com.datizhuanqian;

import android.app.Activity;

import com.datizhuanqian.RNViews.BannerAdManager;
import com.datizhuanqian.ad.Banner;
import com.datizhuanqian.ad.FullScreenVideo;
import com.datizhuanqian.ad.RewardDialog;
import com.datizhuanqian.ad.RewardVideo;
import com.datizhuanqian.ad.Splash;
import com.datizhuanqian.ad.WithdrawBanner;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AdPackage implements ReactPackage {

    @Override
    public List createNativeModules(ReactApplicationContext reactContext) {
        List modules = new ArrayList<>();
        modules.add(new RewardVideo(reactContext));
        modules.add(new FullScreenVideo(reactContext));
        modules.add(new Banner(reactContext));
        modules.add(new Splash(reactContext));
        modules.add(new WithdrawBanner(reactContext));
        modules.add(new RewardDialog(reactContext));
        return modules;
    }


    @Override
    public  List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new BannerAdManager(reactContext.getCurrentActivity())
        );
    }
}