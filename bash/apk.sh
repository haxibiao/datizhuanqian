#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'


cd /data/app/datizhuanqian

cd ./android

if [ "$1" = "upload" ]; then

echo "${yel}开始上传 apk 正式包"
cd ../bash/nodejs

version="2.4"

node cos_upload_apk.js release $version

echo  -e "${grn}上传完成${end}"
echo "下载地址：http://dtzq-1251052432.cos.ap-shanghai.myqcloud.com/datizhuanqian-$version.apk"

else 
echo "${grn}开始生成 ..."
./gradlew clean
./gradlew assembleRelease
fi
