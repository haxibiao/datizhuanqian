package com.datizhuanqian.RNViews;


import android.app.Activity;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class BannerAdManager extends ViewGroupManager<BannerAdView> {
    protected Activity mContext;
    public static final String REACT_CLASS = "BannerAd";

    public BannerAdManager(Activity context) {
        mContext = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public BannerAdView createViewInstance(ThemedReactContext context) {
        return new BannerAdView(mContext);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @ReactProp(name = "appid")
    public void setAppId(BannerAdView view, @Nullable String appid) {
        view.setAppId(appid);
    }

    @ReactProp(name = "codeid")
    public void setCodeId(BannerAdView view, @Nullable String codeid) {
        view.setCodeId(codeid);
    }

    @ReactProp(name = "size")
    public void setSize(BannerAdView view, @Nullable String size) {
        view.setSize(size);
    }
}
