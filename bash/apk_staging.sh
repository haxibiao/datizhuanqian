#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'

echo "${grn}开始生成内测包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew clean
./gradlew assembleStaging

if [ "$1" = "upload" ]; then

echo "${yel}开始上传 apk 内测包"
cd ../bash/nodejs
node cos_upload_apk.js staging

echo  -e "${grn}上传完成${end}"
echo "下载地址：http://dtzq-1251052432.cos.ap-shanghai.myqcloud.com/datizhuanqian-staging14.apk"
fi
