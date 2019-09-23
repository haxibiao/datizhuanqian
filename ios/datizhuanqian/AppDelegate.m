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

#include "AdBoss.h"

//穿山甲广告SDK
//#import <BUAdSDK/BUAdSDKManager.h>
//#import "BUAdSDK/BUSplashAdView.h"



//@interface AppDelegate () <BUSplashAdDelegate>
//@property (nonatomic, assign) CFTimeInterval startTime;
//@end

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

  //穿山甲 init appid
  #if DEBUG
    [AdBoss init: @"5016582"]; //内测appid
  #else
  [AdBoss init: @"5016582"]; //TODO:  上架ios 后，更新这个appid
  #endif
  
  [AdBoss hookWindow:self.window];
  
//  //开屏广告代码 //TODO： 重构后还有问题，无法关闭， 但是后面是需要重构的 react-native的 modules里，给js决定是否唤起splash ad ...
//  AdBoss *boss = [AdBoss new];
//  [boss loadSplashAd:@"816582039"];

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

////穿山甲开屏广告 回调 ==== start
//- (void)splashAdDidClose:(BUSplashAdView *)splashAd {
//  [splashAd removeFromSuperview];
//  CFTimeInterval endTime = CACurrentMediaTime();
//}
//
//- (void)splashAd:(BUSplashAdView *)splashAd didFailWithError:(NSError *)error {
//  [splashAd removeFromSuperview];
//  CFTimeInterval endTime = CACurrentMediaTime();
//}
////穿山甲开屏广告 回调 ==== end


@end
