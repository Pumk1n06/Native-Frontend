// PreviewModal.js

import React, { useState } from 'react';
import { Modal, View, Text, Button } from 'react-native';
import axios from 'axios';

const PreviewModal = ({ visible, onClose, formData }) => {
  const [saving, setSaving] = useState(false);

  const saveForm = async () => {
    setSaving(true);
    try {
      const response = await axios.post('http://localhost:5000/api/forms/create', formData);
      console.log('Form saved:', response.data);
      onClose();
    } catch (error) {
      console.error('Error saving form:', error);
    }
    setSaving(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24 }}>Form Preview</Text>
        <Text style={{ marginBottom: 12 }}>{formData.title}</Text>
        {formData.headerImage && (
          <Image source={{ uri: formData.headerImage }} style={{ width: 200, height: 200 }} />
        )}
        <Text style={{ marginVertical: 20 }}>Questions:</Text>
        {formData.questions.map((question, index) => (
          <Text key={index}>{question.text}</Text>
        ))}
        <Button title={saving ? 'Saving...' : 'Save Form'} onPress={saveForm} disabled={saving} />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default PreviewModal;
