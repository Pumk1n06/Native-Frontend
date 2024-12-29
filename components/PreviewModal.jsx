import React, { useState } from 'react';
import { Modal, View, Text, Button, Image, ScrollView, TextInput, CheckBox, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PreviewModal = ({ visible, onClose, formData, isPreviewMode }) => {
  const [saving, setSaving] = useState(false);
  const [userResponses, setUserResponses] = useState({});

  // Handle user input (for fill functionality)
  const handleInputChange = (questionId, value) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle checkbox selection (for checkbox options)
  const handleCheckboxChange = (questionId, optionText) => {
    setUserResponses((prev) => {
      const currentAnswers = prev[questionId] || [];
      const updatedAnswers = currentAnswers.includes(optionText)
        ? currentAnswers.filter((answer) => answer !== optionText)
        : [...currentAnswers, optionText];
      return { ...prev, [questionId]: updatedAnswers };
    });
  };

  // Save the form data
  const saveForm = async () => {
    setSaving(true);
    try {
      const response = await axios.post('http://localhost:5000/api/forms/create', {
        formData,
        responses: userResponses,
      });
      console.log('Form saved:', response.data);
      onClose();
    } catch (error) {
      console.error('Error saving form:', error);
    }
    setSaving(false);
  };

  // Render row options
  const renderRowOptions = (question, index) => {
    return (
      <View key={index} style={{ marginBottom: 15 }}>
        <Text>{question.text}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {question.options?.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={{
                padding: 10,
                marginRight: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: userResponses[question.id] === option.text ? '#4CAF50' : '#fff',
              }}
              onPress={() => handleInputChange(question.id, option.text)}
            >
              {option.image && (
                <Image source={{ uri: option.image }} style={{ width: 50, height: 50, marginBottom: 8 }} />
              )}
              <Text>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render checkbox options
  const renderCheckboxOptions = (question, index) => {
    return (
      <View key={index} style={{ marginBottom: 15 }}>
        <Text>{question.text}</Text>
        {question.options?.map((option, optionIndex) => (
          <View key={optionIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <CheckBox
              value={userResponses[question.id]?.includes(option.text)}
              onValueChange={() => handleCheckboxChange(question.id, option.text)}
            />
            <Text>{option.text}</Text>
            {option.image && (
              <Image
                source={{ uri: option.image }}
                style={{ width: 30, height: 30, marginLeft: 8 }}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  // Render text input for text-based questions
  const renderTextInput = (question, index) => {
    return (
      <View key={index} style={{ marginBottom: 15 }}>
        <Text>{question.text}</Text>
        {isPreviewMode ? (
          <Text>{userResponses[question.id] || 'No response'}</Text>
        ) : (
          <TextInput
            placeholder="Your answer"
            value={userResponses[question.id] || ''}
            onChangeText={(text) => handleInputChange(question.id, text)}
            style={{
              borderWidth: 1,
              padding: 8,
              marginTop: 8,
              borderRadius: 5,
              borderColor: '#ccc',
            }}
          />
        )}
      </View>
    );
  };

  // Check if formData and questions exist before rendering
  if (!formData || !Array.isArray(formData.questions) || formData.questions.length === 0) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={{ padding: 20 }}>
          <Text>Invalid form data or no questions available</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24 }}>Form Preview</Text>
        <Text style={{ marginBottom: 12 }}>{formData.title}</Text>
        {formData.headerImage && (
          <Image
            source={{ uri: formData.headerImage }}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />
        )}
        <Text style={{ marginVertical: 20 }}>Questions:</Text>
        {formData.questions?.map((question, index) => {
          switch (question.type) {
            case 'row':
              return renderRowOptions(question, index);
            case 'checkbox':
              return renderCheckboxOptions(question, index);
            case 'text':
              return renderTextInput(question, index);
            default:
              return (
                <View key={index} style={{ marginBottom: 15 }}>
                  <Text>{question.text}</Text>
                </View>
              );
          }
        })}
        {!isPreviewMode && (
          <Button title={saving ? 'Saving...' : 'Save Form'} onPress={saveForm} disabled={saving} />
        )}
        <Button title="Close" onPress={onClose} />
      </ScrollView>
    </Modal>
  );
};

export default PreviewModal;
