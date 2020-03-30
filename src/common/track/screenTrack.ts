import JAnalytics from 'janalytics-react-native';
import service from 'service';

//tab 点击
export const switchTabTrack = props => {
    const { error, route } = props;
    JAnalytics.startLogPageView({
        pageName: `进入${route.key}页`,
    });

    service.dataReport({
        data: {
            category: '用户行为',
            action: `on_page_start_tab`,
            name: `进入${route.key}页`,
        },
    });
};
