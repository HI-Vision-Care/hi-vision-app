import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  error?: string;
  confirmMode?: boolean;
  originalPin?: string;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  onComplete,
  onCancel,
  title,
  subtitle,
  error,
  confirmMode = false,
  originalPin,
}) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [showError, setShowError] = useState<string>("");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (error) {
      setShowError(error);
      // Reset PIN khi có lỗi từ bên ngoài
      if (error !== showError) {
        setPin("");
        setConfirmPin("");
        setIsConfirming(false);
        // Focus lại ô đầu tiên
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    }
  }, [error]);

  const handlePinChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, "");
    
    if (!confirmMode || !isConfirming) {
      // Chế độ nhập PIN ban đầu
      const newPin = pin.split("");
      newPin[index] = numericText;
      const updatedPin = newPin.join("").slice(0, length);
      setPin(updatedPin);

      if (numericText && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (updatedPin.length === length) {
        if (confirmMode) {
          setIsConfirming(true);
          setShowError("");
          // Focus vào ô đầu tiên của confirm
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        } else {
          onComplete(updatedPin);
        }
      }
    } else {
      // Chế độ xác nhận PIN
      const newConfirmPin = confirmPin.split("");
      newConfirmPin[index] = numericText;
      const updatedConfirmPin = newConfirmPin.join("").slice(0, length);
      setConfirmPin(updatedConfirmPin);

      if (numericText && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (updatedConfirmPin.length === length) {
        if (updatedConfirmPin === pin) {
          setShowError("");
          onComplete(pin);
        } else {
          setShowError(t("auth.pinNotMatch"));
          setConfirmPin("");
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        }
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      if (!confirmMode || !isConfirming) {
        const newPin = pin.split("");
        if (newPin[index]) {
          newPin[index] = "";
          setPin(newPin.join(""));
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          newPin[index - 1] = "";
          setPin(newPin.join(""));
        }
      } else {
        const newConfirmPin = confirmPin.split("");
        if (newConfirmPin[index]) {
          newConfirmPin[index] = "";
          setConfirmPin(newConfirmPin.join(""));
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          newConfirmPin[index - 1] = "";
          setConfirmPin(newConfirmPin.join(""));
        }
      }
    }
  };

  const handleClear = () => {
    if (!confirmMode || !isConfirming) {
      setPin("");
      inputRefs.current[0]?.focus();
    } else {
      setConfirmPin("");
      inputRefs.current[0]?.focus();
    }
    setShowError("");
  };

  const renderPinDots = () => {
    const currentPin = isConfirming ? confirmPin : pin;
    const dots = Array.from({ length }, (_, i) => i);

    return (
      <View style={styles.pinContainer}>
        {dots.map((index) => (
          <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.pinInput}
          value={currentPin[index] || ""}
          onChangeText={(text) => handlePinChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType="number-pad"
          maxLength={1}
          secureTextEntry={true}
          autoFocus={index === 0 && pin.length === 0 && confirmPin.length === 0}
        />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {isConfirming && (
        <Text style={styles.confirmLabel}>
          {t("auth.confirmPin")}
        </Text>
      )}

      {renderPinDots()}

      {(showError || error) && (
        <Text style={styles.errorText}>{showError || error}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
        >
          <Text style={styles.clearButtonText}>{t("common.clear")}</Text>
        </TouchableOpacity>
        
        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  confirmLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  pinInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clearButtonText: {
    color: "#666",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "#ef4444",
    fontSize: 16,
  },
});

