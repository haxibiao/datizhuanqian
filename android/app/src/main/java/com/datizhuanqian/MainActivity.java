package com.datizhuanqian;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;

import com.datizhuanqian.ad.Banner;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
     protected void onCreate(Bundle savedInstanceState) {
     	super.onCreate(savedInstanceState);
//         SplashScreen.show(this, R.style.SplashScreenTheme);  // here
     }

    @Override
    protected String getMainComponentName() {
        return "datizhuanqian";
    }

     @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        try {
            if (resultCode == RESULT_OK && requestCode == 10000) {
                JSONObject json = new JSONObject();
                json.put("video_play", intent.getBooleanExtra("video_play", false));
                json.put("ad_click", intent.getBooleanExtra("ad_click", false));
                json.put("apk_install", intent.getBooleanExtra("apk_install", false));
                json.put("verify_status", intent.getBooleanExtra("verify_status", false));
                MainApplication.myBlockingQueue.add(json.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();
            MainApplication.myBlockingQueue.add(null);
        }
    }

    /**
     * 动态获取权限
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

}
