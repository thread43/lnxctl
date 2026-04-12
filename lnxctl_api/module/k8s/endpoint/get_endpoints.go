package endpoint

import (
	"context"
	"fmt"
	"net/http"
	"net/netip"
	"sort"
	"strconv"
	"strings"
	"time"

	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetEndpoints(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))

	if util.IsNotSet(cluster_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(cluster_id) {
		util.Api(response, 400)
		return
	}

	var cluster_id2 int64
	cluster_id2, err = strconv.ParseInt(cluster_id, 10, 64)
	util.Raise(err)

	var rest_config *rest.Config
	rest_config, err = k8s_common.GetRestConfig(cluster_id2)
	util.Raise(err)

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	var endpoint_list *core_v1.EndpointsList
	endpoint_list, err = clientset.CoreV1().Endpoints(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var endpoints []map[string]interface{}
	endpoints = make([]map[string]interface{}, 0)

	var item core_v1.Endpoints
	for _, item = range endpoint_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var address_ports []string
		address_ports = make([]string, 0)

		var subset core_v1.EndpointSubset
		for _, subset = range item.Subsets {
			var address core_v1.EndpointAddress
			for _, address = range subset.Addresses {
				var port core_v1.EndpointPort
				for _, port = range subset.Ports {
					address_ports = append(address_ports, fmt.Sprintf("%s:%d", address.IP, port.Port))
				}
			}
		}

		// sort.Strings(address_ports)
		sort.Slice(address_ports, func(i int, j int) bool {
			var addr_port_i netip.AddrPort
			var addr_port_j netip.AddrPort

			var err_i error
			var err_j error

			addr_port_i, err_i = netip.ParseAddrPort(address_ports[i])
			addr_port_j, err_j = netip.ParseAddrPort(address_ports[j])

			if err_i != nil || err_j != nil {
				return address_ports[i] < address_ports[j]
			}

			var addr_i netip.Addr
			var addr_j netip.Addr

			addr_i = addr_port_i.Addr()
			addr_j = addr_port_j.Addr()

			if addr_i != addr_j {
				return addr_i.Less(addr_j)
			}

			return addr_port_i.Port() < addr_port_j.Port()
		})

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		endpoints = append(
			endpoints,
			map[string]interface{}{
				"cluster_id":    cluster_id2,
				"namespace":     namespace,
				"name":          name,
				"address_ports": address_ports,
				"age":           age,
			},
		)
	}

	util.Api(response, 200, endpoints)
}
