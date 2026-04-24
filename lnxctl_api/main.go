package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "net/http/pprof"

	auth_dept "lnxctl/module/auth/dept"
	auth_menu "lnxctl/module/auth/menu"
	auth_perm "lnxctl/module/auth/perm"
	auth_role "lnxctl/module/auth/role"
	auth_user "lnxctl/module/auth/user"
	common "lnxctl/module/common"
	docker_common "lnxctl/module/docker/common"
	docker_container "lnxctl/module/docker/container"
	docker_image "lnxctl/module/docker/image"
	docker_network "lnxctl/module/docker/network"
	docker_server "lnxctl/module/docker/server"
	index "lnxctl/module/index"
	k8s_cluster "lnxctl/module/k8s/cluster"
	k8s_clusterrole "lnxctl/module/k8s/clusterrole"
	k8s_clusterrolebinding "lnxctl/module/k8s/clusterrolebinding"
	k8s_common "lnxctl/module/k8s/common"
	k8s_configmap "lnxctl/module/k8s/configmap"
	k8s_cronjob "lnxctl/module/k8s/cronjob"
	k8s_daemonset "lnxctl/module/k8s/daemonset"
	k8s_deployment "lnxctl/module/k8s/deployment"
	k8s_endpoint "lnxctl/module/k8s/endpoint"
	k8s_ingress "lnxctl/module/k8s/ingress"
	k8s_job "lnxctl/module/k8s/job"
	k8s_namespace "lnxctl/module/k8s/namespace"
	k8s_node "lnxctl/module/k8s/node"
	k8s_pod "lnxctl/module/k8s/pod"
	k8s_pv "lnxctl/module/k8s/pv"
	k8s_pvc "lnxctl/module/k8s/pvc"
	k8s_replicaset "lnxctl/module/k8s/replicaset"
	k8s_role "lnxctl/module/k8s/role"
	k8s_rolebinding "lnxctl/module/k8s/rolebinding"
	k8s_secret "lnxctl/module/k8s/secret"
	k8s_service "lnxctl/module/k8s/service"
	k8s_serviceaccount "lnxctl/module/k8s/serviceaccount"
	k8s_statefulset "lnxctl/module/k8s/statefulset"
	k8s_storageclass "lnxctl/module/k8s/storageclass"
	linux_cronjob "lnxctl/module/linux/cronjob"
	linux_host "lnxctl/module/linux/host"
	linux_service "lnxctl/module/linux/service"
	monitoring_cronjob "lnxctl/module/monitoring/cronjob"
	monitoring_target "lnxctl/module/monitoring/target"
	system_log "lnxctl/module/system/log"
	system_terminal "lnxctl/module/system/terminal"
	test "lnxctl/module/test"
	"lnxctl/util"
)

type Route struct {
	path    string
	handler func(http.ResponseWriter, *http.Request)
}

