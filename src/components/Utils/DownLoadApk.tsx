import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import TouchFeedback from '../TouchableView/TouchFeedback';
import RNFetchBlob from 'rn-fetch-blob';
import { AppUtil } from 'native';

const DownLoadApk = props => {
    const [downloading, setDownloading] = useState(false);
    const [donwloadTask, setDonwloadTask] = useState();
    const [received, setReceived] = useState(1);
    const [total, setTotal] = useState(100000);
    const [installApk, setInstallApk] = useState(false);

    const { packageName, name, url, createWithdraw, value } = props;

    let buttonName = '立即安装';

    useEffect(() => {
        //
        AppUtil.CheckApkExist(packageName || 'com.dongdezhuan', (data: any) => {
            if (data) {
                setInstallApk(true);
            }
        });
    }, []);

    const checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
                handleDownload();
            } else {
                Toast.show({
                    content: `${Config.AppName}需要读取、写入或者删除存储空间和权限，已保证你能正常使用下载安装App`,
                    duration: 2000,
                });
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleDownload = () => {
        setDownloading(true);
        if (downloading) {
            donwloadTask.cancel((err, taskId) => {
                console.log('err', err, taskId);
                setDownloading(false);
                setReceived(1);
                setTotal(100000);
            });
        } else {
            //TODO: 需检查APK包是否已安装
            const android = RNFetchBlob.android;
            const dirs = RNFetchBlob.fs.dirs;

            const _donwloadTask = RNFetchBlob.config({
                path: dirs.DownloadDir + '/' + `${name}` + '.apk',
                fileCache: true,
                appendExt: 'apk',
            }).fetch('GET', url || 'http://cos.dongdezhuan.com/dongdezhuan.apk');

            setDonwloadTask(_donwloadTask);
            // console.log('_donwloadTask :', _donwloadTask);
            _donwloadTask
                .progress((received, total) => {
                    console.log('received, total :', received, total);
                    setReceived(received);
                    setTotal(total);
                })
                .then(res => {
                    if (Platform.OS === 'android') {
                        RNFetchBlob.fs.scanFile([
                            { path: res.path(), mime: 'application/vnd.android.package-archive' },
                        ]);
                    }
                    console.log('res.path() :', res.path());
                    android.actionViewIntent(res.path(), 'application/vnd.android.package-archive');

                    props.hide();

                    setReceived(total);
                    setDownloading(false);
                })
                .catch(error => {
                    console.log('error :', error);
                    setReceived(0);
                    setDownloading(false);
                });
        }
    };

    const openApk = () => {
        // AppUtil.OpenApk('com.dongdezhuan');
        value ? createWithdraw(value, 'dongdezhuan') : AppUtil.OpenApk(packageName);
        props.hide();
    };

    if (downloading) {
        buttonName = '取消';
    } else {
        if (installApk) {
            buttonName = `提现到${name}`;
        }
    }

    return (
        <TouchFeedback
            onPress={() => {
                installApk ? openApk() : checkPermission();
            }}
            style={downloading ? styles.download : styles.button}>
            <View
                style={[
                    styles.downloadProgress,
                    {
                        borderTopRightRadius: downloading ? 0 : PxFit(5),
                        borderBottomRightRadius: downloading ? 0 : PxFit(5),
                        width: downloading ? ((Device.WIDTH - PxFit(88)) * received) / total : Device.WIDTH - PxFit(88),
                    },
                ]}>
                <Text style={styles.downloadText}>{buttonName}</Text>
            </View>
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(5),
        width: Device.WIDTH - PxFit(88),
        height: PxFit(42),
    },
    download: {
        backgroundColor: '#F0F0F0',
        borderRadius: PxFit(5),
        width: Device.WIDTH - PxFit(88),
        height: PxFit(42),
    },
    downloadProgress: {
        backgroundColor: Theme.primaryColor,
        borderTopLeftRadius: PxFit(5),
        borderBottomLeftRadius: PxFit(5),
        height: PxFit(42),
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadText: {
        color: '#FFF',
        position: 'absolute',
        textAlign: 'center',
        textAlignVertical: 'center',
        left: 0,
        top: 0,
        width: Device.WIDTH - PxFit(88),
        height: PxFit(42),
    },
});

export default DownLoadApk;
