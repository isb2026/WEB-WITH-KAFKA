# Solution Configs

각 솔루션별로 분리된 config 파일들을 관리합니다.

## 구조

```
configs/
├── ini.json          # 초기설정 솔루션
├── sales.json         # 영업 솔루션  
├── purchase.json      # 구매 솔루션
├── production.json    # 생산 솔루션
├── mold.json          # 금형 솔루션
├── aps.json           # APS 솔루션
├── cmms.json          # CMMS 솔루션
└── qms.json           # QMS 솔루션
```

## 사용법

각 솔루션의 Swagger API 문서를 분석하여 자동으로 config를 생성합니다.

```bash
# 특정 솔루션 config 생성
npm run generate-config -- --solution=sales --swagger-url=https://api.orcamaas.com/api-docs/sales

# 모든 config 병합하여 메인 config.json 생성
npm run merge-configs
```

## Config 구조

각 솔루션 config는 다음 구조를 따릅니다:

```json
{
  "modules": {
    "moduleName": {
      "name": "모듈명",
      "path": "solution/module",
      "route": "/solution/module",
      "tabs": [...],
      "actions": [...],
      "menuOptions": {...}
    }
  }
}
```