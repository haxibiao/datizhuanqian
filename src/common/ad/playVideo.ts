/*
  包含看激励视频、看全屏视频 
  包含看视频广告数据上报
*/

import { Platform } from 'react-native';
import { ad } from 'native';
import { app, config } from 'store';
import { ISAndroid, Config } from 'utils';
import RewardOverlay from '@src/components/Overlay/RewardOverlay';
import { GQL } from 'apollo';
import service from 'service';

type Type =
    | 'Task'
    | 'AnswerPass'
    | 'AnswerFail'
    | 'Sigin'
    | 'TimeReward'
    | 'Dividend'
    | 'Guide'
    | 'Contribute'
    | 'Audit'
    | 'Compete'
    | 'Spider';

interface Video {
    video_play: Boolean;
    ad_click: Boolean;
    verify_status: Boolean;
}

interface Props {
    rewardVideoAdCache?: any; //激励视频cache
    fullScreenVideoAdCache?: any; //全屏视频cache
    callback?: Function;
    type?: Type; //看视频来源
    noReward?: Boolean;
}

export function playVideo(props: Props) {
    const { type } = props;
    const playType = Math.round(Math.random()); //随机1为看激励视频 0为看全屏视频
    //非指定Reward时  触发随机看视频  奖励值为默认类型

    if (type === 'AnswerPass' || type === 'AnswerFail') {
        playFullScreenVideo(props);
    } else if (type == 'Task' || type == 'Contribute' || type == 'Audit' || type == 'Spider' || playType) {
        playRewardVideo(props);
    } else {
        playFullScreenVideo(props);
    }
    dataReport(type, playType);
}

//看激励视频
function playRewardVideo(props: Props) {
    const { rewardVideoAdCache } = props;
    if (rewardVideoAdCache) {
        startRewardVideo(props);
    } else {
        loadRewardVideo(props);
    }
}

//加载激励视频缓存
function loadRewardVideo(props: Props) {
    ad.RewardVideo.loadAd().then(result => {
        config.rewardVideoAdCache = result; //更新缓存
        if (result) {
            startRewardVideo(props);
        } else {
            Toast.show({ content: '激励视频加载失败' });
        }
    });
}

//播放激励视频
function startRewardVideo(props: Props) {
    const { callback, noReward } = props;
    let video = {
        video_play: false,
        ad_click: false,
        verify_status: false,
    };
    ad.RewardVideo.startAd()
        .then(result => {
            console.log('result', result);
            if (ISAndroid) {
                if (result) {
                    video = JSON.parse(result);
                    //TODO: video.video_play 有很大几率返回false
                    callback && callback();
                    !noReward && getReward(props, video);
                } else {
                    Toast.show({
                        content: '没看完视频,或没看详情，或其他异常...',
                    });
                }
            } else {
                !noReward && getReward(props, video);
            }
        })
        .catch(error => {
            console.log('加载奖励视频出错:', error);
        });
}

// 看全屏视频
function playFullScreenVideo(props: Props) {
    const { fullScreenVideoAdCache } = props;
    if (fullScreenVideoAdCache) {
        startFullScreenVideo(props);
    } else {
        loadFullScreenVideo(props);
    }
}

// 加载全屏视频缓存
function loadFullScreenVideo(props: Props) {
    ad.FullScreenVideo.loadFullScreenVideoAd().then(result => {
        config.fullScreenVideoAdCache = result; //更新缓存
        if (result) {
            startFullScreenVideo(props);
        } else {
            Toast.show({ content: '激励视频加载失败' });
        }
    });
}

// 播放全屏视频
function startFullScreenVideo(props: Props) {
    const { noReward, callback } = props;
    ad.FullScreenVideo.startFullScreenVideoAd()
        .then((result: string) => {
            console.log('result', result);
            if (result) {
                callback && callback();
                !noReward && getReward(props);
            } else {
                Toast.show({
                    content: '没看完视频，或其他异常...',
                });
            }
        })
        .catch(error => {
            console.log('加载奖励视频出错:', error);
        });
}

