import JAnalytics from 'janalytics-react-native';
import { Matomo } from 'native';

export const pageViewTrack = props => {
    /* 首页tab route对象中 routeName为中文，无trackName */
    const { error, route } = props;
    const trackName = Helper.syncGetter('params.trackName', route);
    const routeName = route.routeName == '答题' ? '首页题库' : route.routeName;
    const name = `进入${trackName || routeName}页`;
    //极光统计自页面行为计数
    JAnalytics.startLogPageView({
        pageName: name,
    });

    //matomo 数据上报
    Matomo.trackEvent('页面行为', name, name, 1);
};
