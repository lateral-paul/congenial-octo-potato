import { useNavigation } from "@react-navigation/native"
import { Button, Text, View } from "react-native"
import AppChatBottomSheet from "../components/AppChatBottomSheet"
import { useRef } from "react"

const StackScreen = ({title}) => {
    const nav = useNavigation()
    const ref = useRef()

    const openChatSheet = () => { ref?.current?.show() }

    return (
        <View style={{flex: 1}}>
            <Text>{title}</Text>

            <Button onPress={openChatSheet} title='Chat' />
            <AppChatBottomSheet ref={ref}/>
        </View>
    )
}

export default StackScreen