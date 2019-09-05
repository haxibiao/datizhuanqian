package com.datizhuanqian.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;
import android.os.Handler.Callback;


import com.microsoft.appcenter.http.DefaultHttpClient;
import com.microsoft.appcenter.http.HttpClient;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.SubscribeMessage;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelbiz.WXOpenBusinessView;
import com.tencent.mm.opensdk.modelbiz.WXOpenBusinessWebview;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.ShowMessageFromWX;
import com.tencent.mm.opensdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

//import com.haxibiao.share.WxShareActivity;
//import com.haxibiao.share.uikit.NetworkUtil;
//import com.haxibiao.share.Constants;
//import com.haxibiao.share.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

import cn.jiguang.net.HttpResponse;
import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.lang.ref.WeakReference;


public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    private static String TAG = "MicroMsg.WXEntryActivity";
    private static final String WX_APP_ID = "wx6fee77d331d42a27";
    private static final String WX_APP_SECRET = "726558ee50efeafe18cbc54795131508";

//    private HttpWxLogin httpWxLogin;
//    private  String openId;
//    private  String accessToken;

    private IWXAPI api;
//    private static MyHandler handler;



//    private static class MyHandler extends Handler {
//        private final WeakReference<WXEntryActivity> wxEntryActivityWeakReference;
//        private  WXEntryActivity wxEntryActivity;
//
//        public MyHandler(WXEntryActivity wxEntryActivity){
//            wxEntryActivityWeakReference = new WeakReference<WXEntryActivity>(wxEntryActivity);
//            this.wxEntryActivity = wxEntryActivity;
//        }
//
//        @Override
//        public void handleMessage(Message msg) {
//            int tag = msg.what;
//            Log.i("结果","reuslt");
//            switch (tag) {
//                case NetworkUtil.GET_TOKEN: {
//                    Bundle data = msg.getData();
//                    JSONObject json = null;
//                    try {
//                        json = new JSONObject(data.getString("result"));
//                        String openId, accessToken, refreshToken, scope;
//                        openId = json.getString("openid");
//                        accessToken = json.getString("access_token");
//                        refreshToken = json.getString("refresh_token");
//                        scope = json.getString("scope");
////                        Intent intent = new Intent(wxEntryActivityWeakReference.get(), WxShareActivity.class);
////                        intent.putExtra("openId", openId);
////                        intent.putExtra("accessToken", accessToken);
////                        intent.putExtra("refreshToken", refreshToken);
////                        intent.putExtra("scope", scope);
////                        wxEntryActivityWeakReference.get().startActivity(intent);
////                        this.wxEntryActivity.getUserInfo(accessToken,openId);
//                    } catch (JSONException e) {
//                        Log.e("错误", e.getMessage());
//                    }
//                }
//            }
//        }
//    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        api = WXAPIFactory.createWXAPI(this, WxEntryModule.APP_ID);
        try {
            Intent intent = getIntent();
            api.handleIntent(intent, this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq req) {
        finish();

    }


    @Override
    public void onResp(BaseResp resp) {
        String result = null;

        Log.e("resp.errCode","结果"+resp.errCode);

        try{
            switch (resp.errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    result ="授权成功";
                    final String code = ((SendAuth.Resp) resp).code;
                    Log.i("code","value"+code);
                    WxEntryModule.promise.resolve(code);
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    result ="取消授权";
                    break;
                case BaseResp.ErrCode.ERR_AUTH_DENIED:
                    result = "拒绝授权";
                    break;
                case BaseResp.ErrCode.ERR_UNSUPPORT:
                    result = "授权错误";
                    break;
                default:
                    result = "返回";
                    break;
            }

        }catch (Exception e) {
            finish();
            e.printStackTrace();

        }
        finish();
    }


//    private void getAccessToken(String code){
//        String url = "https://api.weixin.qq.com/sns/oauth2/access_token?" + "appid="
//                + WX_APP_ID + "&secret="
//                + WX_APP_SECRET + "&code=" + code + "&grant_type=" + "authorization_code";
//
//        Log.e("getAccessToken","状态码"+handler);
//        NetworkUtil.sendWxAPI(handler, String.format("https://api.weixin.qq.com/sns/oauth2/access_token?" +
//                        "appid=%s&secret=%s&code=%s&grant_type=authorization_code", "wx6fee77d331d42a27",
//                "726558ee50efeafe18cbc54795131508", code), NetworkUtil.GET_TOKEN);
//    }


//    public void getUserInfo(String accessToken,String openId){
//
//        Log.e("getUserInfo","code"+accessToken+"/"+openId);
//        NetworkUtil.sendWxAPI(handler, String.format("https://api.weixin.qq.com/sns/userinfo?" +
//                "access_token=%s&openid=%s", accessToken, openId), NetworkUtil.GET_INFO);
//    }


    private void goToGetMsg() {

    }



    private void goToShowMsg(ShowMessageFromWX.Req showReq) {

    }

}
