#!/bin/bash

grn=$'\e[1;32m'
end=$'\e[0m'


echo "${grn}开始生成正式包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleRelease 


echo "${grn}开始生成dev包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleDev

echo "开始上传dev包到cdn ..."
if [ ! -d /data/www/datizhuanqian.com ]; then
	echo "datizhuanqian.com的源码 !!"
	exit
fi 

cd /data/www/datizhuanqian.com
git pull
mv /data/app/datizhuanqian/android/app/build/outputs/apk/dev/app-dev.apk /data/app/datizhuanqian/android/app/build/outputs/apk/dev/datizhuanqian-dev.apk
php artisan upload:cos APK --filePath=/data/app/datizhuanqian/android/app/build/outputs/apk/dev/datizhuanqian-dev.apk --is_prod=true


echo "${grn}开始生成内测包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleStaging

# cd ..
# bash ./bash/apk_upload.sh

echo "开始上传内测包到cdn ..."
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

echo "${grn}开始生成豌豆荚正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleWandoujia

echo "${grn}开始生成VIVO正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleVivo

echo "${grn}开始生成OPPO正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleOppo

echo "${grn}开始生成华为正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleHuawei

# echo "${grn}开始生成魅族正式包 ...${end}"
# cd /data/app/datizhuanqian

# cd ./android
# ./gradlew assembleMeizu


echo "${grn}开始生成360正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleQihoo

# echo "${grn}开始生成应用宝正式包 ...${end}"
# cd /data/app/datizhuanqian

# cd ./android
# ./gradlew assembleTencent


echo "${grn}开始生成其他小应用商店正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleOther



#单独生成某个包的话手动去生成比较方便