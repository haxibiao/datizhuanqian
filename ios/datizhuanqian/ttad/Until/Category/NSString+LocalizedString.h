//
//  NSString+LocalizedString.h
//  BUDemo
//
//  Created by 李盛 on 2019/1/14.
//  Copyright © 2019 bytedance. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

extern NSString * const Testads;
extern NSString * const AdsTitle;
extern NSString * const Width;
extern NSString * const Height;
extern NSString * const StartLocation;
extern NSString * const PermissionDenied;
extern NSString * const Coordinate;
extern NSString * const LocationFailure;
extern NSString * const Unknown;
extern NSString * const DrawTitle;
extern NSString * const DrawDescription;
extern NSString * const TestDescription;
extern NSString * const Download;
extern NSString * const LoadCollectionView;
extern NSString * const LoadView;
extern NSString * const CustomBtn;
extern NSString * const NativeInterstitial;
extern NSString * const ShowBanner;
extern NSString * const ShowInterstitial;
extern NSString * const ShowScrollBanner;
extern NSString * const Splash;
extern NSString * const CustomCloseBtn;
extern NSString * const Skip;
extern NSString * const ShowFullScreenVideo;
extern NSString * const ShowRewardVideo;
extern NSString * const LocationOn;
extern NSString * const GetIDFA;
extern NSString * const ClickDownload;
extern NSString * const Call;
extern NSString * const ExternalLink;
extern NSString * const InternalLink;
extern NSString * const NoClick;
extern NSString * const CustomClick;
extern NSString * const Detail;
extern NSString * const DownloadLinks;
extern NSString * const URLLinks;

@interface NSString (LocalizedString)

+ (NSString *)localizedStringForKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
