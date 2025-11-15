# Hướng dẫn sửa lỗi SHA-1 Fingerprint không khớp với Google Play

## Vấn đề
Google Play Console yêu cầu SHA-1: `D1:3B:E6:D5:B2:CE:49:13:DF:AD:5B:7D:DD:5C:F6:9A:FB:DC:29:EC`
Nhưng EAS credentials hiện tại có SHA-1: `C7:F3:59:33:7B:BB:A4:E9:AE:F6:0B:38:10:8A:69:13:0C:A1:BC:0E`

## Giải pháp

### Cách 1: Upload keystore của bạn lên Google Play (Khuyến nghị)

1. **Lấy keystore từ EAS:**
   ```bash
   eas credentials -p android
   ```
   Chọn option để download keystore.

2. **Upload keystore lên Google Play Console:**
   - Vào Google Play Console → Release → Setup → App signing
   - Upload keystore của bạn (C7:F3:59:33...)
   - Google Play sẽ dùng key này để sign các bản release

### Cách 2: Dùng upload key từ Google Play

1. **Tải upload key từ Google Play:**
   - Vào Google Play Console → Release → Setup → App signing
   - Tìm "Upload key certificate"
   - Download certificate (D1:3B:E6:D5...)

2. **Tạo keystore mới từ certificate (nếu có private key):**
   ```bash
   # Nếu bạn có private key
   keytool -importkeystore -srckeystore upload-key.p12 -srcstoretype PKCS12 -destkeystore upload-key.jks -deststoretype JKS
   ```

3. **Cập nhật EAS credentials:**
   ```bash
   eas credentials -p android
   ```
   Chọn "Remove credentials" và tạo mới với upload key từ Google Play.

### Cách 3: Yêu cầu Google Play reset upload key (Nếu đây là app mới)

1. Vào Google Play Console → Release → Setup → App signing
2. Tìm "Request upload key reset"
3. Follow instructions để reset

### Cách 4: Sử dụng Google Play App Signing (Tự động - Khuyến nghị nhất)

Nếu chưa bật Google Play App Signing:
1. Vào Google Play Console → Release → Setup → App signing
2. Bật "Google Play App Signing"
3. Google Play sẽ tự động quản lý keys
4. Bạn chỉ cần upload với bất kỳ key nào (Google Play sẽ resign)

## Lưu ý quan trọng

⚠️ **KHÔNG BAO GIỜ** xóa hoặc mất keystore! Nếu mất keystore, bạn sẽ không thể cập nhật app đã publish.

✅ **Bảo mật:** Lưu keystore ở nơi an toàn, backup nhiều nơi.

## Sau khi fix

Chạy lại build:
```bash
eas build -p android --profile production
```

Upload AAB mới lên Google Play Console.

