package com.datizhuanqian.ad;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Point;
import androidx.annotation.Nullable;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.FilterWord;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdManager;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTBannerAd;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.datizhuanqian.ad.dialog.DislikeDialog;

import com.datizhuanqian.MainApplication;
import com.datizhuanqian.R;
import com.datizhuanqian.ad.ttad.TToast;
import com.datizhuanqian.ad.ttad.config.TTAdManagerHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;


public class WithdrawBanner extends ReactContextBaseJavaModule {

    private TTAdNative mTTAdNative;
    private FrameLayout mBannerContainer;
    private TTAdDislike mTTAdDislike;
    private Button mButtonClose;
    private Button mButtonGoTask;
    private static Dialog AdDialog;
    private static WeakReference<Activity> mActivity;
    private List<TTNativeExpressAd>  mTTAdList;

    private View view ;
    protected Context mContext;


    Point point = new Point();


    @Override
    public String getName() {
        return "WithdrawBanner";
    }


    public WithdrawBanner(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        // 保存reactConext到application
        MainApplication.reactContext = reactContext;
    }


    @ReactMethod
    protected void loadAd(ReadableMap options) {
        final Activity _this = getCurrentActivity();


        TTAdManagerHolder.init(_this,options.getString("tt_appid"));
        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        TTAdManager ttAdManager = TTAdManagerHolder.get();
        mTTAdNative =ttAdManager.createAdNative(_this);
        //step3:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        TTAdManagerHolder.get().requestPermissionIfNecessary(mContext);
        mTTAdList = new ArrayList<>();
        loadBannerAd(options, _this);
    }


    private final View.OnClickListener mClickListener = new Button.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (v.getId() == R.id.btn_withdraw_banner_close) {

                AdDialog.dismiss();
                sendEvent("CloseAd", null);

            } else if (v.getId() == R.id.btn_withdraw_banner_go_task) {

                AdDialog.dismiss();
                sendEvent("GoTask", null);
            }

        }
    };


    private void loadBannerAd(ReadableMap options,final Activity _this) {
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档 modules.add(new Interaction(reactContext));
        DisplayMetrics metric = new DisplayMetrics();
        _this.getWindow().getWindowManager().getDefaultDisplay().getMetrics(metric);

//        int width = metric.widthPixels;     // 屏幕宽度（像素）  
//        int height = metric.heightPixels;   // 屏幕高度（像素）  
//        float density = metric.density;      // 屏幕密度（0.75 / 1.0 / 1.5）  
//        int densityDpi = metric.densityDpi;  // 屏幕密度DPI（120 / 160 / 240） 

        int screenWidth = (int) (metric.widthPixels / metric.density);

        float expressViewWidth =  screenWidth*3/4;
        float expressViewHeight = 0;

        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(options.getString("tt_codeid")) //广告位id
                .setSupportDeepLink(true)
                .setAdCount(3) //请求广告数量为1到3条
                .setExpressViewAcceptedSize(expressViewWidth,expressViewHeight) //期望模板广告view的size,单位dp
                .setImageAcceptedSize(640,100)
                .build();
        //step5:请求广告，对请求回调的广告作渲染处理
        mTTAdNative.loadBannerExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {

            @Override
            public void onError(int code, String message) {
//                TToast.show(_this, "load error : " + code + ", " + message);
                Log.println(Log.ERROR,"错误结果",message);
            }


            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
                if (ads == null || ads.size() == 0){
                    return;
                }
                TTNativeExpressAd mTTAd = ads.get(0);
                mTTAdList.add(mTTAd);
                mTTAd.setSlideIntervalTime(30*1000);
                bindAdListener(mTTAd,_this);
                startTime = System.currentTimeMillis();
                mTTAd.render();
            }

        });
    }


    private long startTime = 0;
    private boolean mHasShowDownloadActive = false;


    private void bindAdListener(TTNativeExpressAd ad,final Activity _this) {


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
//                Log.e("ExpressView","render fail:"+(System.currentTimeMillis() - startTime));
//                TToast.show(mContext, msg+" code:"+code);
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                Log.e("ExpressView", "render suc:" + (System.currentTimeMillis() - startTime));
                //返回view的宽高 单位 dp
//                TToast.show(mContext, "渲染成功");
                mActivity = new WeakReference<Activity>(_this);

                _this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (!_this.isFinishing()) {
                            AdDialog = new Dialog(_this,R.style.SelfDialog);

                            AdDialog.setContentView(R.layout.activity_withdraw_banner);

                            Display display = _this.getWindow().getWindowManager().getDefaultDisplay();
                            Point point = new Point();
                            display.getSize(point);

                            Log.d("width",""+point.x);
                            Log.d("height",""+point.y);

                            WindowManager.LayoutParams params = AdDialog.getWindow().getAttributes();

                            params.width = point.x*3/4;
                            params.height =  point.x*3/4 *4/5;


                            view.setPadding(10,10,10,0);

                            AdDialog.addContentView(view,new RelativeLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT , FrameLayout.LayoutParams.WRAP_CONTENT));

                            mButtonClose=AdDialog.findViewById(R.id.btn_withdraw_banner_close);
                            mButtonGoTask=AdDialog.findViewById(R.id.btn_withdraw_banner_go_task);
                            mButtonClose.setOnClickListener(mClickListener);
                            mButtonGoTask.setOnClickListener(mClickListener);

                            AdDialog.setCancelable(false);

                            if (!AdDialog.isShowing()) {
                                AdDialog.show();
                                AdDialog.getWindow().setAttributes(params);
                            }
                        }
                    }
                });
            }
        });
        //dislike设置
        bindDislike(ad, false,_this);
        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD){
            return;
        }
        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {

//                TToast.show(_this, "点击开始下载", Toast.LENGTH_LONG);

            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                if (!mHasShowDownloadActive) {
                    mHasShowDownloadActive = true;
                    TToast.show(_this, "下载中，点击暂停", Toast.LENGTH_LONG);
                }
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                TToast.show(_this ,"下载暂停，点击继续", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                TToast.show(_this, "下载失败，点击重新下载", Toast.LENGTH_LONG);
            }

            @Override
            public void onInstalled(String fileName, String appName) {
//                TToast.show(_this, "安装完成，点击图片打开", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
//                TToast.show(_this, "点击安装", Toast.LENGTH_LONG);
            }
        });
    }

    private void bindDislike(TTNativeExpressAd ad, boolean customStyle,final Activity _this) {
        if (customStyle) {
            //使用自定义样式
            List<FilterWord> words = ad.getFilterWords();
            if (words == null || words.isEmpty()) {
                return;
            }

            final DislikeDialog dislikeDialog = new DislikeDialog(_this, words);
            dislikeDialog.setOnDislikeItemClick(new DislikeDialog.OnDislikeItemClick() {
                @Override
                public void onItemClick(FilterWord filterWord) {
                    //屏蔽广告
//                    TToast.show(mContext, "点击 " + filterWord.getName());
                    //用户选择不喜欢原因后，移除广告展示
                    AdDialog.dismiss();
                }
            });
            ad.setDislikeDialog(dislikeDialog);
            return;
        }
        //使用默认模板中默认dislike弹出样式
        ad.setDislikeCallback(_this, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
//                TToast.show(mContext, "点击 " + value);
                //用户选择不喜欢原因后，移除广告展示
                AdDialog.dismiss();
            }

            @Override
            public void onCancel() {

//                TToast.show(mContext, "点击取消 ");
            }
        });
    }

    public static void sendEvent(String eventName, @Nullable WritableMap params) {
        MainApplication.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("BannerAd-" + eventName, params);
    }
}
