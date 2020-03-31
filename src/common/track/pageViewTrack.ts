import JAnalytics from 'janalytics-react-native';
import service from 'service';

//tab 点击
export const pageViewTrack = props => {
    const { error, route } = props;
    const trackName = Helper.syncGetter('params.trackName', route);
    const routeName = route.routeName == '答题' ? '首页题库' : route.routeName;
    JAnalytics.startLogPageView({
        pageName: `进入${trackName || routeName}页`,
    });

    service.dataReport({
        data: {
            category: '用户行为',
            action: `enter_the_${trackName ? route.routeName : 'Main'}_page`,
            name: `进入${trackName || routeName}页`,
        },
    });
};
