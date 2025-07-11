import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePatientProfile } from '@/hooks/usePatientId';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookConsultationGuest, bookConsultationWithAccount } from '@/services/consultant/api';
import { ConsultationRequest } from '@/services/consultant/types';

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
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) return false;
    if (!cleanPhone.startsWith('0')) return false;
    return true;
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    if (cleanText.length <= 10) {
      setPhoneNumber(cleanText);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0');
      return;
    }

    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }

    if (!note.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn dịch vụ');
      return;
    }

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
        result = await bookConsultationGuest(consultationData);
      } else {
        result = await bookConsultationWithAccount(patientProfile!.patientID, consultationData);
      }

      Alert.alert(
        'Thành công',
        'Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFullName('');
              setPhoneNumber('');
              setNote('');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLiveChat = () => {
    // Navigate to live chat screen
    router.push({
      pathname: '/(root)/(consultant)/chatbox',
      params: { type: 'live-chat' },
    });
  };

  const ConsultationOption = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    backgroundColor, 
    iconColor 
  }: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    backgroundColor: string;
    iconColor: string;
  }) => (
    <TouchableOpacity
      style={[styles.optionCard, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon as any} size={28} color={iconColor} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#64748B" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      {/* Scrollable Content với gradient liền mạch */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header + Hero Section trong cùng một gradient */}
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerHeroGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header nhỏ gọn */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Tư vấn sức khỏe</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroIcon}>
                <Ionicons name="medical" size={40} color="white" />
              </View>
              <Text style={styles.heroTitle}>Tư vấn miễn phí 24/7</Text>
              <Text style={styles.heroSubtitle}>
                Đội ngũ chuyên gia y tế sẵn sàng hỗ trợ bạn{'\n'}
                Thông tin được bảo mật tuyệt đối
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Consultation Options */}
          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>Chọn hình thức tư vấn</Text>
            
            <ConsultationOption
              icon="call"
              title="Đặt lịch gọi lại"
              subtitle="Chuyên gia sẽ gọi lại trong 30 phút"
              onPress={() => {}}
              backgroundColor="#F0FDF4"
              iconColor="#10B981"
            />

            <ConsultationOption
              icon="chatbubbles"
              title="Chat trực tiếp"
              subtitle="Nhận tư vấn ngay lập tức qua chat"
              onPress={handleLiveChat}
              backgroundColor="#EFF6FF"
              iconColor="#3B82F6"
            />

            <ConsultationOption
              icon="videocam"
              title="Tư vấn video"
              subtitle="Gặp mặt trực tiếp qua video call"
              onPress={() => {}}
              backgroundColor="#FEF3C7"
              iconColor="#F59E0B"
            />
          </View>

          {/* Quick Booking Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Đặt lịch nhanh</Text>
            
            {/* Anonymous Switch */}
            <View style={styles.switchContainer}>
              <View style={styles.switchInfo}>
                <Ionicons name="shield-checkmark" size={20} color="#64748B" />
                <Text style={styles.switchLabel}>Đặt lịch ẩn danh</Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Account Info */}
            {!isAnonymous && patientProfile && (
              <View style={styles.accountInfo}>
                <Ionicons name="person-circle" size={20} color="#3B82F6" />
                <Text style={styles.accountInfoText}>
                  Đặt lịch với tài khoản: {patientProfile.name || 'Người dùng'}
                </Text>
              </View>
            )}

            {/* Form Inputs */}
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  phoneNumber && !validatePhoneNumber(phoneNumber) && styles.inputError
                ]}
                placeholder="Số điện thoại"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="numeric"
                maxLength={10}
                editable={!isSubmitting}
              />
            </View>

            {phoneNumber && !validatePhoneNumber(phoneNumber) && (
              <Text style={styles.errorText}>
                Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0
              </Text>
            )}

            {/* Service Picker */}
            <View style={styles.pickerContainer}>
              <Ionicons name="medical" size={20} color="#64748B" style={styles.inputIcon} />
              <Picker
                selectedValue={note}
                onValueChange={setNote}
                style={styles.picker}
                enabled={!isSubmitting}
              >
                <Picker.Item label="Chọn dịch vụ" value="" color="#9CA3AF" />
                <Picker.Item label="Xét nghiệm tổng quát" value="general" />
                <Picker.Item label="Cần tư vấn thuốc" value="tu_van_thuoc" />
                <Picker.Item label="Tư vấn xét nghiệm" value="tu_van_xet_nghiem" />
                <Picker.Item label="Lấy mẫu xét nghiệm tại nhà" value="lay_mau_xet_nghiem_tai_nha" />
                <Picker.Item label="Dịch vụ khác" value="other" />
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
                {isSubmitting ? 'ĐANG GỬI...' : 'ĐẶT LỊCH TƯ VẤN'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Support Info */}
          <View style={styles.supportInfo}>
            <View style={styles.supportItem}>
              <Ionicons name="time" size={20} color="#10B981" />
              <Text style={styles.supportText}>Hỗ trợ 24/7</Text>
            </View>
            <View style={styles.supportItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.supportText}>Bảo mật tuyệt đối</Text>
            </View>
            <View style={styles.supportItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.supportText}>Miễn phí tư vấn</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  // Header và Hero trong cùng một gradient
  headerHeroGradient: {
    paddingBottom: 0,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  // Header nhỏ gọn hơn
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10, // Giảm từ 20 xuống 10
    paddingBottom: 5, // Giảm từ 15 xuống 5
  },
  backButton: {
    width: 36, // Giảm từ 40 xuống 36
    height: 36, // Giảm từ 40 xuống 36
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18, // Giảm từ 20 xuống 18
    fontWeight: '600', // Giảm từ bold xuống 600
    color: 'white',
  },
  placeholder: {
    width: 36, // Giảm từ 40 xuống 36
  },
  // Hero section với khoảng cách nhỏ hơn
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15, // Giảm từ 30 xuống 15
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  accountInfoText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  supportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supportItem: {
    alignItems: 'center',
  },
  supportText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
});