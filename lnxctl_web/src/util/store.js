import {configureStore} from '@reduxjs/toolkit';
import commonStore from '../module/common/store.js';
import linuxHostStore from '../module/linux/host/store.js';
import linuxServiceStore from '../module/linux/service/store.js';
import dockerCommonStore from '../module/docker/common/store.js';
import dockerServerStore from '../module/docker/server/store.js';
import dockerImageStore from '../module/docker/image/store.js';
import dockerContainerStore from '../module/docker/container/store.js';
import dockerNetworkStore from '../module/docker/network/store.js';
import k8sCommonStore from '../module/k8s/common/store.js';
import k8sClusterStore from '../module/k8s/cluster/store.js';
import k8sNamespaceStore from '../module/k8s/namesapce/store.js';
import k8sNodeStore from '../module/k8s/node/store.js';
import k8sPodStore from '../module/k8s/pod/store.js';
import k8sDeploymentStore from '../module/k8s/deployment/store.js';
import k8sReplicasetStore from '../module/k8s/replicaset/store.js';
import k8sStatefulsetStore from '../module/k8s/statefulset/store.js';
import k8sDaemonsetStore from '../module/k8s/daemonset/store.js';
import k8sJobStore from '../module/k8s/job/store.js';
import k8sCronjobStore from '../module/k8s/cronjob/store.js';
import k8sServiceStore from '../module/k8s/service/store.js';
import k8sEndpointStore from '../module/k8s/endpoint/store.js';
import k8sIngressStore from '../module/k8s/ingress/store.js';
import k8sPvStore from '../module/k8s/pv/store.js';
import k8sPvcStore from '../module/k8s/pvc/store.js';
import k8sStorageclassStore from '../module/k8s/storageclass/store.js';
import k8sConfigmapStore from '../module/k8s/configmap/store.js';
import k8sSecretStore from '../module/k8s/secret/store.js';
import k8sServiceaccountStore from '../module/k8s/serviceaccount/store.js';
import k8sRoleStore from '../module/k8s/role/store.js';
import k8sRolebindingStore from '../module/k8s/rolebinding/store.js';
import k8sClusterroleStore from '../module/k8s/clusterrole/store.js';
import k8sClusterrolebindingStore from '../module/k8s/clusterrolebinding/store.js';
import monitoringTargetStore from '../module/monitoring/target/store.js';
import authDeptStore from '../module/auth/dept/store.js';
import authMenuStore from '../module/auth/menu/store.js';
import authPermStore from '../module/auth/perm/store.js';
import authRoleStore from '../module/auth/role/store.js';
import authUserStore from '../module/auth/user/store.js';
import systemLogStore from '../module/system/log/store.js';

const store = configureStore({
  reducer: {
    common: commonStore.commonSlice.reducer,

    linuxHost: linuxHostStore.hostSlice.reducer,
    linuxService: linuxServiceStore.serviceSlice.reducer,

    dockerCommon: dockerCommonStore.commonSlice.reducer,
    dockerServer: dockerServerStore.serverSlice.reducer,
    dockerImage: dockerImageStore.imageSlice.reducer,
    dockerContainer: dockerContainerStore.containerSlice.reducer,
    dockerNetwork: dockerNetworkStore.networkSlice.reducer,

    k8sCommon: k8sCommonStore.commonSlice.reducer,
    k8sCluster: k8sClusterStore.clusterSlice.reducer,
    k8sNamespace: k8sNamespaceStore.namespaceSlice.reducer,
    k8sNode: k8sNodeStore.nodeSlice.reducer,
    k8sPod: k8sPodStore.podSlice.reducer,
    k8sDeployment: k8sDeploymentStore.deploymentSlice.reducer,
    k8sReplicaset: k8sReplicasetStore.replicasetSlice.reducer,
    k8sStatefulset: k8sStatefulsetStore.statefulsetSlice.reducer,
    k8sDaemonset: k8sDaemonsetStore.daemonsetSlice.reducer,
    k8sJob: k8sJobStore.jobSlice.reducer,
    k8sCronjob: k8sCronjobStore.cronjobSlice.reducer,
    k8sService: k8sServiceStore.serviceSlice.reducer,
    k8sEndpoint: k8sEndpointStore.endpointSlice.reducer,
    k8sIngress: k8sIngressStore.ingressSlice.reducer,
    k8sPv: k8sPvStore.pvSlice.reducer,
    k8sPvc: k8sPvcStore.pvcSlice.reducer,
    k8sStorageclass: k8sStorageclassStore.storageclassSlice.reducer,
    k8sConfigmap: k8sConfigmapStore.configmapSlice.reducer,
    k8sSecret: k8sSecretStore.secretSlice.reducer,
    k8sServiceaccount: k8sServiceaccountStore.serviceaccountSlice.reducer,
    k8sRole: k8sRoleStore.roleSlice.reducer,
    k8sRolebinding: k8sRolebindingStore.rolebindingSlice.reducer,
    k8sClusterrole: k8sClusterroleStore.clusterroleSlice.reducer,
    k8sClusterrolebinding: k8sClusterrolebindingStore.clusterrolebindingSlice.reducer,

    monitoringTarget: monitoringTargetStore.targetSlice.reducer,

    authDept: authDeptStore.deptSlice.reducer,
    authUser: authUserStore.userSlice.reducer,
    authRole: authRoleStore.roleSlice.reducer,
    authPerm: authPermStore.permSlice.reducer,
    authMenu: authMenuStore.menuSlice.reducer,

    systemLog: systemLogStore.logSlice.reducer,
  },
});

export default store;
