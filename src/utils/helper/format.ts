export const moment = (second: string) => {
    let h = 0,
        i = 0,
        s = parseInt(second, 10);
    if (s > 60) {
        i = parseInt(s / 60, 10);
        s = parseInt(s % 60, 10);
    }
    // 补零
    const zero = function(v: number) {
        return v >> 0 < 10 ? '0' + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(':');
};

export const count = (value: string) => {
    const num: number = parseFloat(value);
    if (num >= 1000) {
        return Math.round(Number((num / 1000).toFixed(2)) * 10) / 10 + 'k';
    } else {
        return num || 0;
    }
};

export const userTitle = (user: { roles: any }) => {
    const { roles } = user;
    if (roles.indexOf('ROOT_USER') >= 0) {
        return '官方账号';
    } else if (roles.indexOf('EDITOR_USER') >= 0) {
        return '官方小编';
    } else if (roles.indexOf('STAR_USER') >= 0) {
        return '优质内容作者';
    } else if (roles.indexOf('MODERATOR_USER') >= 0) {
        return '答题版主';
    } else if (roles.indexOf('NORMAL_USER') >= 0) {
        return '普通答友';
    } else {
        return '普通答友';
    }
};

export const correctRate = (correct: number, count: number) => {
    if (typeof correct === 'number' && typeof count === 'number') {
        const result = (correct / count) * 100;
        if (result) {
            return result.toFixed(1) + '%';
        }
        return '暂无统计';
    }
};

export const exceptionCapture = async (asyncFunc: () => Promise<any>) => {
    try {
        const res = await asyncFunc();
        return [null, res];
    } catch (err) {
        const error: { [key: string]: any } = {};
        if (typeof err === 'string') {
            error.message = err.replace('GraphQL error: ', '');
        } else if (err !== null && typeof err === 'object' && typeof err.message === 'string') {
            error.message = err.message.replace('GraphQL error: ', '');
        }
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return [error, null];
    }
};

export const getTaskIcon = (task: any) => {
    let icon = require('@src/assets/images/ic_task_answer.png');
    switch (task.id) {
        case 1:
            icon = require('@src/assets/images/ic_task_prefect_subname.png');
            break;
        case 2:
            icon = require('@src/assets/images/ic_task_perfect_avatar.png');
            break;
        case 3:
            icon = require('@src/assets/images/ic_task_perfect_gender.png');
            break;
        case 8:
            icon = require('@src/assets/images/ic_task_perfect_age.png');
            break;
        case 11:
            icon = require('@src/assets/images/ic_task_good_comment.png');
            break;
        case 12:
            icon = require('@src/assets/images/ic_damei.png');
            break;
        case 17:
            icon = require('@src/assets/images/ic_task_pk.png');
            break;
        case 18:
            icon = require('@src/assets/images/ic_task_video.png');
            break;
        default:
            break;
    }
    return icon;
};

export const money = (user: { gold: any; exchange_rate: any }) => {
    return ((user.gold || 1) / (user.exchange_rate || 600)).toFixed(1);
};
