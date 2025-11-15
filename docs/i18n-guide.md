# Hướng dẫn sử dụng tính năng đa ngôn ngữ (i18n)

## Tổng quan

App hiện tại hỗ trợ đổi ngôn ngữ giữa **Tiếng Việt** (mặc định) và **Tiếng Anh**. Tính năng này được tích hợp vào toàn bộ ứng dụng sử dụng các thư viện chuyên nghiệp.

## Thư viện sử dụng

- **i18next**: Thư viện i18n chuẩn quốc tế
- **react-i18next**: React hooks cho i18next
- **expo-localization**: Tự động detect ngôn ngữ thiết bị
- **@react-native-async-storage/async-storage**: Lưu trữ preferences

## Cấu trúc hệ thống

### 1. Cấu hình i18n

- `i18n/index.ts`: Cấu hình chính của i18next
- `hooks/useTranslation.ts`: Hook tiện ích để sử dụng translations

### 2. File translations

- `locales/en.json`: Bản dịch tiếng Anh
- `locales/vi.json`: Bản dịch tiếng Việt

### 3. Components

- `LanguageSwitcher`: Component để đổi ngôn ngữ nhanh
- `Preferences Screen`: Có section ngôn ngữ trong settings

## Cách sử dụng

### 1. Sử dụng hook useTranslation trong component

```tsx
import { useTranslation } from "@/hooks/useTranslation";

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <View>
      <Text>{t("settings.preferences")}</Text>
      <TouchableOpacity onPress={() => setLanguage("en")}>
        <Text>Switch to English</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 2. Thêm translation key mới

#### Bước 1: Thêm vào file English (`locales/en.json`)

```json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

#### Bước 2: Thêm vào file Vietnamese (`locales/vi.json`)

```json
{
  "newSection": {
    "newKey": "Văn bản tiếng Việt"
  }
}
```

#### Bước 3: Sử dụng trong component

```tsx
<Text>{t("newSection.newKey")}</Text>
```

### 3. Sử dụng LanguageSwitcher component

```tsx
import { LanguageSwitcher } from "@/components";

function MyScreen() {
  return (
    <View>
      <LanguageSwitcher />
      {/* Nội dung khác */}
    </View>
  );
}
```

## Đổi ngôn ngữ

### Cách 1: Từ Settings

1. Mở app và vào **Settings** (Tùy chọn)
2. Tìm phần **Accessibility** và nhấn vào **Language** (Ngôn ngữ)
3. Chọn **Tiếng Việt** hoặc **English** từ danh sách

### Cách 2: Sử dụng LanguageSwitcher

- Component này có thể được thêm vào bất kỳ màn hình nào
- Nhấn vào để đổi ngôn ngữ ngay lập tức

## Các màn hình đã được dịch

✅ **Settings/Preferences**

- Tất cả các tùy chọn và labels
- Section ngôn ngữ mới

✅ **Language Screen**

- Màn hình chuyên dụng để đổi ngôn ngữ
- Giao diện đẹp với danh sách ngôn ngữ
- Thông tin hướng dẫn

✅ **Home Screen**

- Các tiêu đề section
- Nút "See All"

✅ **Auth Screens**

- Thông báo lỗi
- Các thông báo hệ thống

## Thêm ngôn ngữ mới

Để thêm ngôn ngữ mới (ví dụ: tiếng Trung):

1. **Tạo file translation mới**:

   ```bash
   locales/zh.json
   ```

2. **Cập nhật LanguageContext.tsx**:

   ```tsx
   export type Language = "en" | "vi" | "zh";

   const translations = {
     en: enTranslations,
     vi: viTranslations,
     zh: zhTranslations, // Import file mới
   };
   ```

3. **Cập nhật Preferences screen** để thêm tùy chọn ngôn ngữ mới

## Lưu ý quan trọng

- **Ngôn ngữ mặc định**: Tiếng Việt
- **Auto-detect**: Tự động detect ngôn ngữ thiết bị khi lần đầu cài đặt
- **Lưu trữ**: Ngôn ngữ được lưu trong AsyncStorage
- **Performance**: Translations được load một lần khi app khởi động
- **Fallback**: Nếu không tìm thấy translation, sẽ hiển thị key gốc
- **i18next features**: Hỗ trợ namespace, pluralization, interpolation

## Troubleshooting

### Translation không hiển thị

1. Kiểm tra key có đúng cú pháp không (dùng dấu chấm để phân cấp)
2. Kiểm tra file translation có key đó không
3. Kiểm tra component có import `useTranslation` không

### Ngôn ngữ không lưu

1. Kiểm tra AsyncStorage permissions
2. Kiểm tra console log để xem có lỗi không

## Tính năng nâng cao của i18next

### 1. Interpolation (Chèn biến)

```tsx
// Trong translation file
{
  "welcome": "Hello {{name}}, you have {{count}} messages"
}

// Sử dụng
<Text>{t('welcome', { name: 'John', count: 5 })}</Text>
```

### 2. Pluralization (Số ít/số nhiều)

```tsx
// Trong translation file
{
  "items_zero": "No items",
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}

// Sử dụng
<Text>{t('items', { count: 0 })}</Text> // "No items"
<Text>{t('items', { count: 1 })}</Text> // "1 item"
<Text>{t('items', { count: 5 })}</Text> // "5 items"
```

### 3. Namespace (Tách theo module)

```tsx
// Cấu hình namespace
resources: {
  en: {
    common: { ... },
    auth: { ... },
    settings: { ... }
  }
}

// Sử dụng
<Text>{t('auth:signIn')}</Text>
```

### 4. Formatting ngày/giờ

```tsx
// Sử dụng date-fns hoặc moment.js
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

const formatDate = (date: Date) => {
  const locale = i18n.language === "vi" ? vi : enUS;
  return format(date, "PPP", { locale });
};
```

## Mở rộng

Hệ thống i18next đã sẵn sàng cho các tính năng nâng cao:

1. ✅ **Interpolation** - Chèn biến vào text
2. ✅ **Pluralization** - Hỗ trợ số ít/số nhiều
3. ✅ **Namespace** - Tách translations theo module
4. ✅ **Auto-detection** - Tự động detect ngôn ngữ thiết bị
5. ✅ **Persistence** - Lưu trữ preferences
6. ✅ **Fallback** - Xử lý khi thiếu translation
