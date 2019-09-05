package com.datizhuanqian.ad;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.datizhuanqian.MainApplication;
import com.datizhuanqian.R;
import com.datizhuanqian.ad.ttad.TToast;
import com.datizhuanqian.ad.ttad.config.TTAdManagerHolder;

import static com.datizhuanqian.ad.RewardVideo.sendEvent;

public class RewardActivity extends Activity implements IRewardActivity {

    public boolean mHasShowDownloadActive = false;
    public boolean mVideoIsPlayed = false;
    public boolean mAdIsClicked = false;
    public boolean mApkIsInstalled = false;
    public boolean mVerifyStatus = false;

    public boolean getDownloadStatus() {
        return mHasShowDownloadActive;
    }

    public void setDownloadStatus(boolean isActive) {
        mHasShowDownloadActive = isActive;
    }

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
        Log.e("结果", "返回了");
        this.finish();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.video);

        // 开始显示奖励视频
        showAd();
    }

    private void showAd() {

        TTRewardVideoAd ad = MainApplication.ad;
        if (ad == null) {
            TToast.show(this, "奖励视频还没加载好");
            this.returnResult();
            return;
        }

        final Activity adView = this; //激励视频必须全屏activity 无法加底部了
        final IRewardActivity rc = this;

        // ad.setShowDownLoadBar(false);
        ad.setRewardAdInteractionListener(new TTRewardVideoAd.RewardAdInteractionListener() {

            @Override
            public void onAdShow() {
                TToast.show(adView, "开始展示奖励视频");
            }

            @Override
            public void onAdVideoBarClick() {
                TToast.show(adView, "奖励视频查看详情成功");
                sendEvent("AdClicked", null);
                rc.setAdIsClicked(true);
            }

            @Override
            public void onAdClose() {
                TToast.show(adView, "奖励视频已关闭");
                rc.returnResult();
            }

            // 视频播放完成回调
            @Override
            public void onVideoComplete() {
                TToast.show(adView, "奖励视频成功播放完成");
                sendEvent("VideoWatched", null);
                rc.setVideoIsPlayed(true);
            }

            @Override
            public void onVideoError() {
                TToast.show(adView, "奖励视频出错了...");
            }

            // 视频播放完成后，奖励验证回调，rewardVerify：是否有效，rewardAmount：奖励数量，rewardName：奖励名称
            @Override
            public void onRewardVerify(boolean rewardVerify, int rewardAmount, String rewardName) {
                if (rewardVerify) {
                    TToast.show(adView, "验证:成功  数量:" + rewardAmount + " 奖励:" + rewardName, Toast.LENGTH_LONG);
                } else {
                    TToast.show(adView, "验证:" + "失败 ...", Toast.LENGTH_SHORT);
                }
                rc.setVerifyStatus(rewardVerify);
            }


            public void onSkippedVideo() {
                TToast.show(adView, "rewardVideoAd has onSkippedVideo");
            }
        });

        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {
                rc.setDownloadStatus(false);
            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                if (!rc.getDownloadStatus()) {
                    rc.setDownloadStatus(true);
                    TToast.show(adView, "下载中，点击下载区域暂停", Toast.LENGTH_LONG);
                }
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                TToast.show(adView, "下载暂停，点击下载区域继续", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                TToast.show(adView, "下载失败，点击下载区域重新下载", Toast.LENGTH_LONG);
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
                TToast.show(adView, "下载完成，点击下载区域重新下载", Toast.LENGTH_LONG);
            }

            @Override
            public void onInstalled(String fileName, String appName) {
                TToast.show(adView, "安装完成，点击下载区域打开", Toast.LENGTH_LONG);
                sendEvent("ApkInstalled", null);
                rc.setApkIsInstalled(true);
                rc.returnResult();
            }
        });

        // 开始显示广告
        ad.showRewardVideoAd(adView);
    }

}
