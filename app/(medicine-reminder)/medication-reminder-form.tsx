import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type RegimenType = 'Daily PrEP' | 'On-demand (2-1-1)';

interface DailySchedule {
  date: Date;
  time: Date;
  pills: number;
  note: string;
}

interface OnDemandSchedule {
  eventDate: Date;
  preHours: number;
  schedules: {
    dose1: { date: Date; pills: number; note: string }; // Before event
    dose2: { date: Date; pills: number; note: string }; // 24h after
    dose3: { date: Date; pills: number; note: string }; // 48h after
  };
}

export default function MedicationReminderForm() {
  const insets = useSafeAreaInsets();
  const [regimen, setRegimen] = useState<RegimenType>('Daily PrEP');

  // Daily PrEP state
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [dailyTime, setDailyTime] = useState<Date>(new Date());
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false);
  const [days, setDays] = useState<string>('30');

  // On-demand state
  const [eventDateTime, setEventDateTime] = useState<Date>(new Date());
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [preHours, setPreHours] = useState<string>('2');

  // Common
  const [notes, setNotes] = useState<string>('');

  const onChangeStartDate = (event: DateTimePickerEvent, selected?: Date) => {
    const currentDate = selected || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeDailyTime = (event: DateTimePickerEvent, selected?: Date) => {
    const currentTime = selected || dailyTime;
    setShowDailyTimePicker(Platform.OS === 'ios');
    setDailyTime(currentTime);
  };

  const onChangeEventDateTime = (event: DateTimePickerEvent, selected?: Date) => {
    const currentDateTime = selected || eventDateTime;
    setShowEventPicker(Platform.OS === 'ios');
    setEventDateTime(currentDateTime);
  };

  const showStartDatePickerHandler = () => {
    setShowStartDatePicker(true);
  };

  const showDailyTimePickerHandler = () => {
    setShowDailyTimePicker(true);
  };

  const showEventPickerHandler = () => {
    setShowEventPicker(true);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('vi-VN');
  };

  const generateDailySchedule = (): DailySchedule[] => {
    const totalDays = parseInt(days, 10);
    const schedules: DailySchedule[] = [];
    
    for (let i = 0; i < totalDays; i++) {
      const scheduleDate = new Date(startDate);
      scheduleDate.setDate(startDate.getDate() + i);
      
      const scheduleTime = new Date(scheduleDate);
      scheduleTime.setHours(dailyTime.getHours(), dailyTime.getMinutes(), 0, 0);
      
      schedules.push({
        date: scheduleDate,
        time: scheduleTime,
        pills: 1,
        note: `Ngày ${i + 1}/${totalDays} - Daily PrEP`
      });
    }
    
    return schedules;
  };

  const generateOnDemandSchedule = (): OnDemandSchedule => {
    const preHoursNum = parseInt(preHours, 10);
    
    // Dose 1: Before event (2 pills)
    const dose1Date = new Date(eventDateTime);
    dose1Date.setHours(dose1Date.getHours() - preHoursNum);
    
    // Dose 2: 24 hours after event (1 pill)
    const dose2Date = new Date(eventDateTime);
    dose2Date.setHours(dose2Date.getHours() + 24);
    
    // Dose 3: 48 hours after event (1 pill)
    const dose3Date = new Date(eventDateTime);
    dose3Date.setHours(dose3Date.getHours() + 48);
    
    return {
      eventDate: eventDateTime,
      preHours: preHoursNum,
      schedules: {
        dose1: {
          date: dose1Date,
          pills: 2,
          note: `Liều trước sự kiện (${preHoursNum}h trước)`
        },
        dose2: {
          date: dose2Date,
          pills: 1,
          note: 'Liều sau 24h'
        },
        dose3: {
          date: dose3Date,
          pills: 1,
          note: 'Liều sau 48h'
        }
      }
    };
  };

  const scheduleNotifications = () => {
    if (regimen === 'Daily PrEP') {
      const totalDays = parseInt(days, 10);
      if (isNaN(totalDays) || totalDays < 1) {
        Alert.alert('Lỗi', 'Số ngày phải là số dương');
        return;
      }
      
      const schedule = generateDailySchedule();
      
      Alert.alert(
        'Đã lên lịch Daily PrEP',
        `Bắt đầu: ${formatDate(startDate)} lúc ${formatTime(dailyTime)}\n` +
        `Thời gian: ${totalDays} ngày\n` +
        `Tổng cộng: ${totalDays} liều (1 viên/ngày)`,
        [
          {
            text: 'Xem chi tiết',
            onPress: () => {
              const details = schedule.slice(0, 3).map((s, i) => 
                `${i + 1}. ${formatDateTime(s.time)} - ${s.pills} viên`
              ).join('\n');
              Alert.alert('Chi tiết lịch uống (3 ngày đầu)', details);
            }
          },
          { text: 'OK' }
        ]
      );
    } else {
      const preHoursNum = parseInt(preHours, 10);
      if (isNaN(preHoursNum) || preHoursNum < 1) {
        Alert.alert('Lỗi', 'Số giờ nhắc trước phải là số dương');
        return;
      }
      
      const schedule = generateOnDemandSchedule();
      
      Alert.alert(
        'Đã lên lịch On-demand (2-1-1)',
        `Sự kiện: ${formatDateTime(eventDateTime)}\n\n` +
        `Liều 1: ${formatDateTime(schedule.schedules.dose1.date)} - 2 viên\n` +
        `Liều 2: ${formatDateTime(schedule.schedules.dose2.date)} - 1 viên\n` +
        `Liều 3: ${formatDateTime(schedule.schedules.dose3.date)} - 1 viên\n\n` +
        `Tổng cộng: 4 viên`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo lịch nhắc PrEP</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Regimen Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Chế độ PrEP:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={regimen}
              onValueChange={(v) => setRegimen(v as RegimenType)}
              style={styles.picker}
            >
              <Picker.Item label="Daily PrEP (Hàng ngày)" value="Daily PrEP" />
              <Picker.Item label="On-demand (2-1-1)" value="On-demand (2-1-1)" />
            </Picker>
          </View>
        </View>

        {regimen === 'Daily PrEP' ? (
          <>
            {/* Start Date */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ngày bắt đầu:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={showStartDatePickerHandler}
              >
                <Text style={styles.dateText}>📅 {formatDate(startDate)}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  testID="startDatePicker"
                  value={startDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeStartDate}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Daily Time */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Giờ uống hàng ngày:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={showDailyTimePickerHandler}
              >
                <Text style={styles.dateText}>⏰ {formatTime(dailyTime)}</Text>
              </TouchableOpacity>
              {showDailyTimePicker && (
                <DateTimePicker
                  testID="dailyTimePicker"
                  value={dailyTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDailyTime}
                />
              )}
            </View>

            {/* Duration in days */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Số ngày uống:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={days}
                onChangeText={setDays}
                placeholder="30"
              />
              <Text style={styles.helperText}>Nhắc 1 lần/ngày, 1 viên/lần</Text>
            </View>
          </>
        ) : (
          <>
            {/* Event DateTime */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ngày giờ sự kiện:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={showEventPickerHandler}
              >
                <Text style={styles.dateText}>📅⏰ {formatDateTime(eventDateTime)}</Text>
              </TouchableOpacity>
              {showEventPicker && (
                <DateTimePicker
                  testID="eventDateTimePicker"
                  value={eventDateTime}
                  mode="datetime"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeEventDateTime}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Pre-hours */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nhắc trước sự kiện (giờ):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={preHours}
                onChangeText={setPreHours}
                placeholder="2"
              />
              <Text style={styles.helperText}>Tối thiểu 1 giờ trước sự kiện</Text>
            </View>

            {/* Schedule Preview */}
            <View style={styles.schedulePreview}>
              <Text style={styles.scheduleTitle}>Lịch uống tự động:</Text>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleText}>🔴 Liều 1: 2 viên trước sự kiện</Text>
                <Text style={styles.scheduleSubText}>
                  {preHours && !isNaN(parseInt(preHours)) ? 
                    formatDateTime(new Date(eventDateTime.getTime() - parseInt(preHours) * 60 * 60 * 1000)) :
                    'Chưa xác định'
                  }
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleText}>🟡 Liều 2: 1 viên sau 24 giờ</Text>
                <Text style={styles.scheduleSubText}>
                  {formatDateTime(new Date(eventDateTime.getTime() + 24 * 60 * 60 * 1000))}
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleText}>🟢 Liều 3: 1 viên sau 48 giờ</Text>
                <Text style={styles.scheduleSubText}>
                  {formatDateTime(new Date(eventDateTime.getTime() + 48 * 60 * 60 * 1000))}
                </Text>
              </View>
              <Text style={styles.totalText}>Tổng cộng: 4 viên</Text>
            </View>
          </>
        )}

        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ghi chú:</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú (tuỳ chọn)"
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={scheduleNotifications}>
          <Text style={styles.buttonText}>Lưu & Kích hoạt nhắc nhở</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 39,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  schedulePreview: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  scheduleItem: {
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  scheduleSubText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 16,
    marginTop: 2,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4285F4',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});