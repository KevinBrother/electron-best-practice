package main

import (
	"fmt"
	"os"
	"sort"
	"strings"
)

func main() {
	fmt.Println("=== Go Subprocess: Environment Variables ===")
	fmt.Printf("PID: %d\n", os.Getpid())
	fmt.Printf("PPID: %d\n", os.Getppid())
	fmt.Println()
	
	// 特别关注的变量
	specialVars := []string{"NO_NEW_PRIVS", "no_new_privs", "No_New_Privs"}
	fmt.Println("=== Special Variables (no_new_privs) ===")
	for _, key := range specialVars {
		value, exists := os.LookupEnv(key)
		if exists {
			fmt.Printf("  %s = %s\n", key, value)
		} else {
			fmt.Printf("  %s = (not set)\n", key)
		}
	}
	fmt.Println()
	
	// 打印所有环境变量（排序后）
	fmt.Println("=== All Environment Variables ===")
	env := os.Environ()
	sort.Strings(env)
	
	for _, e := range env {
		parts := strings.SplitN(e, "=", 2)
		if len(parts) == 2 {
			fmt.Printf("  %s = %s\n", parts[0], parts[1])
		} else {
			fmt.Printf("  %s\n", e)
		}
	}
	
	fmt.Println()
	fmt.Println("=== Environment Variables Count ===")
	fmt.Printf("Total: %d variables\n", len(env))
}