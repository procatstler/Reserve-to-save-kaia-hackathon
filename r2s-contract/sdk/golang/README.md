# R2S Go SDK

## Installation

```bash
go get github.com/r2s/sdk-go
```

## Usage

```go
package main

import (
    "fmt"
    "log"
    
    r2s "github.com/r2s/sdk-go"
)

func main() {
    // Initialize SDK
    sdk, err := r2s.NewSDK("http://localhost:8545", "your-private-key")
    if err != nil {
        log.Fatal(err)
    }
    
    // Use the SDK
    balance, err := sdk.MockUSDT.BalanceOf(nil, sdk.GetAddresses().MockUSDT)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Balance: %s\n", balance.String())
}
```
