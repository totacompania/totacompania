#!/bin/bash
BACKUP_DIR="/opt/totacompania/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Dump MongoDB
docker exec totacompania-mongodb mongodump --db totacompania --archive="/tmp/mongo-backup-${DATE}.archive" --quiet 2>/dev/null
docker cp totacompania-mongodb:/tmp/mongo-backup-${DATE}.archive "$BACKUP_DIR/"
docker exec totacompania-mongodb rm "/tmp/mongo-backup-${DATE}.archive"

# Keep only last 7 backups
ls -t "$BACKUP_DIR"/mongo-backup-*.archive 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null

echo "[$(date)] Backup completed: mongo-backup-${DATE}.archive"
