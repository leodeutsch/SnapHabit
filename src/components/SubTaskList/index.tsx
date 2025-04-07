import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useRef, useState } from 'react'
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native'
import { Checkbox, IconButton, Text } from 'react-native-paper'
import { useTheme } from '../../hooks/useTheme'
import { subTaskListStyles } from './styles'

interface SubTask {
  id: string
  text: string
  completed: boolean
}

interface SubTaskListProps {
  subTasks: SubTask[]
  onSubTasksChange: (subTasks: SubTask[]) => void
}

export const SubTaskList: React.FC<SubTaskListProps> = ({
  subTasks,
  onSubTasksChange,
}) => {
  const { theme } = useTheme()
  const styles = subTaskListStyles(theme)
  const [newSubTaskText, setNewSubTaskText] = useState('')
  const newInputRef = useRef<TextInput>(null)
  const subTaskRefs = useRef<{ [key: string]: TextInput | null }>({})
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null)

  const addSubTask = (text: string = '') => {
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    }

    onSubTasksChange([...subTasks, newSubTask])
    setNewSubTaskText('')

    setTimeout(() => {
      if (subTaskRefs.current[newSubTask.id]) {
        subTaskRefs.current[newSubTask.id]?.focus()
        setCurrentlyEditing(newSubTask.id)
      }
    }, 50)
  }

  const updateSubTask = (id: string, text: string) => {
    onSubTasksChange(
      subTasks.map((task) => (task.id === id ? { ...task, text } : task)),
    )
  }

  const toggleSubTask = (id: string) => {
    onSubTasksChange(
      subTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteSubTask = (id: string, index: number) => {
    onSubTasksChange(subTasks.filter((task) => task.id !== id))

    if (index > 0) {
      setTimeout(() => {
        const prevId = subTasks[index - 1]?.id
        if (prevId && subTaskRefs.current[prevId]) {
          subTaskRefs.current[prevId]?.focus()
          setCurrentlyEditing(prevId)
        }
      }, 50)
    }
  }

  const handleKeyPress = (e: any, id: string, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !subTasks[index].text) {
      deleteSubTask(id, index)
      e.preventDefault?.()
    }
  }

  const renderSubTask = ({ item, index }: { item: SubTask; index: number }) => (
    <View style={styles.subTaskRow}>
      <Checkbox
        status={item.completed ? 'checked' : 'unchecked'}
        onPress={() => toggleSubTask(item.id)}
        color={theme.colors.primary}
      />
      <TextInput
        ref={(ref) => (subTaskRefs.current[item.id] = ref)}
        style={[styles.subTaskInput, item.completed && styles.completedSubTask]}
        value={item.text}
        onChangeText={(text) => updateSubTask(item.id, text)}
        onFocus={() => setCurrentlyEditing(item.id)}
        onKeyPress={(e) => handleKeyPress(e, item.id, index)}
        placeholder="Task item..."
        placeholderTextColor={theme.colors.outline}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          if (item.text.trim()) {
            addSubTask()
          }
        }}
      />
      <IconButton
        icon="close"
        size={16}
        iconColor={theme.colors.error}
        onPress={() => deleteSubTask(item.id, index)}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={subTasks}
        renderItem={renderSubTask}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        style={styles.list}
        keyboardShouldPersistTaps="always"
      />

      {subTasks.length === 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addSubTask()}
        >
          <MaterialIcons
            name="add"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.addButtonText}>Add subtask</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
