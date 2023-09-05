import { useEffect, useState } from 'react'
import { Channel, MessageList } from 'stream-chat-react-native'
import { View, Platform, PermissionsAndroid, Text } from 'react-native'
import KeyboardAvoidingMessageInput from './KeyboardAvoidingMessageInput'

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

const DXChatChannel = ({ channel }) => {
  const [mediaPermissions, setMediaPermissions] = useState(null)

  useEffect(() => {
    hasAndroidPermission().then(res => setMediaPermissions(res))
  }, [])

  useEffect(() => {
    if (channel) {
      channel.watch()
    }
  }, [channel])

  return channel && mediaPermissions? (
    <Channel channel={channel} giphyEnabled={false} hasCommands={false} hasFilePicker={false} hasImagePicker={true}>
      <View style={{ height: '92%', paddingBottom: Platform.OS === 'ios' ? 35 : 10 }}>
        <MessageList />
        <KeyboardAvoidingMessageInput />
      </View>
    </Channel>
  ) : <Text>Checking permissions...</Text>
}

export default DXChatChannel
