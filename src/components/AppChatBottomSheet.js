import { forwardRef, useState } from 'react'
import { Button, StyleSheet, View, Text } from 'react-native'
import { Chat, ChannelList } from 'stream-chat-react-native'


import BottomSheet from './BottomSheet'
import DXChatChannel from './DXChatChannel'
import { useChatClient, chatClient } from '../hooks/useChatClient'

const snapPoints = [0.9, 0]


export const getChatChannelsFilter = (chatUserId) => ({
  members: {
    $in: [chatUserId],
  },
})

export const chatSort = {
  last_message_at: -1,
}



const ChatModes = {
  channelList: 'channelList',
  channel: 'channel',
  newChat: 'newChat',
}

const initChatMode = () => ChatModes.channelList

const Inner = ({ close }) => {
  const [channel, setChannel] = useState()
  const [mode, setMode] = useState(initChatMode)
  const { chatClient } = useChatClient()

  const handleBack = () => {
    setChannel(null)
    if (mode === ChatModes.channelList) {
      close && close()
    } else {
      setMode(ChatModes.channelList)
    }
  }

  const onSelectChannel = (newChannel) => {
    setChannel(newChannel)
    setMode(ChatModes.channel)
  }

  const headerColor = 'black'
  const isChannelList = mode === ChatModes.channelList

  console.log('clientIsReady', !!chatClient?.userID)

  return (
    <View style={{ flex: 1, paddingBottom: 0, marginTop: -20, backgroundColor: 'olive' }}>
      {chatClient?.userID ? (
        <Chat client={chatClient}>
          <View style={[styles.headerRow]}>
            <Button onPress={handleBack} style={[styles.headerIcon, { opacity: isChannelList ? 0 : 1 }]} title="<" />
            <Text>
              {mode === ChatModes.channelList ? "Chats" : "Chat"}
            </Text>
            {isChannelList ? (
              <Button onPress={handleBack} style={styles.headerIcon} title="X" />
            ) : (
              <View style={[styles.headerIcon, { opacity: 0, width: 24 }]} />
            )}
          </View>
          {
            mode === ChatModes.channel ? (
              <DXChatChannel channel={channel} />
            ) : isChannelList ? (
              <>
                <ChannelList filters={getChatChannelsFilter(chatClient.userID)} sort={chatSort} onSelect={onSelectChannel} />
              </>
            ) : (
              <Text>Contacts</Text>
            )}
        </Chat>
      ) : null}
    </View>
  )
}

const AppChatBottomSheet = forwardRef((props, ref) => {

  const close = () => ref?.current?.hide?.()

  return (
    <BottomSheet ref={ref} snapPoints={snapPoints}>
      <View style={[styles.wrapper, { backgroundColor: 'white' }]}>
        <Inner close={close} />
      </View>
    </BottomSheet>
  )
})

export default AppChatBottomSheet

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: -4,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  wrapper: {
    flex: 1,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 0,
    width: '100%'
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
  },
  headerIcon: {
    flex: 0,
  },

})
