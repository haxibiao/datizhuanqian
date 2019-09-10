//
//  BUDRewardedVideoAdViewController.m
//  datizhuanqian
//
//  Created by ivan zhang on 2019/5/6.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BUDRewardedVideoAdViewController.h"
#import <BUAdSDK/BURewardedVideoAd.h>
#import <BUAdSDK/BURewardedVideoModel.h>
#import "AppDelegate.h" 

@interface BUDRewardedVideoAdViewController () <BURewardedVideoAdDelegate>

@property (nonatomic, strong) BURewardedVideoAd *rewardedVideoAd;
//@property (nonatomic, strong) BUDNormalButton *button;

@end

@implementation BUDRewardedVideoAdViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
#warning Every time the data is requested, a new one BURewardedVideoAd needs to be initialized. Duplicate request data by the same full screen video ad is not allowed.
  BURewardedVideoModel *model = [[BURewardedVideoModel alloc] init];
  model.userId = self.viewModel.userId;
//  model.isShowDownloadBar = YES;
  self.rewardedVideoAd = [[BURewardedVideoAd alloc] initWithSlotID:self.viewModel.slotID rewardedVideoModel:model];
  self.rewardedVideoAd.delegate = self;
  [self.rewardedVideoAd loadAdData];
//  [self.view addSubview:self.button];
}

- (void)viewWillLayoutSubviews {
  [super viewWillLayoutSubviews];
//  self.button.center = CGPointMake(self.view.center.x, self.view.center.y*1.5);
}

#pragma mark Lazy loading
//- (UIButton *)button {
//  if (!_button) {
//    CGSize size = [UIScreen mainScreen].bounds.size;
//    _button = [[BUDNormalButton alloc] initWithFrame:CGRectMake(0, size.height*0.75, 0, 0)];
//    [_button setTitle:@"播放激励视频" forState:UIControlStateNormal];
//    [_button addTarget:self action:@selector(buttonTapped:) forControlEvents:UIControlEventTouchUpInside];
//  }
//  return _button;
//}
//
//- (void)buttonTapped:(id)sender {
//  // Return YES when material is effective,data is not empty and has not been displayed.
//  //Repeated display is not charged.
//  [self.rewardedVideoAd showAdFromRootViewController:self];
//}

#pragma mark BURewardedVideoAdDelegate

- (void)rewardedVideoAdDidLoad:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd data load success");
  
  //不点按钮，自动播放可以吗
  [rewardedVideoAd showAdFromRootViewController:self];
  
//  MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
//  hud.mode = MBProgressHUDModeText;
//  hud.offset = CGPointMake(0, -100);
//  hud.label.text = @"激励数据加载成功";
//  [hud hideAnimated:YES afterDelay:0.5];
}

- (void)rewardedVideoAdVideoDidLoad:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video load success");
  
  //不点按钮，自动播放可以吗
  AppDelegate *app = (AppDelegate * )[UIApplication sharedApplication].delegate;
  UIViewController *rootVC = app.window.rootViewController;
  [rewardedVideoAd showAdFromRootViewController:rootVC];
  
}

- (void)rewardedVideoAdWillVisible:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video will visible");
}

- (void)rewardedVideoAdDidClose:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video did close");
  
  AppDelegate *app = (AppDelegate * )[UIApplication sharedApplication].delegate;
  UIViewController *rootVC = app.window.rootViewController;
  [rootVC dismissViewControllerAnimated:true completion:nil];
}

- (void)rewardedVideoAdDidClick:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video did click");
}

- (void)rewardedVideoAd:(BURewardedVideoAd *)rewardedVideoAd didFailWithError:(NSError *)error {
  NSLog(@"rewardedVideoAd data load fail");
}

- (void)rewardedVideoAdDidPlayFinish:(BURewardedVideoAd *)rewardedVideoAd didFailWithError:(NSError *)error {
  if (error) {
    NSLog(@"rewardedVideoAd play error");
  } else {
    NSLog(@"rewardedVideoAd play finish");
  }
}

- (void)rewardedVideoAdServerRewardDidFail:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd verify failed");
  
  NSLog(@"Demo RewardName == %@", rewardedVideoAd.rewardedVideoModel.rewardName);
  NSLog(@"Demo RewardAmount == %ld", (long)rewardedVideoAd.rewardedVideoModel.rewardAmount);
}

- (void)rewardedVideoAdServerRewardDidSucceed:(BURewardedVideoAd *)rewardedVideoAd verify:(BOOL)verify{
  NSLog(@"rewardedVideoAd verify succeed");
  NSLog(@"verify result: %@", verify ? @"success" : @"fail");
  
  NSLog(@"Demo RewardName == %@", rewardedVideoAd.rewardedVideoModel.rewardName);
  NSLog(@"Demo RewardAmount == %ld", (long)rewardedVideoAd.rewardedVideoModel.rewardAmount);
}

-(BOOL)shouldAutorotate{
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return UIInterfaceOrientationMaskAll;
}
@end
