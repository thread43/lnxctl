package service

import (
	"encoding/json"
	"log"
	"mime/multipart"
	"net/http"

	"lnxctl/util"
)

func UploadService(response http.ResponseWriter, request *http.Request) {
	var err error

	err = request.ParseMultipartForm(64 << 20)
	util.Raise(err)

	var file multipart.File
	var file_header *multipart.FileHeader

	file, file_header, err = request.FormFile("file")
	util.Raise(err)
	defer func() {
		_ = file.Close()
		log.Println("file closed......")
	}()

	log.Println("uploaded file name:", file_header.Filename)
	log.Println("uploaded file size:", file_header.Size)
	log.Println("uploaded file header:", file_header.Header)

	var data []map[string]interface{}
	err = json.NewDecoder(file).Decode(&data)
	util.Raise(err)

	log.Println("data:", data)

	{
		var item map[string]interface{}
		for _, item = range data {
			log.Println("item:", item)

			var name string
			var start_cmd string
			var stop_cmd string
			var restart_cmd string
			var reload_cmd string
			var status_cmd string
			var term_cmd string
			var remark string
			var create_time string
			var update_time string

			name = item["name"].(string)
			start_cmd = item["start_cmd"].(string)
			stop_cmd = item["stop_cmd"].(string)
			restart_cmd = item["restart_cmd"].(string)
			reload_cmd = item["reload_cmd"].(string)
			status_cmd = item["status_cmd"].(string)
			term_cmd = item["term_cmd"].(string)
			remark = item["remark"].(string)
			create_time = item["create_time"].(string)
			update_time = item["update_time"].(string)

			{
				var query string
				query = `
					INSERT INTO linux_service (
						name,
						start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
						term_cmd,
						remark, create_time, update_time
					)
					VALUES (?,?,?,?,?,?,?,?,?,?)
				`
				_, err = util.DB.Exec(
					query,
					name,
					start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
					term_cmd,
					remark, create_time, update_time,
				)
				util.Raise(err)
			}
		}
	}

	util.Api(response, 200)
}
