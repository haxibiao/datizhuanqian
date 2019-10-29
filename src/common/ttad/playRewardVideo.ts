import { ttad } from 'native';
import { app, config } from 'store';
import { ISAndroid, Tools } from 'utils';
import { RewardTipsOverlay } from 'components';
import { GQL } from 'apollo';

interface Reward {
    gold: 0;
    ticket: 0;
    contribute: 0;
}

interface Video {
    video_play: Boolean;
    ad_click: Boolean;
    verify_status: Boolean;
}

type Type = 'Task' | 'Answer' | 'Sigin';

interface Props {
    reward?: Reward;
    rewardVideoAdCache?: any;
    callback?: Function;
    refresh?: any;
    answerResult?: Boolean;
    type?: Type;
}

export function playRewardVideo(props: Props) {
    console.log('props', props);
    const { rewardVideoAdCache } = props;
    if (rewardVideoAdCache) {
        startRewardVideo(props);
    } else {
        loadRewardVideo(props);
    }
}

function loadRewardVideo(props: Props) {
    ttad.RewardVideo.loadAd().then(result => {
        config.rewardVideoAdCache = result; //更新缓存
        startRewardVideo(props);
    });
}

function startRewardVideo(props: Props) {
    const { callback, reward, refresh, type } = props;
    let video = {
        video_play: false,
        ad_click: false,
        verify_status: false,
    };
    ttad.RewardVideo.startAd()
        .then(result => {
            console.log('result', result, reward);
            if (ISAndroid) {
                if (result) {
                    video = JSON.parse(result);
                    if (type === 'Task' && reward) {
                        oldGetReward(video, reward, refresh);
                        callback && callback();
                    } else {
                        getReward(props);
                    }
                } else {
                    Toast.show({
                        content: '没看完视频,或没看详情，或其他异常...',
                    });
                }
            } else {
                if (reward) {
                    oldGetReward(video, reward, refresh);
                } else {
                    getReward(props);
                }
            }
        })
        .catch(error => {
            console.log('加载奖励视频出错:', error);
        });
}

function oldGetReward(video: Video, reward: Reward, refresh: () => void) {
    const task_id = video.ad_click && video.video_play ? -2 : 0;
    const title = video.ad_click && video.video_play ? '查看详情' : '仅看完视频';
    const rewardContent = video.ad_click && video.video_play ? reward : { ticket: 10 };

    app.client
        .mutate({
            mutation: GQL.TaskRewardMutation,
            variables: {
                task_id,
            },
            refetchQueries: () => [
                {
                    query: GQL.UserQuery,
                    variables: { id: app.me.id },
                },
            ],
        })
        .then(() => {
            refresh();
            RewardTipsOverlay.show({ reward: rewardContent, rewardVideo: true, title: title });
        })
        .catch((err: any) => {
            console.log('err', err);
        });
}

function getReward(props: Props) {
    const { answerResult, type } = props;

    let rewardType = 'VIDEO_PLAY_REWARD'; //观看视频奖励
    if (type === 'Sigin') {
        rewardType = 'SIGNIN_VIDEO_REWARD'; //签到奖励
    }
    if (type === 'Answer' && answerResult) {
        rewardType = 'SUCCESS_ANSWER_VIDEO_REWARD'; //答题及格奖励
    }
    if (type === 'Answer' && !answerResult) {
        rewardType = 'FAIL_ANSWER_VIDEO_REWARD'; //答题不及格奖励
    }

    app.client
        .mutate({
            mutation: GQL.UserRewardMutation,
            variables: {
                reward: rewardType,
            },
            errorPolicy: 'all',
            refetchQueries: () => [
                {
                    query: GQL.UserMetaQuery,
                    variables: { id: app.me.id },
                    fetchPolicy: 'network-only',
                },
            ],
        })
        .then((res: any) => {
            console.log('res', res);
            const reward = Tools.syncGetter('data.userReward', res);
            RewardTipsOverlay.show({ reward, rewardVideo: true });
        })
        .catch((err: any) => {
            console.log('reward video error', err);
            Toast.show({
                content: '发生未知错误、领取失败',
            });
        });
}
