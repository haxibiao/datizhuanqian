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

cd ..
bash ./bash/apk_upload.sh


echo "${grn}开始生成小米正式包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleXiaomi

echo "${grn}开始生成百度正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleBaidu

#单独生成某个包的话手动去生成比较方便