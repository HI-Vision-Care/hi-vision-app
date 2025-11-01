# Hướng dẫn Build và Upload lên Apple App Store

## Yêu cầu trước khi bắt đầu

1. **Tài khoản Apple Developer** ($99/năm)

   - Đăng ký tại: https://developer.apple.com/programs/
   - Cần xác thực và thanh toán

2. **EAS Account** (đã có)

   - Đang đăng nhập với: kimcu142

3. **App Store Connect**
   - Tạo app tại: https://appstoreconnect.apple.com/
   - Chuẩn bị thông tin: tên app, mô tả, ảnh screenshot, privacy policy URL, etc.

## Các bước thực hiện

### Bước 1: Cập nhật thông tin app trong app.json (nếu cần)

Kiểm tra và cập nhật:

- `bundleIdentifier`: hiện tại là `com.anonymous.HIVisionMobileApp`
  - **Quan trọng**: Cần đổi thành format hợp lệ như `com.yourcompany.hivision`
  - Bundle ID này phải khớp với Bundle ID đã tạo trong Apple Developer Portal

### Bước 2: Build iOS Production

Chạy lệnh sau để build:

```bash
npx eas build --platform ios --profile production
```

Khi được hỏi về **encryption compliance**, trả lời:

- **"Yes"** (y) - nếu app chỉ dùng standard encryption (HTTPS, standard libraries)
- **"No"** (n) - nếu app dùng custom encryption

**Lưu ý**: Build sẽ mất khoảng 10-20 phút và được thực hiện trên cloud của EAS.

### Bước 3: Cấu hình Apple Credentials (lần đầu tiên)

Lần đầu build, EAS sẽ hỏi về Apple credentials:

- Có thể để EAS tự động quản lý (recommended)
- Hoặc upload manual certificates/profiles

### Bước 4: Submit lên App Store

Sau khi build thành công, submit bằng lệnh:

```bash
npx eas submit --platform ios --profile production
```

Hoặc:

1. Download file `.ipa` từ EAS dashboard
2. Upload manual qua Xcode hoặc Transporter app

### Bước 5: Hoàn tất trên App Store Connect

1. Vào App Store Connect: https://appstoreconnect.apple.com/
2. Chọn app của bạn
3. Điền thông tin bắt buộc:
   - App Name
   - Subtitle
   - Description
   - Keywords
   - Screenshots (các kích thước khác nhau)
   - App Icon
   - Privacy Policy URL
   - Category
   - Age Rating
   - Pricing
4. Submit for Review
5. Chờ Apple review (thường 1-3 ngày)

## Troubleshooting

### Lỗi Bundle ID

- Đảm bảo Bundle ID trong `app.json` khớp với Bundle ID trong Apple Developer Portal
- Bundle ID phải unique và format hợp lệ

### Lỗi Certificate/Provisioning Profile

- EAS thường tự động tạo, nhưng nếu lỗi thì có thể cần tạo manual
- Vào Apple Developer Portal kiểm tra Certificates & Profiles

### Lỗi Version

- EAS tự động tăng build number nhờ `autoIncrement: true`
- Kiểm tra version trong app.json phải hợp lệ (format: X.Y.Z)

## Chi phí

- **Apple Developer Program**: $99/năm (bắt buộc)
- **EAS Build**:
  - Free tier: 30 builds/tháng
  - Nếu vượt quá: $29/tháng hoặc pay-per-build

## Liên kết hữu ích

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- App Store Connect: https://appstoreconnect.apple.com/
- Apple Developer Portal: https://developer.apple.com/
- EAS Submit Docs: https://docs.expo.dev/submit/introduction/
