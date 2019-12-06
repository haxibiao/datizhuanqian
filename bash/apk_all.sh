#!/bin/bash

grn=$'\e[1;32m'
end=$'\e[0m'

bash bash/fix_nodeModule.sh

echo "${grn}开始生成OPPO正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleOppo

echo "${grn}开始生成华为正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleHuawei

echo "${grn}开始生成小米正式包 ..."
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleXiaomi

echo "${grn}开始生成魅族正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleMeizu


echo "${grn}开始生成百度正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleBaidu

echo "${grn}开始生成豌豆荚正式包 ...${end}"
cd /data/app/datizhuanqian

cd ./android
./gradlew assembleWandoujia

# echo "${grn}开始生成VIVO正式包 ...${end}"
# cd /data/app/datizhuanqian

# cd ./android
# ./gradlew assembleVivo


# echo "${grn}开始生成360正式包 ...${end}"
# cd /data/datizhuanqian

# cd ./android
# ./gradlew assembleQihoo

# echo "${grn}开始生成应用宝正式包 ...${end}"
# cd /data/datizhuanqian

# cd ./android
# ./gradlew assembleTencent


# echo "${grn}开始生成其他小应用商店正式包 ...${end}"
# cd /data/datizhuanqian

# cd ./android
# ./gradlew assembleOther









#单独生成某个包的话手动去生成比较方便