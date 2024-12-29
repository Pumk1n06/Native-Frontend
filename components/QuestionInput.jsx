import React, { useState } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity } from 'react-native';

const QuestionInput = ({ addQuestion }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text'); // Default question type is text
  const [gridRows, setGridRows] = useState([]);
  const [checkboxOptions, setCheckboxOptions] = useState([{ option: '', checked: false }]);

  const handleAddQuestion = () => {
    if (questionText.trim()) {
      const questionData = {
        type: questionType,
        text: questionText,
        gridRows,
        checkboxOptions,
      };
      addQuestion(questionData);

      // Reset form
      setQuestionText('');
      setGridRows([]);
      setCheckboxOptions([{ option: '', checked: false }]);
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
      {checked && (
        <Text style={{ color: '#FFF', fontSize: 16 }}>✓</Text>
      )}
    </TouchableOpacity>
  );

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

      <Button title="Add Question" onPress={handleAddQuestion} />
    </View>
  );
};

export default QuestionInput;
