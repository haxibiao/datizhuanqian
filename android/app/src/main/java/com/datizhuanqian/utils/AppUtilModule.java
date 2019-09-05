package com.datizhuanqian.utils;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;

import com.datizhuanqian.MainActivity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;


public class AppUtilModule extends ReactContextBaseJavaModule {


    private final Context mContext;

    public AppUtilModule(ReactApplicationContext reactContext) {

        super(reactContext);
        this.mContext = reactContext.getApplicationContext();
    }

    @Override
    public String getName() {
        return "AppUtilModule";
    }


    public String getPhoneNumber() {
        String number = "";
        if (getCurrentActivity() != null &&
                (getCurrentActivity().checkCallingOrSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED ||
                        getCurrentActivity().checkCallingOrSelfPermission(Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED ||
                        getCurrentActivity().checkCallingOrSelfPermission("android.permission.READ_PHONE_NUMBERS") == PackageManager.PERMISSION_GRANTED)) {
            TelephonyManager telMgr = (TelephonyManager) this.mContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            number = telMgr.getLine1Number();
        }
        return number;

    }

    @ReactMethod
    public void test(Promise promise)
    {
        String number = this.getPhoneNumber();
        if("".equals(number)){
            this.initPermission();
            number = this.getPhoneNumber();
        }
        promise.resolve(number);
    }

    private void initPermission() {
        List<String> permissionList = new ArrayList<>();
        if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            permissionList.add(Manifest.permission.READ_PHONE_STATE);
        }

        if (!permissionList.isEmpty()) {
            ActivityCompat.requestPermissions(getCurrentActivity(), permissionList.toArray(new String[permissionList.size()]), 1);
        }
    }


}
