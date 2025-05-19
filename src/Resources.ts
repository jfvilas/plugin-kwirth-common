/*
Copyright 2024 Julio Fernandez

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { AccessKey, InstanceConfigScopeEnum } from '@jfvilas/kwirth-common'

/**
 * @interface PodData contains data related on oaccessing one pod for doing someting
 * @field name, the name of the pod (including nothing extra)
 * @field namespace, the namespace of the pod
 * @field accessKeys, a Map with a service scope as key (STREAM, VIEW, RESTART...) and an access key as value
 */

export interface PodData {
    name: string
    namespace: string
    containers: string[]
}

export interface MetricDefinition {
    metric: string
    help: string
    type: string
    eval: string
}

/**
 * @interface ClusterValidPods contains data about a cluster and all the pods found in the cluster that match required access
 * @field name is the name of the cluster
 * @field url is the kwirth url (we will use it for asking for access keys)
 * @field title is a short description of the cluster
 * @field data is an array of 'PodAccess'
 */
export interface ClusterValidPods {
    name: string
    metrics?: MetricDefinition[]
    url: string
    title?: string
    data: PodData[]
    accessKeys: Map<InstanceConfigScopeEnum,AccessKey>
}
