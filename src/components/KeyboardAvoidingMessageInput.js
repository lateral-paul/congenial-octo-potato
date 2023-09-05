import { KeyboardAvoidingView, View } from 'react-native'
import { MessageInput } from 'stream-chat-react-native'

const KeyboardAvoidingMessageInput = () => {
  return (
    <KeyboardAvoidingView>
      <View>
        <MessageInput />
      </View>
    </KeyboardAvoidingView>
  )
}

export default KeyboardAvoidingMessageInput
