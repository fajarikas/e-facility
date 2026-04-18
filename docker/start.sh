#!/bin/sh

# Optimasi Laravel untuk Production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan migrasi database otomatis (Opsional tapi disarankan untuk awal)
# php artisan migrate --force

# Jalankan PHP-FPM di background
php-fpm -D

# Jalankan Nginx di foreground
nginx -g "daemon off;"
