# Hướng dẫn Build và Upload lên TestFlight

## Bước 1: Tăng Version

### Cách 1: Tự động (EAS sẽ tự tăng build number)
- Trong `eas.json` đã có `"autoIncrement": true` cho production build
- EAS sẽ tự động tăng build number, bạn chỉ cần tăng version trong `app.json`

### Cách 2: Tăng version trong `app.json`
1. Mở file `app.json`
2. Tăng version tại dòng 5:
   - Patch: `1.0.5` → `1.0.6` (fix lỗi nhỏ)
   - Minor: `1.0.5` → `1.1.0` (thêm tính năng)
   - Major: `1.0.5` → `2.0.0` (thay đổi lớn)

Ví dụ:
```json
"version": "1.0.6"
```

## Bước 2: Build iOS Production

### Cách 1: Build và Submit tự động (Khuyến nghị)
```bash
# Build và submit tự động lên TestFlight
eas build --platform ios --profile production --auto-submit
```

### Cách 2: Build trước, submit sau
```bash
# 1. Build iOS
eas build --platform ios --profile production

# Sau khi build xong, lấy build ID và submit
eas submit --platform ios --latest
```

## Bước 3: Theo dõi Build

1. Sau khi chạy lệnh, EAS sẽ hiển thị URL để theo dõi build
2. Truy cập: https://expo.dev/accounts/kimcu142/projects/hi-vision/builds
3. Đợi build hoàn thành (thường 10-20 phút)

## Bước 4: Submit lên TestFlight (nếu không dùng --auto-submit)

```bash
# Submit build mới nhất
eas submit --platform ios --latest

# Hoặc submit build cụ thể
eas submit --platform ios --id <build-id>
```

## Các lệnh hữu ích khác

### Xem danh sách builds
```bash
eas build:list --platform ios
```

### Xem thông tin build
```bash
eas build:view <build-id>
```

### Download build (nếu cần)
```bash
eas build:download --platform ios --latest
```

### Xem logs nếu build fail
```bash
eas build:view <build-id> --logs
```

## Lưu ý quan trọng

1. **Đảm bảo đã login EAS:**
   ```bash
   eas login
   ```

2. **Kiểm tra credentials:**
   ```bash
   eas credentials
   ```

3. **Nếu lần đầu build, cần setup:**
   ```bash
   eas build:configure
   ```

4. **Kiểm tra app.json trước khi build:**
   - Version phải đúng format (x.y.z)
   - Bundle identifier phải đúng
   - Project ID đã có trong `extra.eas.projectId`

## Troubleshooting

### Nếu build bị lỗi:
1. Kiểm tra logs: `eas build:view <build-id> --logs`
2. Kiểm tra credentials: `eas credentials`
3. Đảm bảo Apple Developer account có quyền

### Nếu submit thất bại:
1. Kiểm tra App Store Connect credentials
2. Đảm bảo app đã được tạo trên App Store Connect
3. Kiểm tra provisioning profile và certificates

