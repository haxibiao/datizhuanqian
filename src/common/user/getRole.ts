interface User {
    roles: [String];
}

export function getRole(user: User) {
    const { roles } = user;
    if (roles.indexOf('ROOT_USER') >= 0) {
        return '答题赚钱 官方账号';
    } else if (roles.indexOf('EDITOR_USER') >= 0) {
        return '答题赚钱 官方小编';
    } else if (roles.indexOf('STAR_USER') >= 0) {
        return '优质内容作者';
    } else if (roles.indexOf('MODERATOR_USER') >= 0) {
        return '答题版主';
    } else if (roles.indexOf('NORMAL_USER') >= 0) {
        return '普通答友';
    } else {
        return '普通答友';
    }
}
