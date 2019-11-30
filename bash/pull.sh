#!/bin/bash

echo "拉取项目的其他git依赖项目(例如：toolkits)..."

echo " - android toolkits 更新 ..."
cd ../../android/toolkits
git pull

echo " - ios toolkits 更新 ..."
cd ../../ios/toolkits
git pull