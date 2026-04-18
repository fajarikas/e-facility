#!/bin/sh

# Jalankan PHP-FPM di background
php-fpm -D

# Jalankan Nginx di foreground
nginx -g "daemon off;"
