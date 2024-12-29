import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Button, View, Text, Alert } from 'react-native';
import HeaderQuestionInput from './components/Header';
import QuestionInput from './components/QuestionInput'; // Assuming this component is already implemented
import PreviewModal from './components/PreviewModal';

const App = () => {
  const [formData, setFormData] = useState({
    title: '',
    headerImage: '',
    questions: [],
  });
  const [modalVisible, setModalVisible] = useState(false);

  // Save header data (title and header image URL)
  const handleHeaderSave = (header) => {
    if (!header.title) {
      Alert.alert('Error', 'Title is required!');
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      title: header.title,
      headerImage: header.headerImage,
    }));
  };

  // Save question data
  const handleAddQuestion = (question) => {
    if (!question.text.trim()) {
      Alert.alert('Error', 'Question text cannot be empty!');
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, question],
    }));
  };

  // Open the preview modal
  const handlePreview = () => {
    if (!formData.title || formData.questions.length === 0) {
      Alert.alert('Error', 'Form must have a title and at least one question!');
      return;
    }
    setModalVisible(true);
  };

  // Close the preview modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Handle saving the form to the backend
  const handleSaveForm = async () => {
    if (!formData.title || formData.questions.length === 0) {
      Alert.alert('Error', 'Form must have a title and at least one question to save!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/forms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form saved:', result);
        Alert.alert('Success', 'Form saved successfully');
        setFormData({ title: '', headerImage: '', questions: [] }); // Reset form after saving
      } else {
        Alert.alert('Error', 'Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      Alert.alert('Error', 'An error occurred while saving the form');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Create Form</Text>

        {/* Header Input */}
        <HeaderQuestionInput onHeaderSave={handleHeaderSave} />

        {/* Question Input */}
        <QuestionInput addQuestion={handleAddQuestion} />

        {/* Button to preview the form */}
        <View style={{ marginVertical: 10 }}>
          <Button title="Preview Form" onPress={handlePreview} />
        </View>

        {/* Button to save the form */}
        <View style={{ marginVertical: 10 }}>
          <Button
            title="Save Form"
            onPress={handleSaveForm}
            disabled={formData.questions.length === 0 || !formData.title}
          />
        </View>

        {/* Preview Modal */}
        <PreviewModal
          visible={modalVisible}
          onClose={handleCloseModal}
          formData={formData}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
