//
//  RewardVideo.m
//  datizhuanqian
//
//  Created by ivan zhang on 2019/5/6.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import "BUDRewardedVideoAdViewController.h"
#import "BUDSlotViewModel.h"
#import "AppDelegate.h"
#import <BUAdSDK/BUAdSDKManager.h>
#import <BUAdSDK/BURewardedVideoAd.h>
#import <BUAdSDK/BURewardedVideoModel.h>


@interface RewardVideo : RCTEventEmitter <RCTBridgeModule>
{
  
}
@end

@implementation RewardVideo

RCT_EXPORT_MODULE();

static RCTEventEmitter* staticEventEmitter = nil;

+ (BOOL)requiresMainQueueSetup {
  return YES;
}


- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

-(id) init {
  self = [super init];
  if (self) {
    staticEventEmitter = self;
  }
  return self;
}

- (void)_sendEventWithName:(NSString *)eventName body:(id)body {
  if (staticEventEmitter == nil)
    return;
  [staticEventEmitter sendEventWithName:eventName body:body];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
           @"RewardVideo-adloaded",
           @"RewardVideo-videocached",
           @"RewardVideo-videoplayed",
           @"RewardVideo-adclick"
           ];
}


RCT_EXPORT_METHOD(loadAd:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  if(options[@"tt_appid"] == nil || options[@"tt_codeid"] == nil) {
    return;
  }
  
  //设置穿山甲appid
  [BUAdSDKManager setAppID:options[@"tt_appid"]];
  [BUAdSDKManager setIsPaidApp:NO];
  
  //TODO: 这个没有用单例确保这个load对后面view controller的load有帮助
  //loadData
  BURewardedVideoModel *model = [[BURewardedVideoModel alloc] init];
  model.userId = options[@"uid"] == nil ? @"1" : options[@"uid"];
//  model.isShowDownloadBar = YES;
  BURewardedVideoAd *rewardedVideoAd = [[BURewardedVideoAd alloc] initWithSlotID:options[@"tt_codeid"] rewardedVideoModel:model];
  [rewardedVideoAd loadAdData];
  resolve(@"OK");
}

RCT_EXPORT_METHOD(startAd:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  if(options[@"tt_appid"] == nil || options[@"tt_codeid"] == nil) {
    return;
  }
  
  //设置穿山甲appid
  [BUAdSDKManager setAppID:options[@"tt_appid"]];
  [BUAdSDKManager setIsPaidApp:NO];
  
  BUDRewardedVideoAdViewController *vc = [BUDRewardedVideoAdViewController new];
  BUDSlotViewModel *viewModel = [BUDSlotViewModel new];
  viewModel.slotID = options[@"tt_codeid"];
  viewModel.userId = options[@"uid"] == nil ? @"1" : options[@"uid"];
  vc.viewModel = viewModel;
  vc.view.backgroundColor = [UIColor whiteColor];
  
  UIViewController *rootVC = (UIViewController * )[UIApplication sharedApplication].delegate.window.rootViewController;
  [rootVC presentViewController:vc animated:true completion:nil];
  
  //TODO： 先乐观更新给ios用户，后面再判断是否完成视频观看和点击
  resolve(@"结果：ios暂时算你观看成功");
}

@end

