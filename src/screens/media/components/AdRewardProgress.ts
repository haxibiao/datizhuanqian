import { useEffect, useRef, useCallback } from 'react';
import VideoStore from '../VideoStore';

const AdRewardProgress = (focus: boolean) => {
	const currentTime = useRef(0);
	const flag = useRef(focus);
	const timer = useRef(0);

	const setRewardProgress = useCallback((): any => {
		return setTimeout(() => {
			if (flag.current && currentTime.current < VideoStore.rewardLimit) {
				VideoStore.rewardProgress++;
				currentTime.current++;
				setRewardProgress();
			}
		}, 1000);
	}, []);

	useEffect(() => {
		if (focus) {
			flag.current = true;
			timer.current = setRewardProgress();
		} else {
			flag.current = false;
		}
		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, [focus]);
};

export default AdRewardProgress;