var Routes = []Route{
	{"/api/common/change_password", common.ChangePassword},
	{"/api/common/get_current_user", common.GetCurrentUser},
	{"/api/common/get_menus", common.GetMenus},
	{"/api/common/get_perm_codes", common.GetPermCodes},
	{"/api/common/get_perms", common.GetPerms},
	{"/api/common/login", common.Login},
	{"/api/common/logout", common.Logout},
	{"/api/common/update_profile", common.UpdateProfile},

	{"/api/index/get_statistics", index.GetStatistics},

	{"/api/auth/dept/add_dept", auth_dept.AddDept},
	{"/api/auth/dept/delete_dept", auth_dept.DeleteDept},
	{"/api/auth/dept/get_dept", auth_dept.GetDept},
	{"/api/auth/dept/get_depts", auth_dept.GetDepts},
	{"/api/auth/dept/update_dept", auth_dept.UpdateDept},

	{"/api/auth/user/add_user", auth_user.AddUser},
	{"/api/auth/user/assign_role", auth_user.AssignRole},
	{"/api/auth/user/delete_user", auth_user.DeleteUser},
	{"/api/auth/user/disable_user", auth_user.DisableUser},
	{"/api/auth/user/enable_user", auth_user.EnableUser},
	{"/api/auth/user/get_depts", auth_user.GetDepts},
	{"/api/auth/user/get_perms", auth_user.GetPerms},
	{"/api/auth/user/get_roles", auth_user.GetRoles},
	{"/api/auth/user/get_user", auth_user.GetUser},
	{"/api/auth/user/get_users", auth_user.GetUsers},
	{"/api/auth/user/grant_perm", auth_user.GrantPerm},
	{"/api/auth/user/reset_password", auth_user.ResetPassword},
	{"/api/auth/user/update_user", auth_user.UpdateUser},

	{"/api/auth/role/add_role", auth_role.AddRole},
	{"/api/auth/role/delete_role", auth_role.DeleteRole},
	{"/api/auth/role/get_perms", auth_role.GetPerms},
	{"/api/auth/role/get_role", auth_role.GetRole},
	{"/api/auth/role/get_roles", auth_role.GetRoles},
	{"/api/auth/role/grant_perm", auth_role.GrantPerm},
	{"/api/auth/role/update_role", auth_role.UpdateRole},

	{"/api/auth/perm/add_perm", auth_perm.AddPerm},
	{"/api/auth/perm/delete_perm", auth_perm.DeletePerm},
	{"/api/auth/perm/get_menus", auth_perm.GetMenus},
	{"/api/auth/perm/get_perm", auth_perm.GetPerm},
	{"/api/auth/perm/get_perms", auth_perm.GetPerms},
	{"/api/auth/perm/update_perm", auth_perm.UpdatePerm},

	{"/api/auth/menu/add_menu", auth_menu.AddMenu},
	{"/api/auth/menu/delete_menu", auth_menu.DeleteMenu},
	{"/api/auth/menu/get_menu", auth_menu.GetMenu},
	{"/api/auth/menu/get_menus", auth_menu.GetMenus},
	{"/api/auth/menu/get_parent_menus", auth_menu.GetParentMenus},
	{"/api/auth/menu/sort_menu", auth_menu.SortMenu},
	{"/api/auth/menu/update_menu", auth_menu.UpdateMenu},

	{"/api/system/terminal/ws_open_terminal", system_terminal.WsOpenTerminal},

	{"/api/system/log/get_log", system_log.GetLog},
	{"/api/system/log/get_logs", system_log.GetLogs},

	{"/api/linux/host/add_host", linux_host.AddHost},
	{"/api/linux/host/delete_host", linux_host.DeleteHost},
	{"/api/linux/host/download_host_file", linux_host.DownloadHostFile},
	{"/api/linux/host/get_host", linux_host.GetHost},
	{"/api/linux/host/get_host_files", linux_host.GetHostFiles},
	{"/api/linux/host/get_hosts", linux_host.GetHosts},
	{"/api/linux/host/update_host", linux_host.UpdateHost},
	{"/api/linux/host/upload_host_file", linux_host.UploadHostFile},
	{"/api/linux/host/ws_open_host_terminal", linux_host.WsOpenHostTerminal},

	{"/api/linux/service/add_service", linux_service.AddService},
	{"/api/linux/service/delete_service", linux_service.DeleteService},
	{"/api/linux/service/get_service", linux_service.GetService},
	{"/api/linux/service/get_services", linux_service.GetServices},
	{"/api/linux/service/update_service", linux_service.UpdateService},
	{"/api/linux/service/ws_open_service_terminal", linux_service.WsOpenServiceTerminal},

	{"/api/docker/server/add_server", docker_server.AddServer},
	{"/api/docker/server/delete_server", docker_server.DeleteServer},
	{"/api/docker/server/get_server", docker_server.GetServer},
	{"/api/docker/server/get_servers", docker_server.GetServers},
	{"/api/docker/server/update_server", docker_server.UpdateServer},

	{"/api/docker/image/get_images", docker_image.GetImages},
	{"/api/docker/image/get_servers", docker_common.GetServers},
	{"/api/docker/image/inspect_image", docker_image.InspectImage},

	{"/api/docker/container/download_container_file", docker_container.DownloadContainerFile},
	{"/api/docker/container/download_container_log", docker_container.DownloadContainerLog},
	{"/api/docker/container/get_container_files", docker_container.GetContainerFiles},
	{"/api/docker/container/get_container_log", docker_container.GetContainerLog},
	{"/api/docker/container/get_containers", docker_container.GetContainers},
	{"/api/docker/container/get_servers", docker_common.GetServers},
	{"/api/docker/container/inspect_container", docker_container.InspectContainer},
	{"/api/docker/container/restart_container", docker_container.RestartContainer},
	{"/api/docker/container/upload_container_file", docker_container.UploadContainerFile},
	{"/api/docker/container/ws_open_container_terminal", docker_container.WsOpenContainerTerminal},

	{"/api/docker/network/get_networks", docker_network.GetNetworks},
	{"/api/docker/network/get_servers", docker_common.GetServers},
	{"/api/docker/network/inspect_network", docker_network.InspectNetwork},

	{"/api/k8s/cluster/add_cluster", k8s_cluster.AddCluster},
	{"/api/k8s/cluster/delete_cluster", k8s_cluster.DeleteCluster},
	{"/api/k8s/cluster/get_cluster", k8s_cluster.GetCluster},
	{"/api/k8s/cluster/get_clusters", k8s_cluster.GetClusters},
	{"/api/k8s/cluster/get_events", k8s_cluster.GetEvents},
	{"/api/k8s/cluster/update_cluster", k8s_cluster.UpdateCluster},

	{"/api/k8s/namespace/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/namespace/get_namespace_yaml", k8s_namespace.GetNamespaceYaml},
	{"/api/k8s/namespace/get_namespaces", k8s_namespace.GetNamespaces},

	{"/api/k8s/node/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/node/get_node_yaml", k8s_node.GetNodeYaml},
	{"/api/k8s/node/get_nodes", k8s_node.GetNodes},

	{"/api/k8s/pod/delete_pod", k8s_pod.DeletePod},
	{"/api/k8s/pod/download_pod_file", k8s_pod.DownloadPodFile},
	{"/api/k8s/pod/download_pod_log", k8s_pod.DownloadPodLog},
	{"/api/k8s/pod/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/pod/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/pod/get_pod_files", k8s_pod.GetPodFiles},
	{"/api/k8s/pod/get_pod_log", k8s_pod.GetPodLog},
	{"/api/k8s/pod/get_pod_yaml", k8s_pod.GetPodYaml},
	{"/api/k8s/pod/get_pods", k8s_pod.GetPods},
	{"/api/k8s/pod/upload_pod_file", k8s_pod.UploadPodFile},
	{"/api/k8s/pod/ws_get_pod_log", k8s_pod.WsGetPodLog},
	{"/api/k8s/pod/ws_open_pod_terminal", k8s_pod.WsOpenPodTerminal},

	{"/api/k8s/deployment/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/deployment/get_deployment_yaml", k8s_deployment.GetDeploymentYaml},
	{"/api/k8s/deployment/get_deployments", k8s_deployment.GetDeployments},
	{"/api/k8s/deployment/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/replicaset/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/replicaset/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/replicaset/get_replicaset_yaml", k8s_replicaset.GetReplicasetYaml},
	{"/api/k8s/replicaset/get_replicasets", k8s_replicaset.GetReplicasets},

	{"/api/k8s/statefulset/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/statefulset/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/statefulset/get_statefulset_yaml", k8s_statefulset.GetStatefulsetYaml},
	{"/api/k8s/statefulset/get_statefulsets", k8s_statefulset.GetStatefulsets},

	{"/api/k8s/daemonset/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/daemonset/get_daemonset_yaml", k8s_daemonset.GetDaemonsetYaml},
	{"/api/k8s/daemonset/get_daemonsets", k8s_daemonset.GetDaemonsets},
	{"/api/k8s/daemonset/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/job/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/job/get_job_yaml", k8s_job.GetJobYaml},
	{"/api/k8s/job/get_jobs", k8s_job.GetJobs},
	{"/api/k8s/job/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/cronjob/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/cronjob/get_cronjob_yaml", k8s_cronjob.GetCronjobYaml},
	{"/api/k8s/cronjob/get_cronjobs", k8s_cronjob.GetCronjobs},
	{"/api/k8s/cronjob/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/service/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/service/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/service/get_service_yaml", k8s_service.GetServiceYaml},
	{"/api/k8s/service/get_services", k8s_service.GetServices},

	{"/api/k8s/endpoint/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/endpoint/get_endpoint_yaml", k8s_endpoint.GetEndpointYaml},
	{"/api/k8s/endpoint/get_endpoints", k8s_endpoint.GetEndpoints},
	{"/api/k8s/endpoint/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/ingress/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/ingress/get_ingress_yaml", k8s_ingress.GetIngressYaml},
	{"/api/k8s/ingress/get_ingresses", k8s_ingress.GetIngresses},
	{"/api/k8s/ingress/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/pv/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/pv/get_pv_yaml", k8s_pv.GetPvYaml},
	{"/api/k8s/pv/get_pvs", k8s_pv.GetPvs},

	{"/api/k8s/pvc/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/pvc/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/pvc/get_pvc_yaml", k8s_pvc.GetPvcYaml},
	{"/api/k8s/pvc/get_pvcs", k8s_pvc.GetPvcs},

	{"/api/k8s/storageclass/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/storageclass/get_storageclass_yaml", k8s_storageclass.GetStorageclassYaml},
	{"/api/k8s/storageclass/get_storageclasses", k8s_storageclass.GetStorageclasses},

	{"/api/k8s/configmap/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/configmap/get_configmap_yaml", k8s_configmap.GetConfigmapYaml},
	{"/api/k8s/configmap/get_configmaps", k8s_configmap.GetConfigmaps},
	{"/api/k8s/configmap/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/secret/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/secret/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/secret/get_secret_yaml", k8s_secret.GetSecretYaml},
	{"/api/k8s/secret/get_secrets", k8s_secret.GetSecrets},

	{"/api/k8s/serviceaccount/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/serviceaccount/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/serviceaccount/get_serviceaccount_yaml", k8s_serviceaccount.GetServiceaccountYaml},
	{"/api/k8s/serviceaccount/get_serviceaccounts", k8s_serviceaccount.GetServiceaccounts},

	{"/api/k8s/role/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/role/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/role/get_role_yaml", k8s_role.GetRoleYaml},
	{"/api/k8s/role/get_roles", k8s_role.GetRoles},

	{"/api/k8s/rolebinding/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/rolebinding/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/rolebinding/get_rolebinding_yaml", k8s_rolebinding.GetRolebindingYaml},
	{"/api/k8s/rolebinding/get_rolebindings", k8s_rolebinding.GetRolebindings},

	{"/api/k8s/clusterrole/get_clusterrole_yaml", k8s_clusterrole.GetClusterroleYaml},
	{"/api/k8s/clusterrole/get_clusterroles", k8s_clusterrole.GetClusterroles},
	{"/api/k8s/clusterrole/get_clusters", k8s_common.GetClusters},

	{"/api/k8s/clusterrolebinding/get_clusterrolebinding_yaml", k8s_clusterrolebinding.GetClusterrolebindingYaml},
	{"/api/k8s/clusterrolebinding/get_clusterrolebindings", k8s_clusterrolebinding.GetClusterrolebindings},
	{"/api/k8s/clusterrolebinding/get_clusters", k8s_common.GetClusters},

	{"/api/monitoring/target/add_target", monitoring_target.AddTarget},
	{"/api/monitoring/target/delete_target", monitoring_target.DeleteTarget},
	{"/api/monitoring/target/disable_target", monitoring_target.DisableTarget},
	{"/api/monitoring/target/enable_target", monitoring_target.EnableTarget},
	{"/api/monitoring/target/get_target", monitoring_target.GetTarget},
	{"/api/monitoring/target/get_targets", monitoring_target.GetTargets},
	{"/api/monitoring/target/update_target", monitoring_target.UpdateTarget},

	{"/api/test", test.Test},
}

