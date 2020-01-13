interface Props {
    onlineVersion: any; //线上版本
    localVersion: any; //本地版本
}

export function contrastVersion(props: Props) {
    //TODO 后期服务端需要扩充 versionCode
    const { onlineVersion, localVersion } = props;

    let result = false;

    let onlineVersionList = onlineVersion.split('.');
    let localVersionList = localVersion.split('.');
    // console.log('versionList', localVersionList);
    if (onlineVersionList.length < 3) {
        onlineVersionList.push('0');
    }

    if (localVersionList.length < 3) {
        localVersionList.push('0');
    }

    // console.log('versionList', onlineVersionList, localVersionList);
    for (let i = 0; i < onlineVersionList.length; i++) {
        if (onlineVersionList[i] > localVersionList[i]) {
            result = true;
            return result;
        }

        if (onlineVersionList[i] < localVersionList[i]) {
            result = false;
            return result;
        }
    }
    return result;
}
