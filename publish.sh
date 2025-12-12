#!/usr/bin/bash
set -e
COMMIT_MESSAGE="$(cat COMMIT_MESSAGE)"
git add .
git commit -m "$COMMIT_MESSAGE"
git push
rm -rf public
rm -rf ~/Projects/personal/thunder-coding.github.io/*
hugo
cp public/* ~/Projects/personal/thunder-coding.github.io/ -r
cd ~/Projects/personal/thunder-coding.github.io/
git add .
git commit -m "$COMMIT_MESSAGE"
git push
