package com.datizhuanqian.ad;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.bytedance.sdk.openadsdk.TTFullScreenVideoAd;
import com.datizhuanqian.MainApplication;
import com.datizhuanqian.R;
import com.datizhuanqian.ad.ttad.TToast;
import com.datizhuanqian.ad.ttad.config.TTAdManagerHolder;

import static com.datizhuanqian.ad.RewardVideo.sendEvent;

public class FullScreenActivity extends Activity implements IFullScreenActivity {

    public boolean mVideoIsPlayed = false;
    public boolean mAdIsClicked = false;
    public boolean mApkIsInstalled = false;
    public boolean mVerifyStatus = false;

    public boolean getVideoIsPlayed() {
        return mVideoIsPlayed;
    }

    public void setVideoIsPlayed(boolean isPlayed) {
        mVideoIsPlayed = isPlayed;
    }

    public boolean getAdIsClicked() {
        return mAdIsClicked;
    }

    public void setAdIsClicked(boolean isClicked) {
        mAdIsClicked = isClicked;
    }

    public boolean getApkIsInstalled() {
        return mApkIsInstalled;
    }

    public void setApkIsInstalled(boolean isApkDownload) {
        mApkIsInstalled = isApkDownload;
    }

    public boolean getVerifyStatus() {
        return mVerifyStatus;
    }

    public void setVerifyStatus(boolean isVerify) {
        mVerifyStatus = isVerify;
    }

    public void returnResult() {
        Intent returnIntent = new Intent();
        returnIntent.putExtra("video_play", this.getVideoIsPlayed());
        returnIntent.putExtra("ad_click", this.getAdIsClicked());
        returnIntent.putExtra("apk_install", this.getApkIsInstalled());
        returnIntent.putExtra("verify_status", this.getVerifyStatus());
        this.setResult(Activity.RESULT_OK, returnIntent);
        Log.e("全屏视频广告", "返回了");
        this.finish();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.video);

        showAd();
    }

    private void showAd() {

        TTFullScreenVideoAd fullAd = MainApplication.fullAd;
        if (fullAd == null) {
            TToast.show(this, "广告加载错误");
            return;
        }

        final Activity _this = this; // 全屏广告也必须全屏，那么只有加载失败的时候能看到底部了，底部后面可以加东西让用户跳回APP
        final IFullScreenActivity rc = this;

        fullAd.setFullScreenVideoAdInteractionListener(new TTFullScreenVideoAd.FullScreenVideoAdInteractionListener() {

            @Override
            public void onAdShow() {

                // TToast.show(_this, "展示全屏视频广告");
            }

            @Override
            public void onAdVideoBarClick() {
                // TToast.show(_this, "全屏视频广告查看详情成功");
                rc.setAdIsClicked(true);
            }

            @Override
            public void onAdClose() {
                // TToast.show(_this, "全屏视频广告已关闭");
                rc.returnResult();
            }

            // 视频播放完成回调
            @Override
            public void onVideoComplete() {
                // TToast.show(_this, "全屏视频广告播放完成");
                rc.setVideoIsPlayed(true);
            }

            @Override
            public void onSkippedVideo() {
                // TToast.show(_this, "跳过全屏视频广告播放");

            }
        });

        // 开始显示广告
        fullAd.showFullScreenVideoAd(_this);
    }

}
