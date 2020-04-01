import { Config } from 'utils';
import { Platform } from 'react-native';
import { app } from 'store';
import { Matomo } from 'native';

type Type =
    | 'ClickTaskRewardAd' //激励任务看激励视频
    | 'ClickAnswerRewardAd' //答题看激励视频
    | 'ClickAnswerFullScreenAd' //答题看全屏视频
    | 'ClickSiginRewardAd' //签到看激励视频
    | 'ClickSiginFullScreenAd' //签到看全屏视频
    | 'ClickTimeRewardAd' //时段奖励看激励视频
    | 'ClickTimeFullScreenAd' //时段奖励看全屏视频
    | 'ClickDividendRewardAd' //分红看激励视频
    | 'ClickDividendFullScreenAd' //分红看全屏视频
    | 'ClickVideoScreen' // 点击进入学习看视频页
    | 'ClickContributeScreen' //点击进入出题页
    | 'ClickShareScreen' //点击进入分享页
    | 'UserAutoSignIn' // 静默登录
    | 'Any';

interface Props {
    callback?: Function;
    data: Object;
}

// 数据上报
export default function(props: Props) {
    const { callback } = props;
    //前端
    const { data } = props;

    const { category, action, name } = data;

    Matomo.trackEvent(category, name, name, 1);

    // const body = constructData(props);

    // fetch(Config.ApiServceRoot + '/api/app/report/matomo', {
    //     method: 'POST',
    //     body: body,
    // })
    //     .then(response => response.json())
    //     .then(result => {
    //         callback && callback(result);
    //     })
    //     .catch(err => {
    //         callback && callback(err);
    //     });
}

// function constructData(props: Props) {
//     const { data } = props;
//     const reportContent = {
//         category: '事件分组', //APP子场景
//         action: '事件名', //比如:答题
//         name: '事件对象', //题目ID
//         value: 1, //matomo里的value是int: 比如题目ID
//         package: Config.PackageName,
//         os: Platform.OS,
//         version: Config.Version,
//         build: Config.Build,
//         user_id: app.me.id,
//         referrer: Config.AppStore,
//     };

//     const mergeData = JSON.stringify({ ...reportContent, ...data });
//     let body = new FormData();
//     body.append('data', mergeData);
//     return body;
// }
