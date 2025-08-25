# Golang Contract ABI 사용 가이드

## 파일 경로

### Go 바인딩 파일
```
sdk/golang/contracts/mockusdt.go      # MockUSDT 컨트랙트 바인딩
sdk/golang/contracts/r2scampaign.go   # R2SCampaign 컨트랙트 바인딩
sdk/golang/sdk.go                     # 메인 SDK
```

### ABI 위치
Go 바인딩 파일 내부에 ABI가 문자열로 포함되어 있습니다:
- `MockUSDTABI` 상수 in `mockusdt.go`
- `R2SCampaignABI` 상수 in `r2scampaign.go`

## 사용 예제

### 1. SDK 초기화
```go
package main

import (
    "log"
    "github.com/ethereum/go-ethereum/ethclient"
    r2s "path/to/sdk/golang"
)

func main() {
    // Ethereum 클라이언트 연결
    client, err := ethclient.Dial("http://localhost:8545")
    if err != nil {
        log.Fatal(err)
    }

    // SDK 초기화
    sdk, err := r2s.NewSDK("http://localhost:8545", "")
    if err != nil {
        log.Fatal(err)
    }
}
```

### 2. 직접 컨트랙트 사용
```go
package main

import (
    "log"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/ethclient"
    contracts "path/to/sdk/golang/contracts"
)

func main() {
    client, err := ethclient.Dial("http://localhost:8545")
    if err != nil {
        log.Fatal(err)
    }

    // MockUSDT 컨트랙트 초기화
    mockUSDTAddress := common.HexToAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3")
    mockUSDT, err := contracts.NewMockUSDT(mockUSDTAddress, client)
    if err != nil {
        log.Fatal(err)
    }

    // R2SCampaign 컨트랙트 초기화
    r2sCampaignAddress := common.HexToAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
    r2sCampaign, err := contracts.NewR2SCampaign(r2sCampaignAddress, client)
    if err != nil {
        log.Fatal(err)
    }
}
```

### 3. ABI 문자열 직접 접근
```go
package main

import (
    "fmt"
    contracts "path/to/sdk/golang/contracts"
)

func main() {
    // ABI 문자열 직접 사용
    mockUSDTABI := contracts.MockUSDTABI
    r2sCampaignABI := contracts.R2SCampaignABI
    
    fmt.Println("MockUSDT ABI:", mockUSDTABI)
    fmt.Println("R2SCampaign ABI:", r2sCampaignABI)
}
```

### 4. 컨트랙트 메서드 호출
```go
// 잔액 조회 (읽기)
balance, err := mockUSDT.BalanceOf(nil, userAddress)
if err != nil {
    log.Fatal(err)
}

// 토큰 전송 (쓰기 - auth 필요)
auth := bind.NewKeyedTransactor(privateKey)
tx, err := mockUSDT.Transfer(auth, toAddress, amount)
if err != nil {
    log.Fatal(err)
}

// 캠페인 생성
tx, err = r2sCampaign.CreateCampaign(
    auth,
    "Campaign Title",
    "Description",
    "https://image.url",
    tokenAddress,
    targetAmount,
    minDeposit,
    maxDeposit,
    discountRate,
    duration,
    settlementPeriod,
)
```

## 프로젝트 구조에 통합

### Go 모듈로 사용
```bash
# go.mod에 추가
go get path/to/sdk/golang

# 또는 로컬 경로 사용
replace github.com/r2s/sdk-go => ./sdk/golang
```

### 임포트
```go
import (
    r2s "github.com/r2s/sdk-go"
    contracts "github.com/r2s/sdk-go/contracts"
)
```

## 컨트랙트 주소

```go
const (
    MockUSDTAddress    = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    R2SCampaignAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
)
```

## 주요 타입 정의

```go
// SDK 구조체
type SDK struct {
    client      *ethclient.Client
    auth        *bind.TransactOpts
    addresses   ContractAddresses
    MockUSDT    *MockUSDT
    R2SCampaign *R2SCampaign
}

// 캠페인 파라미터
type CreateCampaignParams struct {
    Title            string
    Description      string
    ImageURL         string
    TargetAmount     *big.Int
    MinDeposit       *big.Int
    MaxDeposit       *big.Int
    DiscountRate     *big.Int
    Duration         *big.Int
    SettlementPeriod *big.Int
}
```

## 빌드 및 실행

```bash
# Go 모듈 초기화
cd sdk/golang
go mod init github.com/r2s/sdk-go
go mod tidy

# 예제 실행
go run examples/golang-example.go
```

## 주의사항

1. **Private Key 관리**: 프로덕션에서는 환경변수나 안전한 키 관리 시스템 사용
2. **Gas 설정**: 트랜잭션 실행 시 적절한 가스 한도 설정
3. **에러 처리**: 모든 컨트랙트 호출에 대해 에러 처리 필수
4. **Nonce 관리**: 동시 트랜잭션 처리 시 nonce 관리 주의

## Raw ABI 파일 경로 (JSON)

JSON 형태의 ABI가 필요한 경우:
- `sdk/abi/MockUSDT.json`
- `sdk/abi/R2SCampaign.json`

## 전체 경로 요약

```
r2s-contract/
├── sdk/
│   ├── golang/
│   │   ├── contracts/
│   │   │   ├── mockusdt.go      ← MockUSDT Go 바인딩
│   │   │   └── r2scampaign.go   ← R2SCampaign Go 바인딩
│   │   ├── sdk.go               ← 메인 SDK
│   │   ├── go.mod
│   │   └── README.md
│   ├── abi/
│   │   ├── MockUSDT.json        ← Raw ABI (JSON)
│   │   └── R2SCampaign.json     ← Raw ABI (JSON)
│   └── examples/
│       └── golang-example.go    ← 사용 예제
```