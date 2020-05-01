package com.datizhuanqian;

import android.app.Application;
import android.content.Context;
import java.lang.reflect.InvocationTargetException;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.List;

import com.haxibiao.ad.AdPackage;
import com.haxibiao.toolkits.ToolkitsPackage;
import com.haxibiao.vodupload.VodUploadPackage;
import com.microsoft.codepush.react.CodePush;
import cn.jpush.reactnativejpush.JPushPackage;
import cn.jpush.android.api.JPushInterface;

// import com.datizhuanqian.wxapi.WxEntryPackage;
import com.datizhuanqian.alipayapi.AlipayEntryPackage;
import com.haxibiao.reactnativematomo.MatomoPackage;

import java.util.List;

import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      // packages.add(new MyReactNativePackage());
      packages.add(new JPushPackage(true, true));
      packages.add(new AdPackage());
      packages.add(new ToolkitsPackage());
      packages.add(new VodUploadPackage());
      packages.add(new AlipayEntryPackage());
      packages.add(new MatomoPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    setTheme(R.style.SplashScreenTheme);
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         * We use reflection here to pick up the class that initializes Flipper, since
         * Flipper library is not available in release mode
         */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
