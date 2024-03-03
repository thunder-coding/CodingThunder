#!/usr/bin/bash
set -e
git add .
git commit -m "Update website content"
git push
rm -rf ~/Projects/personal/thunder-coding.github.io/*
hugo
cp public/* ~/Projects/personal/thunder-coding.github.io/ -r
cd ~/Projects/personal/thunder-coding.github.io/
git add .
git commit -m "Update website content"
git push
