#!/bin/bash

ver=$( jq -r .version package.json )
echo "Current version: $ver"

a=( ${ver//./ } )

if [ "$1" = "patch" ]; then
    echo "Patching"
    ((a[2]++))
fi

if [ "$1" = "minor" ]; then
    echo "Patching"
    ((a[1]++))
    a[2]=0
fi

if [ "$1" = "major" ]; then
    echo "Patching"
    ((a[0]++))
    a[1]=0
    a[2]=0
fi

e="pp"
p="all"


if [ "$2" ]; then
    echo "Env: $2"
    e="$2"
fi

if [ "$3" ]; then
    echo "Platform: $3"
    p="$3"
fi

newVer="${a[0]}.${a[1]}.${a[2]}"
echo "New version: $newVer"
# Update version in Package.json
sed -i "s/\"version\": \"$ver\"/\"version\": \"$newVer\"/g" ./package.json


# Commit the changes and update remote repo
git add package.json
git commit -m ":rocket: Release: $newVer"
git push

echo "Released $newVer"