// 新看视频奖励发放
function getReward(props: Props, video: Video) {
    const { type } = props;
    console.log('type', type);
    let rewardType = 'VIDEO_PLAY_REWARD'; //观看视频奖励
    let title = '领取奖励成功';
    switch (type) {
        case 'Sigin':
            rewardType = 'DOUBLE_SIGNIN_REWARD'; //签到奖励
            break;
        case 'AnswerPass':
            rewardType = 'SUCCESS_ANSWER_VIDEO_REWARD'; //签到奖励
            title = '点详情得更多贡献';
            break;
        case 'AnswerFail':
            rewardType = 'FAIL_ANSWER_VIDEO_REWARD'; //签到奖励
            title = '点详情得更多贡献';
            break;
        case 'Task':
            rewardType = video.ad_click ? 'CLICK_REWARD_VIDEO' : 'WATCH_REWARD_VIDEO'; //激励视频查看奖励
            title = video.ad_click ? '领取点详情奖励成功' : '点详情得更多贡献';
            break;
        case 'Audit':
            rewardType = video.ad_click ? 'AUDIT_REWAERD_VIDEO_CLICK' : 'AUDIT_REWAERD_VIDEO_WATCH'; //签到奖励
            title = video.ad_click ? '领取点详情奖励成功' : '点详情得更多贡献';
            break;
        default:
            break;
    }

    const refetchQuery =
        type === 'Sigin'
            ? [
                  {
                      query: GQL.UserMetaQuery,
                      variables: { id: app.me.id },
                      fetchPolicy: 'network-only',
                  },
                  {
                      query: GQL.SignInsQuery,
                  },
              ]
            : [
                  {
                      query: GQL.UserMetaQuery,
                      variables: { id: app.me.id },
                      fetchPolicy: 'network-only',
                  },
              ];

    app.client
        .mutate({
            mutation: GQL.UserRewardMutation,
            variables: {
                reward: rewardType,
            },
            errorPolicy: 'all',
            refetchQueries: () => refetchQuery,
        })
        .then((res: any) => {
            console.log('res', res);
            const reward = Helper.syncGetter('data.userReward', res);
            RewardOverlay.show({ reward, rewardVideo: true, title });
        })
        .catch((err: any) => {
            console.log('reward video error', err);
            Toast.show({
                content: '发生未知错误、领取失败',
            });
        });
}

//看视频数据上报
function dataReport(type: string | undefined, playType: number) {
    let action = playType ? 'user_click_reward_ad' : 'user_click_fullscreen_ad';
    let name = playType ? '点击激励视频' : '点击全屏视频';

    switch (type) {
        case 'Task':
            action = 'user_click_task_reward_ad';
            name = '点击看激励视频任务';
            break;
        case 'AnswerPass' || 'AnswerFail':
            action = 'user_click_answer_fullscreen_ad';
            name = '答题结果看全屏视频';
            break;
        case 'Sigin':
            action = playType ? 'user_click_sigin_reward_ad' : 'user_click_sigin_fullscreen_ad';
            name = playType ? '签到随机看激励视频' : '签到随机看全屏视频';
            break;
        case 'TimeReward':
            action = playType ? 'user_click_time_reward_ad' : 'user_click_time_fullscreen_ad';
            name = playType ? '时段奖励随机看激励视频' : '时段奖励随机看全屏视频';
            break;
        case 'Dividend':
            action = playType ? 'user_click_dividend_reward_ad' : 'user_click_dividend_fullscreen_ad';
            name = playType ? '分红随机看激励视频' : '分红随机看全屏视频';
            break;
        case 'Guide':
            action = playType ? 'user_click_guide_reward_ad' : 'user_click_guide_fullscreen_ad';
            name = playType ? '新人引导随机看激励视频' : '新人引导随机看全屏视频';
            break;
        case 'Contribute':
            action = 'user_click_contribute_reward_ad';
            name = '出题加速看激励视频';
            break;
        case 'Audit':
            action = 'user_click_audit_reward_ad';
            name = '审题看激励视频';
            break;
        case 'Spider':
            action = 'user_click_spider_reward_ad';
            name = '采集视频看激励视频';
            break;
        case 'Compete':
            action = 'user_click_compete_reward_ad';
            name = '答题PK看激励视频';
            break;

        default:
            break;
    }

    const mergeData = {
        category: '广告点击',
        action,
        name,
    };

    service.dataReport({
        data: mergeData,
        callback: (result: any) => {
            console.warn('result', result);
        },
    }); // 数据上报
}
