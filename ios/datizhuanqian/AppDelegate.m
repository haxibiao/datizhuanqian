/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <AppCenterReactNativeShared/AppCenterReactNativeShared.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>

//穿山甲广告SDK
#import <BUAdSDK/BUAdSDKManager.h>
#import "BUAdSDK/BUSplashAdView.h"

@interface AppDelegate () <BUSplashAdDelegate>
@property (nonatomic, assign) CFTimeInterval startTime;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"datizhuanqian"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  //穿山甲开屏广告
#if DEBUG
  //Whether to open log. default is none.
  [BUAdSDKManager setLoglevel:BUAdSDKLogLevelDebug];
#endif
  [BUAdSDKManager setAppID:@"5016582"]; //答赚ios appid 没上线，暂时用答妹内测
  [BUAdSDKManager setIsPaidApp:NO];

  CGRect frame = [UIScreen mainScreen].bounds;
  BUSplashAdView *splashView = [[BUSplashAdView alloc] initWithSlotID:@"816582039" frame:frame]; //答赚ios 开屏广告位
  
  // tolerateTimeout = CGFLOAT_MAX , The conversion time to milliseconds will be equal to 0
  splashView.tolerateTimeout = 10;
  splashView.delegate = self;

  UIWindow *keyWindow = self.window;
  self.startTime = CACurrentMediaTime();
  [splashView loadAdData];
  [keyWindow.rootViewController.view addSubview:splashView];
  splashView.rootViewController = keyWindow.rootViewController;
   //穿山甲开屏广告 ======== end

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{  
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [CodePush bundleURL];
  #endif
}

//穿山甲开屏广告 回调 ==== start
- (void)splashAdDidClose:(BUSplashAdView *)splashAd {
  [splashAd removeFromSuperview];
  CFTimeInterval endTime = CACurrentMediaTime();
}

- (void)splashAd:(BUSplashAdView *)splashAd didFailWithError:(NSError *)error {
  [splashAd removeFromSuperview];
  CFTimeInterval endTime = CACurrentMediaTime();
}
//穿山甲开屏广告 回调 ==== end



@end
