package task

import (
	"database/sql"
	"net/http"

	"lnxctl/util"
)

func GetTasks(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = `
		SELECT
			id, name, command,
			remark, create_time, update_time
		FROM linux_task
		ORDER BY name
	`

	var tasks []map[string]any
	tasks = make([]map[string]any, 0)

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
			var command sql.NullString
			var remark sql.NullString
			var create_time sql.NullString
			var update_time sql.NullString

			err = rows.Scan(
				&id, &name, &command,
				&remark, &create_time, &update_time,
			)
			util.Raise(err)

			tasks = append(
				tasks,
				map[string]any{
					"id":          id.Int64,
					"name":        name.String,
					"command":     command.String,
					"remark":      remark.String,
					"create_time": create_time.String,
					"update_time": update_time.String,
				},
			)
		}
	}

	util.Api(response, 200, tasks)
}
