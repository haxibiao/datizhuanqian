#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'


echo "${yel}开始上传 apk 内测包"

cd /data/app/datizhuanqian

cd ./android/app/build/outputs/apk/staging

scp app-staging.apk root@datizhuanqian.com:/data/www/datizhuanqian.com/storage/app/public/apks

echo  -e "${grn}上传完成。。。\n下载地址：https://datizhuanqian.com/storage/apks/app-staging.apk${end}"