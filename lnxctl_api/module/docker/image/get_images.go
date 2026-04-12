package image

import (
	"context"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	types_image "github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

// DOCKER_HOST="unix:///var/run/docker.sock" ./lnxctl
// DOCKER_HOST="tcp://127.0.0.1:2375" ./lnxctl
// docker_client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
func GetImages(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	server_id = strings.TrimSpace(request.FormValue("server_id"))

	if util.IsNotSet(server_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(server_id) {
		util.Api(response, 400)
		return
	}

	var server_id2 int64
	server_id2, err = strconv.ParseInt(server_id, 10, 64)
	util.Raise(err)

	var host string
	host, err = docker_common.GetServerHost(server_id2)
	util.Raise(err)

	var docker_client *client.Client
	// docker_client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var image_list []types_image.Summary
	image_list, err = docker_client.ImageList(context.Background(), types_image.ListOptions{})
	if err != nil {
		log.Println(err)
		// Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
		if strings.Contains(err.Error(), "Cannot connect to the Docker daemon") {
			util.Api(response, 999)
			return
		}
	}
	util.Raise(err)

	// // docker 28.x
	// REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
	// nginx        latest    5cdef4ac3335   2 weeks ago     161MB
	// busybox      latest    af3f0f48a24e   17 months ago   4.43MB
	//
	// // docker 29.x
	// IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
	// busybox:latest   b3255e7dfbcd       6.77MB         2.22MB
	// nginx:latest     341bf0f3ce6c        240MB         65.8MB

	var images []map[string]interface{}
	images = make([]map[string]interface{}, 0)

	var image types_image.Summary
	for _, image = range image_list {
		var id string
		var image_id_raw string
		var image_id string
		var size_raw int64
		var size string
		var containers int64
		var created_raw int64
		var created time.Time

		id = image.ID
		image_id_raw = image.ID
		image_id = strings.Split(image.ID, ":")[1][0:12]

		size_raw = image.Size
		size = util.HumanizeByte(image.Size)

		containers = image.Containers
		created_raw = image.Created
		created = time.Unix(image.Created, 0)

		if len(image.RepoTags) == 0 {
			var repo_tag string
			var repo string
			var tag string

			repo_tag = "<untagged>"
			repo = "<untagged>"
			tag = "<untagged>"

			images = append(
				images,
				map[string]interface{}{
					"server_id":    server_id2,
					"id":           id,
					"image_id_raw": image_id_raw,
					"image_id":     image_id,
					"repo_tag":     repo_tag,
					"repo":         repo,
					"tag":          tag,
					"size_raw":     size_raw,
					"size":         size,
					"containers":   containers,
					"created_raw":  created_raw,
					"created":      created.Format("2006-01-02 15:04:05"),
				},
			)
		} else {
			var repo_tag string
			var repo string
			var tag string

			for _, repo_tag = range image.RepoTags {
				// repo = strings.Split(repo_tag, ":")[0] // 127.0.0.1:8080/library/busybox:latest
				// tag = strings.Split(repo_tag, ":")[1]
				repo = repo_tag[:strings.LastIndex(repo_tag, ":")]
				tag = repo_tag[strings.LastIndex(repo_tag, ":")+1:]

				images = append(
					images,
					map[string]interface{}{
						"server_id":    server_id2,
						"id":           id,
						"image_id_raw": image_id_raw,
						"image_id":     image_id,
						"repo_tag":     repo_tag,
						"repo":         repo,
						"tag":          tag,
						"size_raw":     size_raw,
						"size":         size,
						"containers":   containers,
						"created_raw":  created_raw,
						"created":      created.Format("2006-01-02 15:04:05"),
					},
				)
			}
		}
	}

	sort.Slice(images,
		func(i int, j int) bool {
			if images[i]["repo"].(string) != images[j]["repo"].(string) {
				if images[i]["repo"].(string) == "<untagged>" {
					return false // need sorting
				} else if images[j]["repo"].(string) == "<untagged>" {
					return true // no need sorting
				} else {
					return images[i]["repo"].(string) < images[j]["repo"].(string)
				}
			} else {
				return images[i]["tag"].(string) < images[j]["tag"].(string)
			}
		},
	)

	util.Api(response, 200, images)
}
