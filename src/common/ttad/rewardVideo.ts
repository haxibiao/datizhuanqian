import TipsOverlay from '../../components/Overlay/TipsOverlay';
import { ttad } from 'native';
import { app } from 'store';
import { ISIOS } from 'utils';
import { RewardTipsOverlay } from 'components';

interface adinfo {
    tt_appid?: string;
    tt_codeid?: string;
}

interface reward {
    gold?: Number;
    ticket?: Number;
    contribute?: Number;
}

export function rewardVideo(adinfo?: adinfo, reward?: reward, navigation?: any) {
    ttad.RewardVideo.loadAd({ ...adinfo, uid: app.me.id }).then(() => {
        ttad.RewardVideo.startAd({
            ...adinfo,
            uid: app.me.id,
        })
            .then(result => {
                let didWatched = true;
                let adClicked = false;
                if (!ISIOS) {
                    let video = {};
                    if (result) {
                        video = JSON.parse(result);
                    }
                    if (video.video_play || video.ad_click || video.verify_status) {
                        if (video.ad_click) {
                            adClicked = true;
                            RewardTipsOverlay.show(reward, navigation);
                        } else {
                            Toast.show({
                                content: `看完视频 +${task.ticket}精力`,
                            });
                        }

                        // 后端通过rewardStatus来控制允许重复激励
                        if (rewardStatus < 2) {
                            _this.setState({
                                rewardTaskAction: 3,
                            });
                        }
                    } else {
                        didWatched = false;
                        Toast.show({
                            content: '没看完视频,或没看详情，或其他异常...',
                        });
                    }
                }

                // 后端真的给奖励了
                if (didWatched) {
                    const task_id = adClicked ? -2 : 0;
                    taskReward({
                        variables: {
                            task_id,
                        },
                    }).then(() => {
                        refetchUserQuery && refetchUserQuery();
                    });
                }
            })
            .catch(error => {
                console.log('启动奖励视频error:', error);
            });
    });
}
