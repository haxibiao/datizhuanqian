import { Matomo } from 'native';

interface Props {
    callback?: Function;
    data: Object;
}

interface Object {
    category: string;
    action: string;
    name: string;
}

// 数据上报
export default function(props: Props) {
    //前端
    const { data } = props;

    const { category, action, name } = data;
    Matomo.trackEvent(category, name, name, 1);
}
