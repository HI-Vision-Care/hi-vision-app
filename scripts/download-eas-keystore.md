# Script hướng dẫn tải keystore từ EAS

## Cách tải keystore từ EAS Credentials

### Bước 1: Chạy lệnh
```bash
eas credentials -p android
```

### Bước 2: Chọn các option theo thứ tự:

```
? What would you like to do? 
  → 1) Build credentials

? Which build profile do you want to configure?
  → production (hoặc profile bạn đang dùng)

? What would you like to do?
  → Download credentials

? What would you like to download?
  → Keystore: rZFxmWQ2Vu (Default)

? Where should we save the keystore file?
  → [Nhập đường dẫn hoặc Enter để lưu ở thư mục hiện tại]
```

### Bước 3: Lưu thông tin quan trọng:

Sau khi tải, bạn sẽ có:
- File `.jks` (keystore)
- Mật khẩu keystore
- Alias: `6dfcc9e3224bddfab28ab99f7fa83462`
- Mật khẩu alias

⚠️ **LƯU TẤT CẢ THÔNG TIN NÀY Ở NƠI AN TOÀN!**

### Bước 4: Kiểm tra SHA-1 của keystore

Để xác nhận keystore có SHA-1 đúng:

```bash
keytool -list -v -keystore path/to/your-keystore.jks -alias 6dfcc9e3224bddfab28ab99f7fa83462
```

Tìm dòng `SHA1:` và kiểm tra:
- ✅ Phải là: `C7:F3:59:33:7B:BB:A4:E9:AE:F6:0B:38:10:8A:69:13:0C:A1:BC:0E`

### Bước 5: Upload lên Google Play

Xem file `FIX_SHA1_STEP_BY_STEP.md` để biết cách upload lên Google Play Console.

