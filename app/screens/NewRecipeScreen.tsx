import React from 'react'
import { Dimensions , StyleSheet, View, Text, TouchableOpacity, ListRenderItem } from 'react-native'
import { FlatList , TextInput } from 'react-native-gesture-handler'


import MyFeather from '../components/MyFeather'
import colors from '../config/colors'
import globalStyles from '../config/globalStyles'
import Ingredient from '../data/ingredient'
import Instruction from '../data/instruction'
import Recipe from '../data/recipe'
import RecipeIngredient from '../data/recipe-ingredient'

function NewRecipeScreen(): JSX.Element {

    const [recipeData, setRecipeData] = React.useState<Recipe>({
        name: '',
        description: '',
        prepareTime: 0,
        peopleCount: 1,
        key: '0',
        id: 0,
        recipeIngredients: [],
        instructions: [],
    })

    const [ingredientsData, setIngredientData] = React.useState<Ingredient[]>([])

    const [ingredientId, setIngredientId] = React.useState(0)

    function getIngredientId(): string {
        setIngredientId(ingredientId + 1)
        return (ingredientId - 1).toString()
    }

    const [instructionsData, setInstructionsData] = React.useState<Instruction[]>([])

    const [instructionId, setInstructionId] = React.useState(0)

    function getInstructionId(): string {
        setInstructionId(instructionId + 1)
        return (instructionId - 1).toString()
    }

    function handleNameChange(name: string): void {
        setRecipeData({...recipeData, name})
    }

    function handleDescriptionChange(description: string): void {
        setRecipeData({...recipeData, description})
    }

    function handlePrepareTimeChange(prepareTime: number): void {
        setRecipeData({...recipeData, prepareTime})
    }

    function handlePeopleCountChange(peopleCount: number): void {
        setRecipeData({...recipeData, peopleCount})
    }

    function handleAddIngredient(): void {
        const ingredient = new Ingredient()
        ingredient.name = ''
        ingredient.unit = ''
        ingredient.key = getIngredientId()

        const recipeIngredient = new RecipeIngredient()
        recipeIngredient.amount = 0
        recipeIngredient.ingredient = ingredient
        ingredient.recipeIngredients = [recipeIngredient]

        setIngredientData([...ingredientsData, ingredient])
        recipeData.recipeIngredients?.push(recipeIngredient)
    }

    function handleRemoveIngredient(key: string): void {
        const ingredients = ingredientsData.filter(item => item.key !== key)
        setIngredientData([...ingredients])
    }

    function handleIngredientNameChange(key: string, name: string): void {
        const ingredient = ingredientsData.filter(item => item.key === key)[0]
        ingredient.name = name
        const ingredients = ingredientsData.filter(item => item.key !== key)
        setIngredientData([...ingredients, ingredient].sort(
            (a, b) => (a.key > b.key) ? 1 : -1
        ))
    }

    function handleIngredientUnitChange(key: string, unit: string): void {
        const ingredient = ingredientsData.filter(item => item.key === key)[0]
        ingredient.unit = unit
        const ingredients = ingredientsData.filter(item => item.key !== key)
        setIngredientData([...ingredients, ingredient].sort(
            (a, b) => (a.key > b.key) ? 1 : -1
        ))
    }

    function handleIngredientAmountChange(key: string, amount: string): void {
        const ingredient = ingredientsData.filter(item => item.key === key)[0]
        const recipeIngredient = ingredient.recipeIngredients ?? []
        recipeIngredient[0].amount = parseFloat(amount)
        const ingredients = ingredientsData.filter(item => item.key !== key)
        setIngredientData([...ingredients, ingredient].sort(
            (a, b) => (a.key > b.key) ? 1 : -1
        ))
    }

    function handleAddInstruction(): void {
        const instruction = new Instruction()
        instruction.text = ''
        instruction.key =  getInstructionId()

        setInstructionsData([...instructionsData, instruction])
        recipeData.instructions?.push(instruction)
    }

    function handleRemoveInstruction(key: string): void {
        const instructions = instructionsData.filter(item => item.key !== key)
        setInstructionsData([...instructions])
    }

    function handleInstructionTextChange(key: string, text: string): void {
        const instruction = instructionsData.filter(item => item.key === key)[0]
        instruction.text = text
        const instructions = instructionsData.filter(item => item.key !== key)
        setInstructionsData([...instructions, instruction].sort(
            (a, b) => (a.key > b.key) ? 1 : -1
        ))
    }

    return (
        <View style={styles.background}>
            {/* Recipe Name Input Field */}
            <TextInput
                style={{...styles.header}}
                value={recipeData.name}
                placeholder='New Recipe'
                onChangeText={(text: string) => handleNameChange(text)}
                multiline
            />

            {/* Recipe Description Input Field */}
            <View style={globalStyles.userinput}>
                <TextInput
                    style={{...globalStyles.textinput}}
                    placeholder='Description'
                    value={recipeData.description}
                    onChangeText={(text: string) => handleDescriptionChange(text)}
                    multiline
                />
            </View>

            {/* Ingredients List Container */}
            <View style={{...globalStyles.userinput, ...styles.ingredientsContainer}}>
                {/* Ingredients Header */}
                <View style={styles.ingredientsHeader}>
                    {/* Header Text */}
                    <Text style={styles.ingredientHeaderText}>
                        Ingredients
                    </Text>

                    {/* Add Ingredient Button */}
                    <TouchableOpacity
                        style={styles.addIngredientButton}
                        onPress={handleAddIngredient}>
                        <MyFeather name="plus" />
                    </TouchableOpacity>
                </View>

                {/* Ingredients List */}
                <FlatList style={styles.ingredientsList}
                    data={ingredientsData}
                    renderItem={ ({ item }) => (

                        <View style={styles.ingredientsListItem}>
                            {/* Ingredient Name Input */}
                            <TextInput
                                style={styles.ingredientName}
                                onChangeText={(text: string) => handleIngredientNameChange(item.key, text)}
                                value={item.name}
                                placeholder='New Ingredient'
                            />

                            {/* Ingredient Amount Input */}
                            <TextInput
                                style={styles.ingredientAmount}
                                onChangeText={(text: string) => handleIngredientAmountChange(item.key, text)}
                                value={item.recipeIngredients[0].amount.toString() ?? ''}
                                placeholder='Amount'
                            />

                            {/* Ingredient Unit Input */}
                            <TextInput
                                style={styles.ingredientUnit}
                                onChangeText={(text: string) => handleIngredientUnitChange(item.key, text)}
                                value={item.unit}
                                placeholder='Unit'
                            />

                            {/* Remove Ingredient Button */}
                            <TouchableOpacity
                                style={styles.removeIngredientButton}
                                onPress={() => handleRemoveIngredient(item.key)}>
                                <MyFeather
                                    name="minus"
                                    size={15}
                                />
                            </TouchableOpacity>

                        </View>
                    )}
                />
            </View>

            {/* Instructions List Container */}
            <View style={{...globalStyles.userinput, ...styles.instructionsContainer}}>
                {/* Instructions Header */}
                <View style={styles.instructionsHeader}>
                    {/* Header Text */}
                    <Text style={styles.instructionHeaderText}>
                        Instructions
                    </Text>

                    {/* Add Ingredient Button */}
                    <TouchableOpacity
                        style={styles.addInstructionButton}
                        onPress={handleAddInstruction}>
                        <MyFeather name="plus" />
                    </TouchableOpacity>
                </View>

                {/* Instructions List */}
                <FlatList style={styles.instructionsList}
                    data={instructionsData}
                    renderItem={ ({item}) => (
                        <View style={styles.instructionsListItem}>
                            {/* Instruction Number */}
                            <Text style={styles.instructionNumber}>
                                {(instructionsData.indexOf(item) + 1).toString()}
                            </Text>

                            {/* Instruction Text Input */}
                            <TextInput
                                style={styles.instructionText}
                                onChangeText={(text: string) => handleInstructionTextChange(item.key, text)}
                                value={item.text}
                                placeholder='Text'
                                multiline
                            />

                            {/* Remove Instruction Button */}
                            <TouchableOpacity
                                style={styles.removeInstructionButton}
                                onPress={() => handleRemoveInstruction(item.key)}
                            >
                                <MyFeather
                                    name="minus"
                                    size={15}
                                />
                            </TouchableOpacity>

                        </View>
                    ) }
                />
            </View>

        </View>
    )
}
// /*

