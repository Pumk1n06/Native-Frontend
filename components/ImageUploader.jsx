import React, { useState } from 'react';
import { View, Button, Image, Text, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const ImageUploader = ({ onImageUpload }) => {
  const [imageUri, setImageUri] = useState(null);

  const handleSelectImage = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (response && response[0]) {
        const uri = response[0].uri;
        setImageUri(uri);
        uploadImage(uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
      } else {
        console.error('DocumentPicker Error:', err);
        Alert.alert('Error', 'Failed to select image.');
      }
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    const fileUri = uri.replace('file://', ''); // Adjust for file URIs
    const fileName = uri.split('/').pop(); // Extract file name from URI
    formData.append('image', {
      uri: fileUri,
      type: 'image/jpeg',
      name: fileName || `image-${Date.now()}.jpg`,
    });

    try {
      const response = await axios.post('http://localhost:5000/api/forms/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.imageUrl) {
        onImageUpload(response.data.imageUrl);
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Button title="Upload Image" onPress={handleSelectImage} />
      {imageUri && (
        <View style={{ marginTop: 12 }}>
          <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
          <Text style={{ textAlign: 'center' }}>Image Preview</Text>
        </View>
      )}
    </View>
  );
};

export default ImageUploader;
