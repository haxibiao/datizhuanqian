package com.datizhuanqian.tiktokapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

//import com.bytedance.sdk.demo.MainActivity;
//import com.bytedance.sdk.demo.user.UserInfoActivity;
import com.bytedance.sdk.open.aweme.TikTokConstants;
import com.bytedance.sdk.open.aweme.TikTokOpenApiFactory;
import com.bytedance.sdk.open.aweme.api.TikTokApiEventHandler;
import com.bytedance.sdk.open.aweme.api.TiktokOpenApi;
import com.bytedance.sdk.open.aweme.authorize.model.Authorization;

import com.bytedance.sdk.open.aweme.common.model.BaseReq;
import com.bytedance.sdk.open.aweme.common.model.BaseResp;

public class TikTokEntryActivity extends Activity implements TikTokApiEventHandler {



    TiktokOpenApi ttOpenApi;


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ttOpenApi = TikTokOpenApiFactory.create(this, TikTokConstants.TARGET_APP.AWEME);
        ttOpenApi.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq req) {

    }

    @Override
    public void onResp(BaseResp resp) {
        if (resp.getType() == TikTokConstants.ModeType.SEND_AUTH_RESPONSE) {
            // 授权成功可以获得authCode
            Authorization.Response response = (Authorization.Response) resp;
            Log.d("AuthResultTest","authCode " + response.authCode);
            if (resp.isSuccess()) {
                Toast.makeText(this, "Authorization success with permissions："+response.grantedPermissions +
                        ", code:"+response.authCode, Toast.LENGTH_LONG).show();
                Log.e("response.authCode","结果"+response.authCode);
                TikTokEntryModule.promise.resolve(response.authCode);
//                Intent intent = new Intent(this, UserInfoActivity.class);
//                intent.putExtra(MainActivity.CODE_KEY, response.authCode);
//                startActivity(intent);
            }
            else {
                Toast.makeText(this, "Authorization failed", Toast.LENGTH_LONG).show();
            }
        }
        finish();
    }

    @Override
    public void onErrorIntent(@Nullable Intent intent) {
        // 错误数据
        Toast.makeText(this, "授权失败，Intent出错", Toast.LENGTH_LONG).show();
        finish();
    }
}
