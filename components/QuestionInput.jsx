import React, { useState } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const QuestionInput = ({ addQuestion }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text'); // Default question type is text
  const [gridRows, setGridRows] = useState([]);
  const [checkboxOptions, setCheckboxOptions] = useState([{ option: '', checked: false }]);
  const [imageUri, setImageUri] = useState(null); // State to store selected image URI

  const handleAddQuestion = () => {
    if (questionText.trim()) {
      const questionData = {
        type: questionType,
        text: questionText,
        gridRows,
        checkboxOptions,
        imageUri, // Include image in the question data
      };
      addQuestion(questionData);

      // Reset form
      setQuestionText('');
      setGridRows([]);
      setCheckboxOptions([{ option: '', checked: false }]);
      setImageUri(null);
    }
  };

  const handleGridRowChange = (index, value) => {
    const newRows = [...gridRows];
    newRows[index] = value;
    setGridRows(newRows);
  };

  const handleCheckboxOptionChange = (index, field, value) => {
    const newOptions = [...checkboxOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setCheckboxOptions(newOptions);
  };

  const toggleCheckbox = (index) => {
    const newOptions = [...checkboxOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setCheckboxOptions(newOptions);
  };

  const CustomCheckbox = ({ checked, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#555',
        backgroundColor: checked ? '#007BFF' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      }}
    >
      {checked && <Text style={{ color: '#FFF', fontSize: 16 }}>✓</Text>}
    </TouchableOpacity>
  );

  const handleSelectImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // Restrict to image files
      });
      setImageUri(res[0].uri); // Set the URI of the selected image
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.log('Unknown error:', err);
      }
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 8 }}>Select Question Type:</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Button title="Text" onPress={() => setQuestionType('text')} />
        <Button title="Grid" onPress={() => setQuestionType('grid')} />
        <Button title="Checkbox" onPress={() => setQuestionType('checkbox')} />
      </View>

      <TextInput
        placeholder="Enter your question"
        value={questionText}
        onChangeText={setQuestionText}
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          paddingHorizontal: 8,
          marginBottom: 12,
        }}
      />

      {/* Conditionally render input fields based on selected question type */}
      {questionType === 'grid' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 8 }}>Enter Grid Rows:</Text>
          {gridRows.map((row, index) => (
            <TextInput
              key={index}
              value={row}
              onChangeText={(text) => handleGridRowChange(index, text)}
              style={{
                height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                paddingHorizontal: 8,
                marginBottom: 6,
              }}
              placeholder={`Row ${index + 1}`}
            />
          ))}
          <Button title="Add Row" onPress={() => setGridRows([...gridRows, ''])} />
        </View>
      )}

      {questionType === 'checkbox' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 8 }}>Enter Checkbox Options:</Text>
          {checkboxOptions.map((optionObj, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <CustomCheckbox
                checked={optionObj.checked}
                onPress={() => toggleCheckbox(index)}
              />
              <TextInput
                value={optionObj.option}
                onChangeText={(text) =>
                  handleCheckboxOptionChange(index, 'option', text)
                }
                style={{
                  height: 40,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  flex: 1,
                  marginLeft: 6,
                  paddingHorizontal: 8,
                }}
                placeholder={`Option ${index + 1}`}
              />
            </View>
          ))}
          <Button
            title="Add Option"
            onPress={() =>
              setCheckboxOptions([...checkboxOptions, { option: '', checked: false }])
            }
          />
        </View>
      )}

      {/* Image picker section */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 8 }}>Add Image (Optional):</Text>
        <Button title="Select Image" onPress={handleSelectImage} />
        {imageUri && (
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
            <Text style={{ marginTop: 4, fontSize: 12, color: '#555' }}>
              Selected Image
            </Text>
          </View>
        )}
      </View>

      <Button title="Add Question" onPress={handleAddQuestion} />
    </View>
  );
};

export default QuestionInput;
