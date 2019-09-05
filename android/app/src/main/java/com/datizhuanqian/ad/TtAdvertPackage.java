package com.datizhuanqian.ad;

import com.datizhuanqian.ad.RewardVideo;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TtAdvertPackage implements ReactPackage {

    @Override
    public List createNativeModules(ReactApplicationContext reactContext) {
        List modules = new ArrayList<>();
        modules.add(new RewardVideo(reactContext));
        modules.add(new FullScreenVideo(reactContext));
        modules.add(new Banner(reactContext));
        modules.add(new Splash(reactContext));
        modules.add(new WithdrawBanner(reactContext));
        return modules;
    }




    @Override
    public List createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}