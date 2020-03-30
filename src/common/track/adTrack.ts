import JAnalytics from 'janalytics-react-native';
import service from 'service';

//tab 点击
export const adClickTrack = props => {
    const { action, name } = props;
    JAnalytics.postEvent({
        type: 'count',
        id: '10003',
        extra: {
            点击广告: name,
        },
    });

    service.dataReport({
        data: {
            category: '广告行为',
            action: action,
            name: name,
        },
    });
};
