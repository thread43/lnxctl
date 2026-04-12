import {BlockOutlined} from '@ant-design/icons';
import {DockerOutlined} from '@ant-design/icons';
import {LinuxOutlined} from '@ant-design/icons';
import {SafetyOutlined} from '@ant-design/icons';
import {SettingOutlined} from '@ant-design/icons';
import Index from '../module/index/Index.jsx';
import LinuxHost from '../module/linux/host/Index.jsx';
import LinuxService from '../module/linux/service/Index.jsx';
import DockerServer from '../module/docker/server/Index.jsx';
import DockerImage from '../module/docker/image/Index.jsx';
import DockerContainer from '../module/docker/container/Index.jsx';
import DockerNetwork from '../module/docker/network/Index.jsx';
import K8sCluster from '../module/k8s/cluster/Index.jsx';
import K8sNamespace from '../module/k8s/namesapce/Index.jsx';
import K8sNode from '../module/k8s/node/Index.jsx';
import K8sPod from '../module/k8s/pod/Index.jsx';
import K8sDeployment from '../module/k8s/deployment/Index.jsx';
import K8sReplicaset from '../module/k8s/replicaset/Index.jsx';
import K8sStatefulset from '../module/k8s/statefulset/Index.jsx';
import K8sDaemonset from '../module/k8s/daemonset/Index.jsx';
import K8sJob from '../module/k8s/job/Index.jsx';
import K8sCronjob from '../module/k8s/cronjob/Index.jsx';
import K8sService from '../module/k8s/service/Index.jsx';
import K8sEndpoint from '../module/k8s/endpoint/Index.jsx';
import K8sIngress from '../module/k8s/ingress/Index.jsx';
import K8sPv from '../module/k8s/pv/Index.jsx';
import K8sPvc from '../module/k8s/pvc/Index.jsx';
import K8sStorageclass from '../module/k8s/storageclass/Index.jsx';
import K8sConfigmap from '../module/k8s/configmap/Index.jsx';
import K8sSecret from '../module/k8s/secret/Index.jsx';
import K8sServiceaccount from '../module/k8s/serviceaccount/Index.jsx';
import K8sRole from '../module/k8s/role/Index.jsx';
import K8sRolebinding from '../module/k8s/rolebinding/Index.jsx';
import K8sClusterRole from '../module/k8s/clusterrole/Index.jsx';
import K8sClusterRoleBinding from '../module/k8s/clusterrolebinding/Index.jsx';
import AuthDept from '../module/auth/dept/Index.jsx';
import AuthUser from '../module/auth/user/Index.jsx';
import AuthRole from '../module/auth/role/Index.jsx';
import AuthPerm from '../module/auth/perm/Index.jsx';
import AuthMenu from '../module/auth/menu/Index.jsx';
import SystemTerminal from '../module/system/terminal/Index.jsx';
import SystemLog from '../module/system/log/Index.jsx';
import NotFound from '../module/common/NotFound.jsx';

const routes = [
  {path: '/', component: Index},
  {path: '/index', component: Index},

  {path: '/linux', component: LinuxHost, alias: 'linux', icon: <LinuxOutlined />},
  {path: '/linux/host', component: LinuxHost, alias: 'linux_host'},
  {path: '/linux/service', component: LinuxService, alias: 'linux_service'},

  {path: '/docker', component: DockerContainer, alias: 'docker', icon: <DockerOutlined />},
  {path: '/docker/server', component: DockerServer, alias: 'docker_server'},
  {path: '/docker/image', component: DockerImage, alias: 'docker_image'},
  {path: '/docker/container', component: DockerContainer, alias: 'docker_container'},
  {path: '/docker/network', component: DockerNetwork, alias: 'docker_network'},

  {path: '/k8s', component: K8sPod, alias: 'k8s', icon: <BlockOutlined />},
  {path: '/k8s/cluster', component: K8sCluster, alias: 'k8s_cluster'},
  {path: '/k8s/namespace', component: K8sNamespace, alias: 'k8s_namespace'},
  {path: '/k8s/node', component: K8sNode, alias: 'k8s_node'},
  {path: '/k8s/pod', component: K8sPod, alias: 'k8s_pod'},
  {path: '/k8s/deployment', component: K8sDeployment, alias: 'k8s_deployment'},
  {path: '/k8s/replicaset', component: K8sReplicaset, alias: 'k8s_replicaset'},
  {path: '/k8s/statefulset', component: K8sStatefulset, alias: 'k8s_statefulset'},
  {path: '/k8s/daemonset', component: K8sDaemonset, alias: 'k8s_daemonset'},
  {path: '/k8s/job', component: K8sJob, alias: 'k8s_job'},
  {path: '/k8s/cronjob', component: K8sCronjob, alias: 'k8s_cronjob'},
  {path: '/k8s/service', component: K8sService, alias: 'k8s_service'},
  {path: '/k8s/endpoint', component: K8sEndpoint, alias: 'k8s_endpoint'},
  {path: '/k8s/ingress', component: K8sIngress, alias: 'k8s_ingress'},
  {path: '/k8s/pv', component: K8sPv, alias: 'k8s_pv'},
  {path: '/k8s/pvc', component: K8sPvc, alias: 'k8s_pvc'},
  {path: '/k8s/storageclass', component: K8sStorageclass, alias: 'k8s_storageclass'},
  {path: '/k8s/configmap', component: K8sConfigmap, alias: 'k8s_configmap'},
  {path: '/k8s/secret', component: K8sSecret, alias: 'k8s_secret'},
  {path: '/k8s/serviceaccount', component: K8sServiceaccount, alias: 'k8s_serviceaccount'},
  {path: '/k8s/role', component: K8sRole, alias: 'k8s_role'},
  {path: '/k8s/rolebinding', component: K8sRolebinding, alias: 'k8s_rolebinding'},
  {path: '/k8s/clusterrole', component: K8sClusterRole, alias: 'k8s_clusterrole'},
  {path: '/k8s/clusterrolebinding', component: K8sClusterRoleBinding, alias: 'k8s_clusterrolebinding'},

  {path: '/auth', component: AuthUser, alias: 'auth', icon: <SafetyOutlined />},
  {path: '/auth/dept', component: AuthDept, alias: 'auth_dept'},
  {path: '/auth/user', component: AuthUser, alias: 'auth_user'},
  {path: '/auth/role', component: AuthRole, alias: 'auth_role'},
  {path: '/auth/perm', component: AuthPerm, alias: 'auth_perm'},
  {path: '/auth/menu', component: AuthMenu, alias: 'auth_menu'},

  {path: '/system', component: SystemLog, alias: 'system', icon: <SettingOutlined />},
  {path: '/system/terminal', component: SystemTerminal, alias: 'system_terminal'},
  {path: '/system/log', component: SystemLog, alias: 'system_log'},

  {path: '*', component: NotFound},
];

export default routes;
