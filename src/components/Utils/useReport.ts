import { useCallback, useRef } from 'react';
import PullChooser from '../Overlay/PullChooser';
import { GQL } from '@src/apollo';
import { config, app, observer } from 'store';
import { exceptionCapture } from '@src/common/helper';

const useReport = props => {
    const reason = useRef('');

    const reportMutation = useCallback(async () => {
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.reportMutation,
                variables: {
                    report_type: props.type,
                    report_id: props.target.id,
                    reason: reason.current,
                },
            });
        });
        if (error) {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '举报失败',
            });
        } else {
            Toast.show({
                content: '举报成功，感谢您的反馈',
            });
        }
    }, []);

    const reportAction = useCallback(
        content => {
            reason.current = content;
            reportMutation();
        },
        [reportMutation],
    );

    const report = useCallback(() => {
        const operations = [
            {
                title: '低质内容',
                onPress: () => reportAction('低质内容'),
            },
            {
                title: '侮辱谩骂',
                onPress: () => reportAction('侮辱谩骂'),
            },
            {
                title: '违法行为',
                onPress: () => reportAction('违法行为'),
            },
            {
                title: '垃圾广告',
                onPress: () => reportAction('垃圾广告'),
            },
            {
                title: '政治敏感',
                onPress: () => reportAction('政治敏感'),
            },
        ];
        PullChooser.show(operations);
    }, [reportAction]);

    return report;
};

useReport.defaultProps = {
    type: 'question',
};

// question  user comment

export default useReport;
