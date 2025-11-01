# Hướng dẫn sửa lỗi SHA-1 không khớp - Từng bước

## Vấn đề
- **Google Play yêu cầu SHA-1:** `D1:3B:E6:D5:B2:CE:49:13:DF:AD:5B:7D:DD:5C:F6:9A:FB:DC:29:EC`
- **EAS đang dùng SHA-1:** `C7:F3:59:33:7B:BB:A4:E9:AE:F6:0B:38:10:8A:69:13:0C:A1:BC:0E`

## Giải pháp: Upload keystore hiện tại của bạn lên Google Play

### Bước 1: Tải keystore từ EAS

1. Mở terminal và chạy:
   ```bash
   eas credentials -p android
   ```

2. Chọn menu:
   - `1` → Build credentials
   - Chọn profile: `production` (hoặc profile bạn đang dùng)
   - Chọn: `Download credentials`
   - Chọn: `Keystore: rZFxmWQ2Vu (Default)`
   - Tải file `.jks` về và lưu ở nơi an toàn (nhớ mật khẩu!)

### Bước 2: Upload keystore lên Google Play Console

1. **Mở Google Play Console:**
   - Vào: https://play.google.com/console
   - Chọn app của bạn (hi-vision)

2. **Vào mục App signing:**
   - Menu bên trái → **Release** → **Setup** → **App signing**
   - Hoặc: **Release** → **Setup** → **App integrity**

3. **Upload keystore của bạn:**
   - Tìm section **"Upload key certificate"** hoặc **"Thay đổi khoá ký"**
   - Click **"Upload new upload key"** hoặc **"Add upload key"**
   - Upload file `.jks` bạn vừa tải từ EAS
   - Nhập mật khẩu keystore
   - Nhập alias: `6dfcc9e3224bddfab28ab99f7fa83462`
   - Nhập mật khẩu alias (có thể giống mật khẩu keystore)

4. **Xác nhận:**
   - Google Play sẽ kiểm tra SHA-1: `C7:F3:59:33:7B:BB:A4:E9:AE:F6:0B:38:10:8A:69:13:0C:A1:BC:0E`
   - Nếu khớp, Google Play sẽ chấp nhận key này

### Bước 3: Build lại app với key đúng

Sau khi Google Play chấp nhận keystore của bạn:

```bash
eas build -p android --profile production
```

### Bước 4: Upload AAB mới lên Google Play

1. Tải AAB từ EAS build dashboard
2. Upload lên Google Play Console → Release → Testing → Closed testing
3. Lần này sẽ không còn lỗi SHA-1!

---

## Lưu ý quan trọng:

⚠️ **Bảo mật keystore:**
- Lưu file `.jks` ở nhiều nơi an toàn
- Lưu mật khẩu keystore và alias
- KHÔNG commit keystore lên Git!

✅ **Nếu đây là lần đầu upload:**
- Có thể Google Play đã tự động tạo upload key
- Bạn vẫn có thể upload keystore của bạn để thay thế

---

## Nếu không upload được keystore lên Google Play:

### Cách khác: Tải upload key từ Google Play

1. Trong Google Play Console → App signing
2. Tìm **"Upload key certificate"**
3. Download certificate file (.pem hoặc .der)
4. Nếu có private key, tạo keystore mới:
   ```bash
   keytool -importkeystore -srckeystore upload-key.p12 -srcstoretype PKCS12 -destkeystore upload-key.jks -deststoretype JKS
   ```
5. Cập nhật EAS credentials với keystore mới

---

## Cần giúp đỡ thêm?

Nếu gặp vấn đề ở bước nào, cho tôi biết và tôi sẽ giúp bạn fix!

