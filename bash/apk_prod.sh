#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'

echo "说明：旧的上传正式包用, 即将淘汰，用bash/apk.sh代替..."
#固定文件名，对CDN不友好,以后按env区分打包的需求直接用version的概念替换了

cd /data/app/datizhuanqian
cd ./android

version="release"

if [ "$1" = "upload" ]; then

echo "${yel}开始上传 apk 正式包"
cd ../bash/nodejs
node cos_upload_apk.js $version
echo  -e "${grn}上传完成${end}"
echo "下载地址：http://dtzq-1251052432.cos.ap-shanghai.myqcloud.com/datizhuanqian-${version}.apk"

else 

echo "${grn}开始生成 ..."
./gradlew clean
./gradlew assembleRelease

fi
