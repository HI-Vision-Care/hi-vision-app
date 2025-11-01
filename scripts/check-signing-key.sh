#!/bin/bash

# Script để kiểm tra SHA-1 của keystore
# Usage: ./scripts/check-signing-key.sh <path-to-keystore.jks>

if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-keystore.jks>"
    echo "Example: $0 ./keystore.jks"
    exit 1
fi

KEYSTORE_PATH=$1

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "Error: Keystore file not found: $KEYSTORE_PATH"
    exit 1
fi

echo "Checking SHA-1 fingerprint of: $KEYSTORE_PATH"
echo ""

# List all aliases in keystore
echo "Available aliases in keystore:"
keytool -list -keystore "$KEYSTORE_PATH" | grep -i alias

echo ""
echo "Please enter the alias name:"
read ALIAS_NAME

if [ -z "$ALIAS_NAME" ]; then
    echo "Error: Alias name is required"
    exit 1
fi

echo ""
echo "Checking SHA-1 for alias: $ALIAS_NAME"
echo ""

# Get detailed certificate info including SHA-1
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$ALIAS_NAME"

echo ""
echo "---"
echo "Expected SHA-1 by Google Play:"
echo "D1:3B:E6:D5:B2:CE:49:13:DF:AD:5B:7D:DD:5C:F6:9A:FB:DC:29:EC"
echo ""
echo "Current EAS SHA-1:"
echo "C7:F3:59:33:7B:BB:A4:E9:AE:F6:0B:38:10:8A:69:13:0C:A1:BC:0E"

