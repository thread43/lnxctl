package job

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	batch_v1 "k8s.io/api/batch/v1"
	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetJobs(response http.ResponseWriter, request *http.Request) {
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

	var job_list *batch_v1.JobList
	job_list, err = clientset.BatchV1().Jobs(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var jobs []map[string]interface{}
	jobs = make([]map[string]interface{}, 0)

	var item batch_v1.Job
	for _, item = range job_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		// Running|Failed|Complete
		var status string
		status = "Unknown"
		{
			if item.Status.StartTime == nil {
				status = "Pending"
			}

			// 1|0
			if item.Status.Active > 0 {
				status = "Running"
			} else {
			}

			if len(item.Status.Conditions) == 0 {
			}

			if len(item.Status.Conditions) != 0 {
				// FailureTarget -> Failed
				// SuccessCriteriaMet -> Complete
				var condition batch_v1.JobCondition
				for _, condition = range item.Status.Conditions {
					// True|False|Unknown
					if condition.Status == core_v1.ConditionTrue {
						switch condition.Type {
						case batch_v1.JobFailed:
							status = "Failed"
						case batch_v1.JobComplete:
							status = "Complete"
						case batch_v1.JobSuspended:
							status = "Suspended"
						}
					} else {
						log.Printf("%+v\n", condition)
					}
				}
			}
		}

		var succeeded int32
		var completions int32

		succeeded = item.Status.Succeeded
		completions = *item.Spec.Completions

		var duration2 string
		if item.Status.StartTime != nil {
			var start_time time.Time
			start_time = item.Status.StartTime.Time

			var end_time time.Time
			end_time = time.Now()

			if item.Status.CompletionTime != nil {
				end_time = item.Status.CompletionTime.Time
			}

			duration2 = duration.ShortHumanDuration(end_time.Sub(start_time))
		}

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		var containers []map[string]string
		containers = make([]map[string]string, 0)

		var container core_v1.Container
		for _, container = range item.Spec.Template.Spec.Containers {
			containers = append(
				containers,
				map[string]string{
					"name":  container.Name,
					"image": container.Image,
				})
		}

		jobs = append(
			jobs,
			map[string]interface{}{
				"cluster_id":  cluster_id2,
				"namespace":   namespace,
				"name":        name,
				"age":         age,
				"status":      status,
				"succeeded":   succeeded,
				"completions": completions,
				"duration":    duration2,
				"containers":  containers,
			},
		)
	}

	util.Api(response, 200, jobs)
}
