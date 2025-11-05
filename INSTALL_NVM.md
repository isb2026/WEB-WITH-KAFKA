# MacBook에서 NVM 설치 가이드

이 문서는 macOS(맥북) 환경에 NVM(Node Version Manager)을 설치하고 설정하는 과정을 단계별로 안내합니다.

---

## 목차

1. 요구 사항
2. 설치 방법
    - 방법 1: Homebrew를 이용한 설치
    - 방법 2: 공식 설치 스크립트(cURL) 이용
3. 셸 설정(zsh/bash)
4. 설치 확인
5. 기본 사용 예시
6. 문제 해결(Troubleshooting)
7. 참고 자료

---

## 1. 요구 사항

- macOS 10.12 이상
- Xcode 명령어 도구 설치
    ```bash
    xcode-select --install
    ```
- (선택) Homebrew 설치
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

---

## 2. 설치 방법

### 방법 1: Homebrew를 이용한 설치

1. Homebrew 업데이트
    ```bash
    brew update
    ```
2. nvm 설치
    ```bash
    brew install nvm
    ```
3. nvm 디렉터리 생성
    ```bash
    mkdir ~/.nvm
    ```

### 방법 2: 공식 설치 스크립트(cURL) 이용

1. 설치 스크립트 실행
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    ```
    _버전(`v0.39.5`)은 적절히 최신 버전으로 변경하세요._

---

## 3. 셸 설정(zsh 또는 bash)

설치 후, 셸 설정 파일에 아래 내용을 추가해야 합니다.

### zsh 사용 시 (`~/.zshrc`)

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"        # nvm 로드
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # 자동 완성
```

### bash 사용 시 (`~/.bash_profile` 또는 `~/.bashrc`)

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"        # nvm 로드
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 자동 완성
```

설정 저장 후, 셸 재시작 또는 설정 파일 재로딩:

```bash
source ~/.zshrc   # 또는 source ~/.bash_profile
```

---

## 4. 설치 확인

```bash
nvm --version
# 설치된 nvm 버전이 출력되면 성공
```

---

## 5. 기본 사용 예시

- Node.js 버전 목록 확인
    ```bash
    nvm ls-remote
    ```
- 최신 LTS 버전 설치
    ```bash
    nvm install --lts
    ```
- 특정 버전 설치 및 사용 설정
    ```bash
    nvm install 18.16.0
    nvm use 18.16.0
    ```
- 기본(default) 버전 설정
    ```bash
    nvm alias default 18.16.0
    ```

---

## 6. 문제 해결(Troubleshooting)

- `nvm: command not found` 오류:

    - 셸 설정 파일에 `export NVM_DIR` 및 로드 스크립트가 제대로 추가되었는지 확인
    - 설정 파일에서 오타 여부 확인
    - `source ~/.zshrc` 등으로 재로딩

- 설치 디렉터리 권한 문제:
    ```bash
    sudo chown -R $(whoami) ~/.nvm
    ```

---

## 7. 참고 자료

- NVM 공식 GitHub: https://github.com/nvm-sh/nvm
- Homebrew 공식: https://brew.sh

---

_작성일: 2025-04-30_

#
