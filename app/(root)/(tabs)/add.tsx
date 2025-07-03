import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ConsultationRequest } from '@/types/type';
import { usePatientProfile } from '@/hooks/usePatientId';
import { bookConsultationGuest, bookConsultationWithAccount } from '@/services/consultant/consultant';

export default function ConsultationForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get patient profile for authenticated booking
  const { data: patientProfile } = usePatientProfile();

  // Phone number validation function
  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');

    // Check if it's exactly 10 digits
    if (cleanPhone.length !== 10) {
      return false;
    }

    // Check if it starts with 0 (Vietnamese phone number format)
    if (!cleanPhone.startsWith('0')) {
      return false;
    }

    return true;
  };

  // Format phone number input (optional - for better UX)
  const handlePhoneNumberChange = (text: string) => {
    // Only allow digits
    const cleanText = text.replace(/\D/g, '');

    // Limit to 10 digits
    if (cleanText.length <= 10) {
      setPhoneNumber(cleanText);
    }
  };

  const handleSubmit = async () => {
    // Validation for phone number
    if (!phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        'Lỗi',
        'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0'
      );
      return;
    }

    // Validation for full name
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }

    // Validation for service selection
    if (!note.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn dịch vụ');
      return;
    }

    // Check if user is trying to book with account but no patient profile
    if (!isAnonymous && !patientProfile?.patientID) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại hoặc chọn đặt lịch ẩn danh.');
      return;
    }

    setIsSubmitting(true);

    try {
      const consultationData: ConsultationRequest = {
        phone: phoneNumber.trim(),
        name: fullName.trim(),
        note: note,
      };

      let result;

      if (isAnonymous) {
        // Book as guest
        result = await bookConsultationGuest(consultationData);
      } else {
        // Book with account
        result = await bookConsultationWithAccount(
          patientProfile!.patientID,
          consultationData
        );
      }

      Alert.alert(
        'Thành công',
        'Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFullName('');
              setPhoneNumber('');
              setNote('');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Lỗi',
        'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceLabel = (value: string) => {
    const services = {
      general: 'Xét nghiệm tổng quát',
      tu_van_thuoc: 'Cần tư vấn thuốc',
      tu_van_xet_nghiem: 'Tư vấn xét nghiệm',
      lay_mau_xet_nghiem_tai_nha: 'Lấy mẫu xét nghiệm tại nhà',
      other: 'Dịch vụ khác',
    };
    return services[value as keyof typeof services] || value;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6366f1', '#3b82f6', '#2563eb']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tư vấn miễn phí!</Text>
            <View style={styles.underline} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Tất cả thông tin y tế của Khách hàng đều{'\n'}
            được bảo mật tuyệt đối, riêng tư
          </Text>

          {/* Anonymous Switch */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Đặt lịch ẩn danh</Text>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: '#767577', true: '#f97316' }}
              thumbColor={isAnonymous ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          {/* Account Info Display */}
          {!isAnonymous && patientProfile && (
            <View style={styles.accountInfo}>
              <Text style={styles.accountInfoText}>
                Đặt lịch với tài khoản: {patientProfile.name || 'Người dùng'}
              </Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              placeholderTextColor="#9ca3af"
              value={fullName}
              onChangeText={setFullName}
              editable={!isSubmitting}
            />

            {/* Phone Number Input */}
            <TextInput
              style={[
                styles.input,
                phoneNumber && !validatePhoneNumber(phoneNumber) && styles.inputError
              ]}
              placeholder="Số điện thoại"
              placeholderTextColor="#9ca3af"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="numeric"
              maxLength={10}
              editable={!isSubmitting}
            />

            {/* Phone validation message */}
            {phoneNumber && !validatePhoneNumber(phoneNumber) && (
              <Text style={styles.errorText}>
                Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0
              </Text>
            )}

            {/* Service Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={note}
                onValueChange={setNote}
                style={styles.picker}
                enabled={!isSubmitting}
              >
                <Picker.Item
                  label="Chọn dịch vụ"
                  value=""
                  color="#9ca3af"
                />
                <Picker.Item
                  label="Xét nghiệm tổng quát"
                  value="general"
                />
                <Picker.Item
                  label="Cần tư vấn thuốc"
                  value="tu_van_thuoc"
                />
                <Picker.Item
                  label="Tư vấn xét nghiệm"
                  value="tu_van_xet_nghiem"
                />
                <Picker.Item
                  label="Lấy mẫu xét nghiệm tại nhà"
                  value="lay_mau_xet_nghiem_tai_nha"
                />
                <Picker.Item
                  label="Dịch vụ khác"
                  value="other"
                />
              </Picker>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI THÔNG TIN'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  underline: {
    width: 120,
    height: 3,
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
    opacity: 0.9,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  switchLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  accountInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  accountInfoText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#fecaca',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 20,
    marginTop: -5,
  },
  noteInput: {
    minHeight: 80,
    paddingTop: 15,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#f97316',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 1,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});