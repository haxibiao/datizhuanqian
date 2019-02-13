#!/bin/bash

grn=$'\e[1;32m'
end=$'\e[0m'


echo "${grn}开始生成正式包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleRelease 


echo "${grn}开始生成内测包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleStaging

# cd ..
# bash ./bash/apk_upload.sh

echo "开始上传正式包到cdn ..."
if [ ! -d /data/www/datizhuanqian.com ]; then
	echo "datizhuanqian.com的源码 !!"
	exit
fi 

cd /data/www/datizhuanqian.com
git pull
mv /data/app/datizhuanqian/android/app/build/outputs/apk/staging/app-staging.apk /data/app/datizhuanqian/android/app/build/outputs/apk/staging/datizhuanqian-staging.apk
php artisan upload:cos APK --filePath=/data/app/datizhuanqian/android/app/build/outputs/apk/staging/datizhuanqian-staging.apk --is_prod=true



echo "${grn}开始生成小米正式包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleXiaomi

echo "${grn}开始生成百度正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleBaidu

#单独生成某个包的话手动去生成比较方便