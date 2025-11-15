# Fix iOS Image Picker Permission Issue

## 🐛 Vấn đề

App bị đơ (freeze) khi yêu cầu quyền truy cập camera và photo library trên iOS. Android hoạt động bình thường.

## 🔍 Nguyên nhân

iOS yêu cầu các **permission descriptions** phải được khai báo trong `Info.plist` (thông qua `app.json`). Nếu không có, app sẽ crash hoặc đơ khi yêu cầu quyền.

## ✅ Giải pháp đã áp dụng

### 1. Thêm Permission Descriptions trong `app.json`

Đã thêm các key sau vào `ios.infoPlist`:

```json
"infoPlist": {
  "ITSAppUsesNonExemptEncryption": false,
  "NSPhotoLibraryUsageDescription": "Hi-Vision cần quyền truy cập thư viện ảnh để bạn có thể tải ảnh đại diện lên.",
  "NSCameraUsageDescription": "Hi-Vision cần quyền truy cập camera để bạn có thể chụp ảnh đại diện.",
  "NSPhotoLibraryAddUsageDescription": "Hi-Vision cần quyền truy cập thư viện ảnh để lưu ảnh đại diện."
}
```

### 2. Thêm expo-image-picker plugin

Đã thêm plugin với cấu hình chi tiết:

```json
[
  "expo-image-picker",
  {
    "photosPermission": "Hi-Vision cần quyền truy cập thư viện ảnh để bạn có thể tải ảnh đại diện lên.",
    "cameraPermission": "Hi-Vision cần quyền truy cập camera để bạn có thể chụp ảnh đại diện.",
    "saveToPhotosAlbum": true
  }
]
```

### 3. Cải thiện code xử lý permissions

Đã cập nhật `personalinfo.tsx` với các cải tiến:

#### a. Thêm delay nhỏ trước khi request permission

```typescript
// Small delay to prevent UI blocking on iOS
await new Promise((resolve) => setTimeout(resolve, 100));
```

#### b. Kiểm tra permission trước khi request

```typescript
// Check permission first
const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();

if (
  permissionResult.status !== "granted" &&
  !permissionResult.canAskAgain &&
  Platform.OS === "ios"
) {
  Alert.alert(
    t("personalInfo.imagePicker"),
    "Vui lòng bật quyền truy cập thư viện ảnh trong Cài đặt > Hi-Vision > Ảnh",
    [{ text: "OK" }]
  );
  return;
}
```

#### c. Hướng dẫn user đến Settings nếu đã từ chối

Nếu user đã từ chối permission và không thể hỏi lại, app sẽ hiển thị hướng dẫn để user vào Settings bật quyền.

## 🚀 Cách test sau khi fix

### 1. Prebuild lại native code

```bash
npx expo prebuild --clean
```

### 2. Build development client mới

```bash
# iOS
eas build --profile development --platform ios

# Hoặc local build nếu có Mac
npx expo run:ios
```

### 3. Test scenarios

#### Scenario 1: Lần đầu request permission

- Mở app → Vào Personal Info
- Click vào nút camera/photo
- App sẽ hiển thị dialog xin quyền
- ✅ App KHÔNG đơ
- ✅ Dialog hiển thị message đúng

#### Scenario 2: User từ chối permission

- User click "Don't Allow"
- ✅ App hiển thị alert hướng dẫn
- ✅ App không crash

#### Scenario 3: Permission đã được cấp

- User đã cấp quyền trước đó
- Click vào nút camera/photo
- ✅ ImagePicker mở ngay lập tức
- ✅ Không có delay hoặc đơ

#### Scenario 4: User đã từ chối và không thể hỏi lại

- Go to Settings > Hi-Vision
- Disable Photos/Camera permission
- Quay lại app, click nút
- ✅ App hiển thị hướng dẫn đến Settings

## 📝 Notes

### Tại sao cần delay 100ms?

Trên iOS, việc đóng modal và ngay lập tức request permission có thể gây conflict với UI thread, dẫn đến app đơ. Delay nhỏ giúp UI thread xử lý xong việc đóng modal trước.

### Tại sao cần check `canAskAgain`?

- Nếu user từ chối 2 lần, iOS sẽ không cho phép app hỏi lại
- `canAskAgain` sẽ là `false`
- Lúc này cần hướng dẫn user vào Settings để bật quyền thủ công

### Permission keys quan trọng cho iOS

| Key                                 | Mục đích                       |
| ----------------------------------- | ------------------------------ |
| `NSPhotoLibraryUsageDescription`    | Đọc ảnh từ thư viện            |
| `NSCameraUsageDescription`          | Truy cập camera                |
| `NSPhotoLibraryAddUsageDescription` | Lưu ảnh vào thư viện (iOS 14+) |

## 🔧 Troubleshooting

### Vấn đề: App vẫn đơ sau khi fix

**Giải pháp:**

1. Xóa app khỏi thiết bị
2. Clean build folder: `npx expo prebuild --clean`
3. Build lại hoàn toàn
4. Cài đặt lại app

### Vấn đề: Permission dialog không hiện

**Giải pháp:**

1. Kiểm tra Settings > Hi-Vision > Photos/Camera
2. Reset permissions: Xóa app và cài lại
3. Kiểm tra xem `app.json` có đúng không

### Vấn đề: Android bị ảnh hưởng

**Giải pháp:**

- Không lo, các thay đổi này không ảnh hưởng Android
- Android vẫn dùng permissions trong `android.permissions` array

## 📚 References

- [Expo ImagePicker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [iOS Info.plist Keys](https://developer.apple.com/documentation/bundleresources/information_property_list)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
