package target

import (
	"encoding/csv"
	"log"
	"mime/multipart"
	"net/http"

	"lnxctl/util"
)

func UploadTargetCsv(response http.ResponseWriter, request *http.Request) {
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

	var reader *csv.Reader
	reader = csv.NewReader(file)

	var records [][]string
	records, err = reader.ReadAll()
	util.Raise(err)

	log.Println("records:", records)

	{
		if len(records) == 0 {
			util.Api(response, 400)
			return
		}

		var record []string
		for _, record = range records {
			if len(record) != len(records[0]) {
				util.Api(response, 400)
				return
			}
		}
	}

	{
		var record []string
		for _, record = range records[1:] {
			log.Println("record:", record)

			var name string
			var crontab string
			var type2 string
			var ping_host string
			var tcp_host string
			var tcp_port string
			var http_url string
			var is_active string
			var remark string
			var create_time string
			var update_time string

			name = record[0]
			crontab = record[1]
			type2 = record[2]
			ping_host = record[3]
			tcp_host = record[4]
			tcp_port = record[5]
			http_url = record[6]
			is_active = record[7]
			remark = record[8]
			create_time = record[9]
			update_time = record[10]

			{
				var query string
				query = `
					INSERT INTO monitoring_target (
						name, crontab, type,
						ping_host,
						tcp_host, tcp_port,
						http_url,
						is_active, remark, create_time, update_time
					)
					VALUES (?,?,?,?,?,?,?,?,?,?,?)
				`
				_, err = util.DB.Exec(
					query,
					name, crontab, type2,
					ping_host,
					tcp_host, tcp_port,
					http_url,
					is_active, remark, create_time, update_time,
				)
				util.Raise(err)
			}
		}
	}

	util.Api(response, 200)
}
