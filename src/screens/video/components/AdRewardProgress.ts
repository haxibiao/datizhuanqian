import { useEffect, useRef, useCallback } from 'react';
import VideoStore from '../VideoStore';

const AdRewardProgress = (focus: boolean) => {
    const currentTime = useRef(0);
    const timer = useRef(0);

    const setRewardProgress = useCallback((): any => {
        return setTimeout(() => {
            if (currentTime.current < VideoStore.rewardLimit) {
                VideoStore.rewardProgress++;
                currentTime.current++;
                setRewardProgress();
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        if (focus) {
            timer.current = setRewardProgress();
        }
    }, [focus]);
};

export default AdRewardProgress;
