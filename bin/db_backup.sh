#!/bin/sh
echo '####backup db start >>>>>>>'
dbpath=$(date +"%y%m%d%H%M%S")
mongodump ${1} -o ../DBBackup/${dbpath}
zip -rj ../DBBackup/${2}_db_${dbpath}.zip ../DBBackup/${dbpath}
rm -rf ../DBBackup/${dbpath}
echo '####backup db finished <<<<'
echo ''