func main() {
	defer util.Catch()

	defer func() {
		_ = util.DB.Close()
	}()

	var err error

	var host string
	var port int
	var sqlite string
	var mysql string
	var log2 string
	var debug2 bool
	var cronjob bool

	flag.StringVar(&host, "host", "0.0.0.0", "Host (e.g. 0.0.0.0|127.0.0.1)")
	flag.IntVar(&port, "port", 1234, "Port")
	flag.StringVar(&sqlite, "sqlite", "lnxctl.db", "SQLite (e.g. lnxctl.db)")
	flag.StringVar(&mysql, "mysql", "", "MySQL (e.g. root:123456@tcp(127.0.0.1:3306)/lnxctl)")
	flag.StringVar(&log2, "log", "stdout", "Log (e.g. stdout|file)")
	flag.BoolVar(&debug2, "debug", false, "Debug")
	flag.BoolVar(&cronjob, "cronjob", true, "Cronjob")

	flag.Parse()

	{
		log.SetFlags(log.LstdFlags | log.Lshortfile)
		if log2 == "file" {
			var logfile *os.File
			logfile, err = os.OpenFile("lnxctl.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			util.Raise(err)
			defer func() {
				_ = logfile.Close()
			}()
			log.SetOutput(logfile)
		} else {
			log.SetOutput(os.Stdout)
		}
	}

	log.Printf("host: %v\n", host)
	log.Printf("port: %v\n", port)
	log.Printf("sqlite: %v\n", sqlite)
	log.Printf("mysql: %v\n", mysql)
	log.Printf("log: %v\n", log2)
	log.Printf("debug: %v\n", debug2)
	log.Printf("cronjob: %v\n", cronjob)

	var address string
	address = fmt.Sprintf("%s:%d", host, port)
	log.Printf("address: %v\n", address)

	if mysql != "" {
		log.Println(mysql)
		util.InitDbWithMysql(mysql)
	} else {
		log.Println(sqlite)
		util.InitDbWithSqlite(sqlite)
	}

	if debug2 {
		util.DEBUG = true

		go func() {
			defer util.Catch()
			log.Println("net/http/pprof started, http://127.0.0.1:6060/debug/pprof/")
			err = http.ListenAndServe("127.0.0.1:6060", nil)
			util.Raise(err)
		}()
	}

	util.Init()

	util.InitProfiler()

	if cronjob {
		log.Println("cronjob started......")
		linux_cronjob.StartCronjob()
		monitoring_cronjob.StartCronjob()
	}

	http.HandleFunc("/favicon.ico", util.MakeHandler(util.NotFound))

	var route Route
	for _, route = range Routes {
		http.HandleFunc(route.path, util.MakeHandler(route.handler))
	}

	var file_server_handler http.Handler
	file_server_handler = http.FileServer(http.Dir("html"))
	http.Handle("/", util.WrapHandler(file_server_handler))

	// :1234, 0.0.0.0:1234, 127.0.0.1:1234
	fmt.Printf("http://%s/\n", address)
	log.Printf("http://%s/\n", address)
	err = http.ListenAndServe(address, nil)

	log.Fatal(err)
}
