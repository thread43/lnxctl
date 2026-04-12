package service

import (
	"database/sql"
	"net/http"

	"lnxctl/util"
)

func GetServices(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = `
		SELECT id, name, term_cmd, remark, create_time, update_time
		FROM linux_service
		ORDER BY name
	`

	var services []map[string]interface{}
	services = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString
			var term_cmd sql.NullString
			var remark sql.NullString
			var create_time sql.NullString
			var update_time sql.NullString

			err = rows.Scan(&id, &name, &term_cmd, &remark, &create_time, &update_time)
			util.Raise(err)

			services = append(
				services,
				map[string]interface{}{
					"id":          id.Int64,
					"name":        name.String,
					"term_cmd":    term_cmd.String,
					"remark":      remark.String,
					"create_time": create_time.String,
					"update_time": update_time.String,
				},
			)
		}
	}

	util.Api(response, 200, services)
}
