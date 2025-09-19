import { InstanceMessageTypeEnum, SignalMessageLevelEnum } from "@jfvilas/kwirth-common"

export interface ILogLine {
    namespace: string
    pod: string
    container: string
    timestamp?: Date
    type: string
    text: string
}

export interface IStatusLine {
    type: InstanceMessageTypeEnum
    level: SignalMessageLevelEnum
    text: string
}

export interface IBackendInfo {
    "plugin-kwirth-backend" : string
    "plugin-kwirth-log" : string
    "plugin-kwirth-metrics" : string
    "kwirth" : string
}
