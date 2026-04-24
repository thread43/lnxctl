package target

import (
	"net/http"
	"strconv"
	"strings"

	"lnxctl/util"
)

func UpdateTarget(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var name string
	var crontab string
	var type2 string
	var ping_host string
	var tcp_host string
	var tcp_port string
	var http_url string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	name = strings.TrimSpace(request.FormValue("name"))
	crontab = strings.TrimSpace(request.FormValue("crontab"))
	type2 = strings.TrimSpace(request.FormValue("type"))
	ping_host = strings.TrimSpace(request.FormValue("ping_host"))
	tcp_host = strings.TrimSpace(request.FormValue("tcp_host"))
	tcp_port = strings.TrimSpace(request.FormValue("tcp_port"))
	http_url = strings.TrimSpace(request.FormValue("http_url"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(id, name, crontab, type2) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id, type2) {
		util.Api(response, 400)
		return
	}

	var type3 int64
	type3, err = strconv.ParseInt(type2, 10, 64)
	util.Raise(err)

	{
		if type3 == 1 {
			if util.IsNotSet(ping_host) {
				util.Api(response, 400)
				return
			}
		}
		if type3 == 2 {
			if util.IsNotSet(tcp_host, tcp_port) {
				util.Api(response, 400)
				return
			}
			if util.IsNotInt(tcp_port) {
				util.Api(response, 400)
				return
			}
		}
		if type3 == 3 {
			if util.IsNotSet(http_url) {
				util.Api(response, 400)
				return
			}
		}
	}

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE monitoring_target
			SET
				name=?, crontab=?, type=?,
				ping_host=?,
				tcp_host=?, tcp_port=?,
				http_url=?,
				remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			name, crontab, type3,
			ping_host,
			tcp_host, tcp_port,
			http_url,
			remark, update_time,
			id,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
