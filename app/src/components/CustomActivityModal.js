import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { colors, spacing, borderRadius, textStyles } from "../constants";

const CustomActivityModal = ({ visible, onClose, onSave }) => {
  const [emoji, setEmoji] = useState("");
  const [activityName, setActivityName] = useState("");

  const handleSave = () => {
    if (emoji.trim() && activityName.trim()) {
      onSave({
        icon: emoji.trim(),
        label: activityName.trim(),
      });
      setEmoji("");
      setActivityName("");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Custom Activity</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Activity Emoji</Text>
            <TextInput
              style={styles.emojiInput}
              value={emoji}
              onChangeText={setEmoji}
              placeholder="📱"
              textAlign="center"
              maxLength={2} // Limit to 1-2 emoji characters
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Activity Name</Text>
            <TextInput
              style={styles.nameInput}
              value={activityName}
              onChangeText={setActivityName}
              placeholder="Enter activity name"
              maxLength={20}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={!emoji.trim() || !activityName.trim()}
            >
              <Text style={styles.saveButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 320,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 8,
  },
  emojiInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 40,
    height: 80,
    width: 80,
    alignSelf: "center",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 16,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomActivityModal;
