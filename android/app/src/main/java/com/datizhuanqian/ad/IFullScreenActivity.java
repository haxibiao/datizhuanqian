package com.datizhuanqian.ad;

public interface IFullScreenActivity {


    boolean getVideoIsPlayed();

    void setVideoIsPlayed(boolean isPlayed);

    boolean getAdIsClicked();

    void setAdIsClicked(boolean isClicked);

    boolean getApkIsInstalled();

    void setApkIsInstalled(boolean isDownloaded);

    boolean getVerifyStatus();

    void setVerifyStatus(boolean isVerify);

    void returnResult();
}
