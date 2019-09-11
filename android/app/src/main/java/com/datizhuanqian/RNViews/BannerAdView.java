package com.datizhuanqian.RNViews;

import android.app.Activity;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Choreographer;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.FilterWord;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.datizhuanqian.R;
import com.datizhuanqian.ad.dialog.DislikeDialog;
import com.datizhuanqian.ad.ttad.TToast;
import com.datizhuanqian.ad.ttad.config.TTAdManagerHolder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.List;

public class BannerAdView extends RelativeLayout {
    private String _appid = "5016518";
    private String _codeid = "916518401";
    private int _expectedWidth;
    private int _expectedHeight = 0; //高度0 自适应
    private int screenWidth; //default, 会计算的
    private TTAdNative mTTAdNative;
    protected Activity mContext;
    private static final String TAG = "banner";

    public BannerAdView(Activity context) {
        super(context);
        mContext = context;
        Log.d(TAG, "New BannerAdView: ....");
        inflate(context, R.layout.view_banner, this);
        DisplayMetrics metric = new DisplayMetrics();
        mContext.getWindow().getWindowManager().getDefaultDisplay().getMetrics(metric);
        screenWidth = (int) (metric.widthPixels / metric.density);
        _expectedWidth = screenWidth;
        setupLayoutHack();
    }

    public void setSize(String size) {
        Log.d(TAG,"banner size:" + size);
        switch (size) {
            case "small":
                _expectedWidth = screenWidth / 2;
                break;
            case "middle":
                _expectedWidth = screenWidth * 2 / 3;
                break;
            case "large":
                _expectedWidth = screenWidth;
                break;
        }
        loadAd();
    }

    public void setAppId(String appId) {
        _appid = appId;
    }

    public void setCodeId(String codeId) {
        _codeid = codeId;
    }

    //for fix addView not showing ====
    void setupLayoutHack() {

        Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
            @Override
            public void doFrame(long frameTimeNanos) {
                manuallyLayoutChildren();
                getViewTreeObserver().dispatchOnGlobalLayout();
                Choreographer.getInstance().postFrameCallback(this);
            }
        });
    }

    void manuallyLayoutChildren() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
    }
    //for fix addView not showing ====

    private void loadAd() {
        TTAdManagerHolder.init(mContext, _appid); //内侧 _appid

        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        TTAdManager ttAdManager = TTAdManagerHolder.get();
        mTTAdNative = ttAdManager.createAdNative(mContext);

        loadBannerAd(mContext);
    }

    private void loadBannerAd(final Activity context) {

        final RelativeLayout _bannerView = findViewById(R.id.banner_container);

        //step4:创建广告请求参数AdSlot,具体参数含义参考文档 modules.add(new Interaction(reactContext));

        float expressViewWidth = _expectedWidth;
        Log.d(TAG, "expressViewWidth: "+expressViewWidth);
        float expressViewHeight = _expectedHeight;

        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(_codeid) //广告位id
                .setSupportDeepLink(true)
                .setAdCount(3) //请求广告数量为1到3条
                .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight) //期望模板广告view的size,单位dp,高度0自适应
                .setImageAcceptedSize(640, 320)
                .build();

        //step5:请求广告，对请求回调的广告作渲染处理
        mTTAdNative.loadBannerExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
            @Override
            public void onError(int code, String message) {
                Log.d("错误结果banner", message);
            }


            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {

                Log.d(TAG, "onNativeExpressAdLoad loaded!!!!" + ads.size());

                if (ads == null || ads.size() == 0) {
                    return;
                }
                TTNativeExpressAd mTTAd = ads.get(0);
                mTTAd.setSlideIntervalTime(3 * 1000);
                bindAdListener(mTTAd, context, _bannerView);
                startTime = System.currentTimeMillis();
                mTTAd.render();
            }

        });
    }


    private long startTime = 0;
    private boolean mHasShowDownloadActive = false;


    private void bindAdListener(TTNativeExpressAd ad, final Activity context, RelativeLayout _bannerView) {
        ad.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
            @Override
            public void onAdClicked(View view, int type) {

//                TToast.show(mContext, "广告被点击");
            }

            @Override
            public void onAdShow(View view, int type) {
//                TToast.show(mContext, "广告展示");
            }

            @Override
            public void onRenderFail(View view, String msg, int code) {
                Log.e(TAG, "render fail:" + (System.currentTimeMillis() - startTime));
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                Log.e(TAG, "render suc:" + (System.currentTimeMillis() - startTime));

                context.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {

                        if (!context.isFinishing()) {
                            Log.d(TAG, "activity not finished " + _bannerView.toString());

//                            view.setPadding(0, 0, 0, 0);
//                            view.setMinimumWidth(300);
//                            view.setMinimumHeight(200);
                            _bannerView.addView(view);

                        } else {
                            Log.d("banner", "activity  finished");
                        }
                    }
                });
            }
        });
        //dislike设置
        bindDislike(ad, true, context);
        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
            return;
        }
        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {
//                TToast.show(context, "点击开始下载", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                if (!mHasShowDownloadActive) {
                    mHasShowDownloadActive = true;
                    TToast.show(context, "下载中，点击暂停", Toast.LENGTH_LONG);
                }
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                TToast.show(context, "下载暂停，点击继续", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                TToast.show(context, "下载失败，点击重新下载", Toast.LENGTH_LONG);
            }

            @Override
            public void onInstalled(String fileName, String appName) {
//                TToast.show(context, "安装完成，点击图片打开", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
//                TToast.show(context, "点击安装", Toast.LENGTH_LONG);
            }
        });
    }

    private void bindDislike(TTNativeExpressAd ad, boolean customStyle, final Activity context) {
        if (customStyle) {
            //使用自定义样式
            List<FilterWord> words = ad.getFilterWords();
            if (words == null || words.isEmpty()) {
                return;
            }

            final DislikeDialog dislikeDialog = new DislikeDialog(context, words);
            dislikeDialog.setOnDislikeItemClick(new DislikeDialog.OnDislikeItemClick() {
                @Override
                public void onItemClick(FilterWord filterWord) {
                    //屏蔽广告
                    TToast.show(mContext, "点击 " + filterWord.getName());
                    //用户选择不喜欢原因后，移除广告展示
//                    AdDialog.dismiss();
                }
            });
            ad.setDislikeDialog(dislikeDialog);
            return;
        }
        //使用默认模板中默认dislike弹出样式
        ad.setDislikeCallback(context, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
                TToast.show(mContext, "点击 " + value);
                //用户选择不喜欢原因后，移除广告展示
            }

            @Override
            public void onCancel() {
                TToast.show(mContext, "点击取消 ");
            }
        });
    }

    public void onReceiveNativeEvent() {
        WritableMap event = Arguments.createMap();
        event.putString("message", "MyMessage");
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "topChange", event);
    }
}
