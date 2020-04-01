#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'

echo "${yel}说明：这个脚本用来生成、上传指定版本的APK ${end}"
echo "${grn}第一个参数：版本号（可选，如：2.x.x） 例如：bash/apk.sh 2.4.3 ${end}"
echo "${grn}第二个参数：upload(可选，用来上传cdn) 例如：bash/apk.sh 2.4.3 upload ${end}"

bash bash/fix_nodeModule.sh
cd /data/app/datizhuanqian
cd ./android

version="test" #默认版本 目前内测包
# if [ "$1" = "" ]; then
#     echo "请提供第一给参数：版本号（如：2.x.x）"
#     exit 0
# fi

if [ "$2" = "upload" ]; then

echo "${yel}开始上传${version}版本apk"
cd ../bash/nodejs
node cos_upload_apk.js $version

echo  -e "${grn}上传完成${end}"
echo "下载地址：http://dtzq-1251052432.cos.ap-shanghai.myqcloud.com/datizhuanqian-$version.apk"

else 
echo "${grn}开始生成${version}版本APK ...${end}"
# ./gradlew clean
./gradlew assembleRelease
fi
