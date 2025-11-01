import { Entity } from '@backstage/catalog-model'
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api'
import { InstanceConfigScopeEnum } from '@jfvilas/kwirth-common'
import { ClusterValidPods } from './Resources'
import { InstanceMessageTypeEnum, SignalMessageLevelEnum } from "@jfvilas/kwirth-common"
import { PodData } from "./Resources"

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

export const getPodList = (pods:PodData[], selectedNamespaces:string[]) => {
    return Array.from(pods.filter(m => selectedNamespaces.includes(m.namespace)))
}

export const getContainerList = (pods:PodData[], selectedNamespaces:string[], selectedPodNames:string[]) => {
    if (selectedNamespaces.length===0 || selectedPodNames.length===0) return []
    let validpods = pods.filter(pod => selectedNamespaces.includes(pod.namespace))
    validpods = validpods.filter(p => selectedPodNames.includes(p.name))
    let validcontainers:string[] = []
    for (var p of validpods) {
        validcontainers.push ( ...p.containers )
    }
    return Array.from(new Set(validcontainers))
}

export const getVersion = async (discoveryApi:DiscoveryApi, fetchApi:FetchApi) : Promise<string> => {
    try {
        const baseUrl = await discoveryApi.getBaseUrl('kwirth')
        const targetUrl = `${baseUrl}/version`

        const result = await fetchApi.fetch(targetUrl)
        const data = await result.json()

        if (!result.ok) {
            throw new Error(`getVersion error: not ok`)
        }
        return data.version
    }
    catch (err) {
        throw new Error(`getVersion error: ${err}`)
    }
}

export const getInfo = async (discoveryApi:DiscoveryApi, fetchApi:FetchApi) : Promise<IBackendInfo> => {
    try {
        const baseUrl = await discoveryApi.getBaseUrl('kwirth')
        const targetUrl = `${baseUrl}/info`

        const result = await fetchApi.fetch(targetUrl)
        const data = await result.json()

        if (!result.ok) {
            throw new Error(`getInfo error: not ok`)
        }
        return data
    }
    catch (err) {
        throw new Error(`getInfo error: ${err}`)
    }
}

export const getResources = async (discoveryApi:DiscoveryApi, fetchApi: FetchApi, entity:Entity): Promise<ClusterValidPods> => {
    try {
        const baseUrl = await discoveryApi.getBaseUrl('kwirth')
        const targetUrl = `${baseUrl}/start`

        var payload=JSON.stringify(entity)
        const result = await fetchApi.fetch(targetUrl, {method:'POST', body:payload, headers:{'Content-Type':'application/json'}})
        const data = await result.json() as ClusterValidPods

        if (!result.ok) {
            throw new Error(`getResources error: not ok`)
        }
        return data
    }
    catch (err) {
        throw new Error(`getResources error: ${err}`)
    }
}

export const requestAccess = async (discoveryApi:DiscoveryApi, fetchApi:FetchApi, entity:Entity, channel:string, scopes:InstanceConfigScopeEnum[]): Promise<ClusterValidPods[]> => {
    try {
        const baseUrl = await discoveryApi.getBaseUrl('kwirth')
        var targetUrl:URL = new URL (`${baseUrl}/access`)
        targetUrl.searchParams.append('scopes',scopes.join(','))
        targetUrl.searchParams.append('channel',channel)

        var payload=JSON.stringify(entity)
        const result = await fetchApi.fetch(targetUrl, {method:'POST', body:payload, headers:{'Content-Type':'application/json'}})
        const data = await result.json() as ClusterValidPods[]

        // we reconstruct the 'Map' from string of arrays
        for (var c of data) {
            c.accessKeys = new Map(JSON.parse(((c as any).accessKeys)))
        }
        if (!result.ok) {
            throw new Error(`requestAccess error: not ok`)
        }
        return data
    }
    catch (err) {
        throw new Error(`requestAccess error: ${err}`)
    }
}
