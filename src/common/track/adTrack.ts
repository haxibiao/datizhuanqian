import JAnalytics from 'janalytics-react-native';
import { Matomo } from 'native';

//广告行为
export const adClickTrack = (props: { name: any; value?: any }) => {
    const { name, value } = props;

    //极光统计自定义计数    id需要到极光后台创建
    JAnalytics.postEvent({
        type: 'count',
        id: '10003',
        extra: {
            点击广告: name,
        },
    });

    //matomo 数据上报
    Matomo.trackEvent('广告行为', name, name, value || 1);
};
