// FormBuilder.js

import React, { useState } from 'react';
import { ScrollView, Button } from 'react-native';
import HeaderQuestionInput from './HeaderQuestionInput';
import QuestionInput from './QuestionInput'; // Assuming you already have this component
import PreviewModal from './PreviewModal';

const FormBuilder = () => {
  const [formData, setFormData] = useState({
    title: '',
    headerImage: '',
    questions: [],
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleHeaderSave = (header) => {
    setFormData((prevData) => ({
      ...prevData,
      title: header.title,
      headerImage: header.headerImage,
    }));
  };

  const handleAddQuestion = (question) => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, question],
    }));
  };

  const handlePreview = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HeaderQuestionInput onHeaderSave={handleHeaderSave} />
      <QuestionInput onQuestionSave={handleAddQuestion} />
      <Button title="Preview Form" onPress={handlePreview} />
      <PreviewModal
        visible={modalVisible}
        onClose={handleCloseModal}
        formData={formData}
      />
    </ScrollView>
  );
};

export default FormBuilder;
