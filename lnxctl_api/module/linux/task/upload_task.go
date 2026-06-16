package task

import (
	"encoding/json"
	"log"
	"mime/multipart"
	"net/http"

	"lnxctl/util"
)

func UploadTask(response http.ResponseWriter, request *http.Request) {
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

	var data []map[string]any
	err = json.NewDecoder(file).Decode(&data)
	util.Raise(err)

	log.Println("data:", data)

	{
		var item map[string]any
		for _, item = range data {
			log.Println("item:", item)

			var name string
			var command string
			var remark string
			var create_time string
			var update_time string

			name = item["name"].(string)
			command = item["command"].(string)
			remark = item["remark"].(string)
			create_time = item["create_time"].(string)
			update_time = item["update_time"].(string)

			{
				var query string
				query = `
					INSERT INTO linux_task (
						name, command,
						remark, create_time, update_time
					)
					VALUES (?,?,?,?,?)
				`
				_, err = util.DB.Exec(
					query,
					name, command,
					remark, create_time, update_time,
				)
				util.Raise(err)
			}
		}
	}

	util.Api(response, 200)
}
