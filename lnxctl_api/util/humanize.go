package util

import (
	"fmt"
)

// B, kB, MB, GB, TB, PB, EB
// B  [0, 1000)
// kB [1000, 1000000)
// MB [1000000, 1000000000)
// GB [1000000000, 1000000000000)
func HumanizeByte(value int64) string {
	if value < 1000 {
		return fmt.Sprintf("%dB", value)
	} else if value < 1000000 {
		var value2 float64
		value2 = float64(value) / 1000
		return fmt.Sprintf("%.0fkB", value2)
	} else if value < 1000000000 {
		var value2 float64
		value2 = float64(value) / 1000 / 1000
		return fmt.Sprintf("%.0fMB", value2)
	} else if value < 1000000000000 {
		var value2 float64
		value2 = float64(value) / 1000 / 1000 / 1000
		return fmt.Sprintf("%.1fGB", value2)
	} else {
		var value2 float64
		value2 = float64(value) / 1000 / 1000 / 1000
		return fmt.Sprintf("%.1fGB", value2)
	}
}
