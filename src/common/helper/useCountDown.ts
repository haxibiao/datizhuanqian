import { useMemo, useState, useEffect } from 'react';

interface Props {
    expirationTime: number | string;
}

export const useCountDown = (props: Props) => {
    const { expirationTime } = props;
    const [subTime, setSubTime] = useState(expirationTime);

    useEffect(() => {
        setSubTime(expirationTime);
    }, [expirationTime]);

    useEffect(() => {
        const timer: number = setInterval(() => {
            setSubTime(prevCount => prevCount - 1000);
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return useMemo(() => {
        let day: number | string = parseInt(String(subTime / 1000 / 60 / 60 / 24), 10);
        let hours: number | string = parseInt(String((subTime / 1000 / 60 / 60) % 24), 10);
        let minutes: number | string = parseInt(String((subTime / 1000 / 60) % 60), 10);
        let seconds: number | string = parseInt(String((subTime / 1000) % 60), 10);
        day = day < 10 ? '0' + day : day;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return { day, hours, minutes, seconds };
    }, [subTime]);
};

// export const useCountDown = (props: Props) => {
//     const { expirationTime } = props;
//     const [subTime, setSubTime] = useState(0);
//     const future = useMemo(() => new Date(expirationTime), [expirationTime]);

//     useEffect(() => {
//         const timer: number = setInterval(() => {
//             const now: Date = new Date();
//             setSubTime(Number(future) - Number(now));
//         }, 10);
//         return () => {
//             clearInterval(timer);
//         };
//     }, [future]);

//     return useMemo(() => {
//         let day: number | string = parseInt(String(subTime / 1000 / 60 / 60 / 24), 10);
//         let hours: number | string = parseInt(String((subTime / 1000 / 60 / 60) % 24), 10);
//         let minutes: number | string = parseInt(String((subTime / 1000 / 60) % 60), 10);
//         let seconds: number | string = parseInt(String((subTime / 1000) % 60), 10);
//         day = day < 10 ? '0' + day : day;
//         hours = hours < 10 ? '0' + hours : hours;
//         minutes = minutes < 10 ? '0' + minutes : minutes;
//         seconds = seconds < 10 ? '0' + seconds : seconds;
//         return { day, hours, minutes, seconds };
//     }, [subTime]);
// };