// */
export default NewRecipeScreen

const { height } = Dimensions.get('screen')

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: colors.white,
    },
    header: {
        top: height * 0.08,
        fontSize: height * 0.04,
        width: '85%',
        // flex: 1,
        paddingLeft: 10,
        color: colors.black,
    },
    ingredientsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    ingredientsHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    ingredientHeaderText: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
    },
    addIngredientButton: {

    },
    ingredientsList: {
        paddingTop: 5,
        flexDirection: 'column'
    },
    ingredientsListItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    ingredientName: {
        width: '50%',
        paddingEnd: 5,
    },
    ingredientAmount: {
        width: '15%',
        paddingEnd: 5,
    },
    ingredientUnit: {
        width: '25%',
        paddingEnd: 5,
    },
    removeIngredientButton: {
        alignContent: 'flex-end'
    },

    instructionsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    instructionsHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    instructionHeaderText: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
    },
    addInstructionButton: {

    },
    instructionsList: {
        paddingTop: 5,
        flexDirection: 'column'
    },
    instructionsListItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'space-between',
        width: '100%'
    },
    instructionNumber: {
        width: '10%',
        fontSize: 18
    },
    instructionText: {
        width: '80%',
        paddingEnd: 5,
    },
    removeInstructionButton: {
    },

})
