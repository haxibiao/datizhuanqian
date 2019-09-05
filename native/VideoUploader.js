import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform
} from 'react-native';

export type UploadEvent = 'progress' | 'error' | 'completed' | 'cancelled';

export type NotificationArgs = {
  enabled: boolean
};

export type StartUploadArgs = {
  url: string,
  path: string,
  method?: 'PUT' | 'POST',
  type?: 'raw' | 'multipart',
  field?: string,
  customUploadId?: string,
  parameters?: {
    [string]: string
  },
  headers?: Object,
  notification?: NotificationArgs
};

let module = NativeModules.VideoUploader;
console.log('module', module);
let eventPrefix = 'VideoUploader-';
let deviceEmitter =
  Platform.OS == 'android'
    ? DeviceEventEmitter
    : module
    ? new NativeEventEmitter(module)
    : null;

export const getFileInfo = (path: string): Promise<Object> => {
  return module.getFileInfo(path).then(data => {
    if (data.size) {
      data.size = +data.size;
    }
    return data;
  });
};

export const startUpload = (options: StartUploadArgs): Promise<string> =>
  module.startUpload(options);

export const cancelUpload = (cancelUploadId: string): Promise<boolean> => {
  if (typeof cancelUploadId !== 'string') {
    return Promise.reject(new Error('Upload ID must be a string'));
  }
  return module.cancelUpload(cancelUploadId);
};

export const addListener = (
  eventType: UploadEvent,
  uploadId: string,
  listener: Function
) => {
  return deviceEmitter.addListener(eventPrefix + eventType, data => {
    if (!uploadId || !data || !data.id || data.id == uploadId) {
      listener(data);
    }
  });
};

export default {
  startUpload,
  cancelUpload,
  addListener,
  getFileInfo
};
