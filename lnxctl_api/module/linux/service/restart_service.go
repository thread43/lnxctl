package service

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	linux_service_common "lnxctl/module/linux/service/common"
	"lnxctl/util"
)

func RestartService(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = strings.TrimSpace(request.FormValue("id"))

	if util.IsNotSet(id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var id2 int64
	id2, err = strconv.ParseInt(id, 10, 64)
	util.Raise(err)

	var service map[string]interface{}
	service, err = linux_service_common.GetService(id2)
	util.Raise(err)

	var cmd string
	cmd = service["restart_cmd"].(string)
	log.Println("cmd:", cmd)
	if cmd == "" {
		util.Api(response, 400)
	}

	var cmd_exit_code int64
	var cmd_output string

	cmd_output, err = util.ExecCmdWithTimeout(cmd, 60)

	if err != nil {
		cmd_exit_code = 1
	}

	log.Println(err)
	log.Println(cmd_output)

	if err != nil {
		cmd_output = err.Error()
	}

	service["cmd_exit_code"] = cmd_exit_code
	service["cmd_output"] = cmd_output

	util.Api(response, 200, service)
}
