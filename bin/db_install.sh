#!/bin/sh
if [ "${1}" = "" ] || [ ! -e "./build/${1}.zip" ]; then
echo "bad command"
exit
fi

dbpath=$(date +"%y%m%d%H%M%S")

mongodump ${2}  -o ../DBBackup/${dbpath}
zip -r ../DBBackup/db_educationaxis_${dbpath}.zip ../DBBackup/${dbpath}
rm -rf ../DBBackup/${dbpath}

unzip ./build/${1}.zip  -d ./build
mongo ${3} --eval "db.dropDatabase()"
mongorestore ${2} ./build/${1}
rm -rf ./build/${1}
