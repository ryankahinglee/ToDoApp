import { NavigationContainer, useFocusEffect} from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Modal, TextInput, ScrollView, Switch, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressChart } from 'react-native-chart-kit';

export default function App() {

  // Unique key
  const uniqueListKey = "@ListItem:"
  // Navigator 
  const Tab = createBottomTabNavigator();

  // Global UseStates
  const [modalVisible, setModalVisible] = useState(false);
  const [listItems, setListItems] = useState(new Map());
  const [renderListItems, setRenderItems] = useState([]);
  const [screen, setScreen] = useState('Home')

  // Functions
  // Switch the modal visiblity
  const addModalOpen = () => {
    setModalVisible(!modalVisible)
  };

  // Save item from storage
  const saveTask = async (key, json) => {
    try {
      await AsyncStorage.setItem(uniqueListKey + key, json);
      console.log('Data saved to AsyncStorage.');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Get item from storage
  const updateTask = async (key, jsonObject) => {
    const asyncData = await AsyncStorage.getItem(uniqueListKey + key);
    if (asyncData) {
      const parsedData = JSON.parse(asyncData);
      parsedData.title = jsonObject.title;
      parsedData.description = jsonObject.description;
      parsedData.isComplete = jsonObject.isComplete;
      parsedData.isFlagged = jsonObject.isFlagged;
      parsedData.image = jsonObject.image;
      parsedData.priority = jsonObject.priority;
      const updatedData = JSON.stringify(parsedData);
      await saveTask(key, updatedData);
    }
  };

  // Delete item from storage
  const deleteItemFromStorage = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Deleted item with key: ${key}`);
      // Updating local storage
      let newMap = new Map(listItems);
      newMap.delete(key);
      setListItems(newMap);
    } catch (error) {
      console.error(`Error deleting item with key ${key}:`, error);
    }
  };

  // Use effect
  useEffect(() => {
    const newElements = Array.from(listItems, ([key, value]) => {
      const parsedData = JSON.parse(value)
      if (screen == "Home" && !parsedData.isComplete) {
        return (
          <ListItem key={key} itemKey={key} value={parsedData} isComplete={false}/>
        )  
      } else if (screen == "Completed" && parsedData.isComplete) {
        return (
          <ListItem key={key} itemKey={key} value={parsedData} isComplete={true}/>
        )  
      } else if (screen == "Flagged" && parsedData.isFlagged) {
        return (
          <ListItem key={key} itemKey={key} value={parsedData} isComplete={parsedData.isComplete}/>
        )  
      }
      return null
    });
    const filteredElements = newElements.filter(item => item !== null);
    setRenderItems(filteredElements);
  }, [listItems, screen]);

  // Retrieve async storage at start of app
  useEffect(() => {
    const retrieveAsyncStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const filteredKeys = keys.filter(key => key.startsWith('@ListItem'));
        const keyValuePairs = await AsyncStorage.multiGet(filteredKeys);
        const newMap = new Map(listItems);
        keyValuePairs.forEach(([key, value]) => {
          newMap.set(key, value);
        });
        setListItems(newMap);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    }
    retrieveAsyncStorage();
  }, [])

  // UseFocusEffect on Screen
  const setScreenFocus = (screenValue) => {
    useFocusEffect(
      useCallback(() => {
        setScreen(screenValue);
      }, [])
    );
  }
  // Components

  // Task component
  function ListItem({ itemKey, value, isComplete}) {
    const [isSelected, setCompletion] = useState(isComplete);
    const [itemModal, setItemModal] = useState(false);
    const [title, setTitle] = useState(value.title);
    const [description, setDescription] = useState(value.description);
    const [isFlagged, setFlagged] = useState(value.isFlagged);
    const [image, setImage] = useState(value.image);
    const [priority, setPriority] = useState(value.priority);

    // Original
    const [originalState, setOriginalState] = useState({
      isSelected: isComplete,
      title: value.title,
      description: value.description,
      isFlagged: value.isFlagged,
      image: value.image,
      priority: value.priority,
    });

    return (<>
      <Modal visible={itemModal}
        animationType="slide"
        transparent={true}
      >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Task details</Text>

              <View style={styles.textInputContainer}>
                <Text>Title</Text>
                <TextInput
                  onChangeText={newTitle => {
                    setTitle(newTitle)
                  }}
                  defaultValue={title}
                  style={styles.inputText}
                />
              </View>
              <View style={styles.textInputContainer}>
                <Text>Description</Text>
                <TextInput
                  onChangeText={newDescription => {
                    setDescription(newDescription)
                  }}
                  defaultValue={description}
                  style={[styles.inputText, {height: 50}]}
                  multiline={true}
                />
              </View>
              <View style={styles.textInputContainer}>
                <Text>Flagged</Text>
                <View style={styles.switchContainer}>
                  <Text>Off</Text>
                  <Switch
                    style={styles.checkBox}
                    value={isFlagged}
                    onValueChange={(newValue) => {
                      setFlagged(newValue);
                    }}
                    trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                    thumbColor={'#189AB4'} 
                  />
                  <Text>On</Text>
                </View>
              </View>
              <View style={styles.textInputContainer}>
                <Text>Priority</Text>
                <View style={styles.switchContainer}>
                  <View style={styles.prioritySwitchContainer}>
                    <Text>Low</Text>
                    <Switch
                      style={styles.checkBox}
                      value={priority == "Low"}
                      onValueChange={(newValue) => {
                        setPriority(newValue ? 'Low' : 'High');
                      }}
                      trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                      thumbColor={'#189AB4'} 
                    />
                  </View>
                  <View style={styles.prioritySwitchContainer}>
                    <Text>Medium</Text>
                    <Switch
                      style={styles.checkBox}
                      value={priority == "Medium"}
                      onValueChange={(newValue) => {
                        setPriority(newValue ? 'Medium' : 'Low');
                      }}
                      trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                      thumbColor={'#189AB4'} 
                    />
                  </View>
                  <View style={styles.prioritySwitchContainer}>
                    <Text>High</Text>
                    <Switch
                      style={styles.checkBox}
                      value={priority == "High"}
                      onValueChange={(newValue) => {
                        setPriority(newValue ? 'High' : 'Low');
                      }}
                      trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                      thumbColor={'#189AB4'} 
                    />
                    </View>
                </View>
              </View>
              <View style={styles.textInputContainer}>
                <Text>Image</Text>
                <TextInput
                  onChangeText={newImage => setImage(newImage)}
                  defaultValue={image}
                  style={styles.inputText}
                />
              </View>
              {image !== '' && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 150, height: 150}}
              />
              )}
              <View style={styles.itemControls}>
                <Pressable
                  style={[styles.button, { width: '100px' }]}
                  onPress={() => {
                    const jsonObject = {
                      title: title,
                      description: description,
                      isComplete: isSelected,
                      isFlagged: isFlagged,
                      image: image,
                      priority: priority,
                    };
                    let defaultKey = itemKey.replace(/^@ListItem:/, '');
                    updateTask(defaultKey, jsonObject);

                    let newMap = new Map(listItems);
                    newMap.set(itemKey, JSON.stringify(jsonObject));
                    setListItems(newMap);
                  }}
                >
                  <Text>Save changes</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { width: '100px' }]}
                  onPress={() => {
                    deleteItemFromStorage(itemKey);
                    setItemModal(false);
                  }}
                >
                  <Text>Delete</Text>
                </Pressable>
              </View>
              <Pressable style={styles.button} onPress={() => {
                setItemModal(false)
                setCompletion(originalState.isSelected);
                setTitle(originalState.title);
                setDescription(originalState.description);
                setFlagged(originalState.isFlagged);
                setImage(originalState.image);
                setPriority(originalState.priority);
              }}
              >
                <Text style={styles.textStyle}>Back</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      <View style={styles.item}>
        <View style={styles.textView}>
          <Text style={[styles.itemText, { fontSize: '20px' }]} numberOfLines={1}>
            {value.title}
          </Text>
          <Text style={[styles.itemText, { fontSize: '14px', color: '#D4F1F4', fontWeight: 600}]} numberOfLines={1}>
            {priority} priority
          </Text>
          <Text style={styles.itemText} numberOfLines={2}>
            {value.description}
          </Text>
        </View>
        <View style={styles.itemControls}>
          <Pressable
              style={[styles.button, { width: '50px', borderRadius: '30px'}]}
              onPress={() => {
                setItemModal(true)
                
                // Get most recent version
                let newMap = new Map(listItems);
                const value = JSON.parse(newMap.get(itemKey));
                setTitle(value.title);
                setDescription(value.description);
              }}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/17/17764.png' }}
                style={styles.iconDot}
              />
          </Pressable>
          <Switch
            style={styles.checkBox}
            value={isSelected}
            onValueChange={(newValue) => {
              setCompletion(newValue);
              setTimeout(() => {
                const jsonObject = {
                  title: title,
                  description: description,
                  isComplete: !isSelected,
                  isFlagged: isFlagged,
                  image: image,
                  priority: priority,
                };
                let defaultKey = itemKey.replace(/^@ListItem:/, '');
                updateTask(defaultKey, jsonObject);
  
                let newMap = new Map(listItems);
                newMap.set(itemKey, JSON.stringify(jsonObject));
                setListItems(newMap);
              }, 200);
            }}
            trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
            thumbColor={'#189AB4'} 
          />
        </View>
      </View>
    </>);
  }

  // Screen Components
  function Home() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);
    const [isFlagged, setFlagged] = useState(false);
    const [image, setImage] = useState('');
    const [priority, setPriority] = useState("Low");
    
    setScreenFocus("Home");
    
    function addTask(title, description, isFlagged, image, priority) {

      const jsonObject = {
        title: title,
        description: description,
        isComplete: false,
        isFlagged: isFlagged,
        image: image,
        priority: priority
      };

      const jsonString = JSON.stringify(jsonObject);
      saveTask(title, jsonString);
      // Add to local storage
      const newMap = new Map(listItems);
      newMap.set(uniqueListKey + title, jsonString);
      setListItems(newMap);

    }

    async function clearAsyncStorage() {
      try {
        await AsyncStorage.clear();
        console.log('Async storage cleared successfully.');
        // Clear local storage
        setListItems(new Map());  
      } catch (error) {
        console.error('Error clearing async storage:', error);
      }
    }

    return (<>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Let's add a new task!</Text>
            <View style={styles.textInputContainer}>
              <Text>Title</Text>
              <TextInput
                onChangeText={newTitle => {
                  setError(false);
                  setTitle(newTitle)
                }}
                defaultValue={title}
                style={styles.inputText}
              />
            </View>
            <View style={styles.textInputContainer}>
              <Text>Description</Text>
              <TextInput
                onChangeText={newDescription => setDescription(newDescription)}
                defaultValue={description}
                style={[styles.inputText, {height: 50}]}
                multiline={true}
              />
            </View>
            <View style={styles.textInputContainer}>
              <Text>Flagged</Text>
              <Switch
                style={styles.checkBox}
                value={isFlagged}
                onValueChange={(newValue) => {
                  setFlagged(newValue);
                }}
                trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                thumbColor={'#189AB4'} 
              />
            </View>
            <View style={styles.textInputContainer}>
              <Text>Priority</Text>
              <View style={styles.switchContainer}>
                <View style={styles.prioritySwitchContainer}>
                  <Text>Low</Text>
                  <Switch
                    style={styles.checkBox}
                    value={priority == "Low"}
                    onValueChange={(newValue) => {
                      setPriority(newValue ? 'Low' : 'High');
                    }}
                    trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                    thumbColor={'#189AB4'} 
                  />
                </View>
                <View style={styles.prioritySwitchContainer}>
                  <Text>Medium</Text>
                  <Switch
                    style={styles.checkBox}
                    value={priority == "Medium"}
                    onValueChange={(newValue) => {
                      setPriority(newValue ? 'Medium' : 'Low');
                    }}
                    trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                    thumbColor={'#189AB4'} 
                  />
                </View>
                <View style={styles.prioritySwitchContainer}>
                  <Text>High</Text>
                  <Switch
                    style={styles.checkBox}
                    value={priority == "High"}
                    onValueChange={(newValue) => {
                      setPriority(newValue ? 'High' : 'Low');
                    }}
                    trackColor={{ false: '#e8e8e8', true: '#75E6DA' }}
                    thumbColor={'#189AB4'} 
                  />
                  </View>
              </View>
            </View>
            <View style={styles.textInputContainer}>
              <Text>Image</Text>
              <TextInput
                onChangeText={newImage => setImage(newImage)}
                defaultValue={image}
                style={styles.inputText}
              />
            </View>
            {image !== '' && (
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 150}}
            />
            )}
            <Pressable
              style={styles.button}
              onPress={() => {
                // Check valid
                let checkKey = uniqueListKey + title;
                if (listItems.has(checkKey)) {
                  setError(true);
                  return
                }
                // Add item
                addTask(title, description, isFlagged, image, priority);
                // Close modal
                setModalVisible(!modalVisible)}
              }>
              <Text style={styles.textStyle}>Add Task</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
            {error && <>
              <View style={[styles.button, {backgroundColor: '#ffbac5', paddingHorizontal: '10px', width: '200px'}]}>
                <Text>
                  Error! The title has already been used.
                </Text>
              </View>
            </>}
          </View>
        </View>
      </Modal>

      <View style={styles.controlBar}>
        <TouchableOpacity style={styles.button} onPress={addModalOpen}>
          <Text>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearAsyncStorage}>
          <Text>Clear Storage</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listScreen}>
        {renderListItems}
      </ScrollView>
    </>);
  }

  function Flagged() {
    setScreenFocus("Flagged")
    return (<>
      <ScrollView style={styles.listScreen}>
        {renderListItems}
      </ScrollView>
    </>);
  }

  function Completed() {
    setScreenFocus("Completed")
    return (<>
      <ScrollView style={styles.listScreen}>
        {renderListItems}
      </ScrollView>
    </>);
  }

  function Overview() {
    setScreenFocus("Overview")

    const counter = [0.0, 0.0, 0.0];
    let total = 0
    listItems.forEach((value, key) => {
      let parsedData = JSON.parse(value);
      if (parsedData.priority == "Low") {
        counter[0] += 1;
      } else if (parsedData.priority == "Medium") {
        counter[1] += 1;
      } else {
        counter[2] += 1;
      }
      total += 1;
    })

    const data = [0, 0, 0];
    if (total != 0) {
      data[0] = counter[0]/total;
      data[1] = counter[1]/total;
      data[2] = counter[2]/total;
    }
    const chartData = {
      labels: ["Low", "Medium", "High"],
      data: data,
    }
    return (<>
      <View style={styles.chart}>
        <ProgressChart
          data={chartData}
          width={390} 
          height={300} 
          chartConfig={{
            backgroundGradientFrom: '#d2fcf8',
            backgroundGradientTo: '#fff',
            color: (opacity = 1, index) => {
              if (index === 0) {
                return `rgba(42, 213, 194, ${opacity})`; 
              } else if (index === 1) {
                return `rgba(194, 42, 213, ${opacity})`;
              } else if (index === 2) {
                return `rgba(213, 194, 42, ${opacity})`; 
              }
            },
          }}
        />
      <View style={styles.overviewBottom}>
          <Text style={[styles.priorityDisplay, {color: 'rgb(42, 213, 194)'}]}>{counter[0]} Low priority tasks remain</Text>
          <Text style={[styles.priorityDisplay, {color: 'rgb(194, 42, 213)'}]}>{counter[1]} Medium priority tasks remain</Text>
          <Text style={[styles.priorityDisplay, {color: 'rgb(213, 194, 42)'}]}>{counter[2]} High priority tasks remain</Text>
      </View>
      </View>
    </>);
  }

  // Main app
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerStyle: styles.navigator,
          tabBarActiveTintColor: '#189AB4',
          tabBarItemStyle: styles.tabItem,
          tabBarStyle: {display: 'flex'}
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Flagged" component={Flagged} />
        <Tab.Screen name="Completed" component={Completed} />
        <Tab.Screen name="Overview" component={Overview} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBar: {
    height: "80px",
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listScreen: {
    flex: 9,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#D4F1F4',
    width: '150px',
    height: '50px',
    borderRadius: '10px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px',
    borderWidth: '1px',
    borderColor: '#cfcfcf',
    boxShadow: '0px 2px 10px gray',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  modalView: {
    height: 760,
    width: 350,
    margin: '100px',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center', 
    boxShadow: '0px 2px 20px gray',
    elevation: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
  },
  textInputContainer: {
    margin: '10px',
    alignItems: 'center',
  },
  inputText: {
    border: '1px solid black',
    height: '25px',
    paddingHorizontal: '10px',
    borderRadius: '5px',
  },
  navigator: {
    backgroundColor: '#75E6DA',
  },
  tabBar: {
    backgroundColor: 'red',
  },
  item: {
    backgroundColor: '#05445E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '120px',
    width: '95%',
    borderRadius: '20px',
    alignItems: 'center',
    margin: '10px',
    color: 'red',
    paddingVertical: '10px',
    paddingHorizontal: '15px',
  }, 
  itemText: {
    color: '#fff',
    fontWeight: 500,
    marginVertical: '3px',
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    width: '180px',
  },
  itemControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBox: {
    height: '30px',
    width: '30px',
    transform: 'scale(0.8)'
  },
  tabBar: {
    activeTintColor: '#189AB4',
    tabStyle: {
      borderLeftWidth: 0.1,
      borderRightWidth: 0.1,
      borderColor: 'gray',
    },
  },
  iconDot: {
    width: '30px', 
    height: '30px',
    opacity: '0.75',
  },
  tabItem: {
    borderLeftWidth: 0.1,
    borderRightWidth: 0.1,
    borderColor: 'gray',
  },
  chart: {
    width: '400px',
    flex: 1,
  },
  overviewBottom: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prioritySwitchContainer: {
    marginTop: '15px',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityDisplay: {
    color: '#05445E',
    fontSize: '20px',
    fontWeight: 600,
    backgroundColor: '#D1F1F4',
    height: '60px',
    borderRadius: '15px',
    padding: '10px',
    width: '350px',
    boxShadow: '0px 2px 10px gray',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 1,
  }

});
