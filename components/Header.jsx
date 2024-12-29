// HeaderQuestionInput.js

import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import ImageUploader from './ImageUploader';

const HeaderQuestionInput = ({ onHeaderSave }) => {
  const [title, setTitle] = useState('');
  const [headerImage, setHeaderImage] = useState(null);

  const handleSave = () => {
    if (title || headerImage) {
      onHeaderSave({ title, headerImage });
    } else {
      alert('Please fill in both title and header image.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter Form Title"
        value={title}
        onChangeText={setTitle}
        style={{ height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12 }}
      />
      <ImageUploader onImageUpload={setHeaderImage} />
      <Button title="Save Header" onPress={handleSave} />
    </View>
  );
};

export default HeaderQuestionInput;
