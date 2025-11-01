# Cách sửa lỗi SHA-1 không khớp với Google Play

## Tình huống

- **Google Play yêu cầu SHA-1:** `D1:3B:E6:D5:B2:CE:49:13:DF:AD:5B:7D:DD:5C:F6:9A:FB:DC:29:EC`
- **EAS credentials hiện tại SHA-1:** `C7:F3:59:33:7B:BB:A4:E9:AE:F6:0B:38:10:8A:69:13:0C:A1:BC:0E`

## Giải pháp nhanh nhất:

### Option 1: Upload keystore của bạn lên Google Play (Nếu bạn muốn giữ keystore hiện tại)

1. **Tải keystore từ EAS:**

   ```bash
   eas credentials -p android
   ```

   - Chọn "Download credentials"
   - Chọn "Keystore: rZFxmWQ2Vu"
   - Tải về và lưu an toàn

2. **Upload lên Google Play Console:**
   - Vào: https://play.google.com/console → App của bạn → Release → Setup → App signing
   - Tìm "Upload key certificate" section
   - Upload keystore file (.jks) của bạn
   - Google Play sẽ chấp nhận key này

### Option 2: Lấy upload key từ Google Play và dùng cho EAS (Nếu bạn chưa có app trên Play Store)

**Bước 1: Tải upload certificate từ Google Play**

- Vào Google Play Console → App signing
- Tìm "Upload key certificate"
- Download file certificate (có thể là .pem hoặc .der)

**Bước 2: Kiểm tra xem có private key không**
Nếu bạn chỉ có certificate (public key) mà không có private key, bạn cần:

- Yêu cầu Google Play reset upload key
- Hoặc dùng Google Play App Signing (tự động)

**Bước 3: Nếu có private key, tạo keystore:**

```bash
# Nếu có .p12 file
keytool -importkeystore -srckeystore upload-key.p12 -srcstoretype PKCS12 -destkeystore upload-key.jks -deststoretype JKS

# Sau đó cập nhật EAS credentials với keystore mới
```

### Option 3: Reset và để Google Play tự động quản lý (Khuyến nghị cho app mới)

1. **Trong Google Play Console:**

   - Vào App signing
   - Tìm "Request upload key reset" hoặc "Manage upload key"
   - Follow instructions để reset

2. **Sau khi reset, lấy upload key mới:**
   - Download upload certificate từ Google Play
   - Cập nhật EAS credentials với key mới

## Kiểm tra SHA-1 sau khi fix:

```bash
# Kiểm tra SHA-1 của keystore hiện tại
keytool -list -v -keystore your-keystore.jks

# Hoặc kiểm tra qua EAS
eas credentials -p android
```

## Lưu ý quan trọng:

⚠️ **Nếu đây là lần đầu upload app:**

- Google Play đã tự động tạo upload key cho bạn
- Bạn CẦN dùng key đó (SHA-1: D1:3B:E6:D5...)
- Hoặc upload keystore của bạn lên Google Play

⚠️ **Nếu app đã có trên Play Store:**

- KHÔNG thể thay đổi upload key đã được Google Play chấp nhận
- Phải dùng đúng key đã đăng ký

## Command để cập nhật EAS credentials:

```bash
# Xóa credentials cũ
eas credentials -p android
# Chọn "Remove credentials"

# Tạo credentials mới với keystore đúng
eas credentials -p android
# Chọn "Set up new credentials"
# Upload keystore với SHA-1: D1:3B:E6:D5...
```

## Sau khi fix:

Build lại app:

```bash
eas build -p android --profile production
```

Upload AAB mới lên Google Play Console.
