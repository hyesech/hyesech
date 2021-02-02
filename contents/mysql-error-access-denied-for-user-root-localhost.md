---
title: Access denied for user 'root'@'localhost'
subtitle: My own way to fix MySQL access denied error
date: "2021-02-02"
---




## 문제의 에러

```bash
MySQL error: 'Access denied for user 'root'@'localhost'
```
```bash
ERROR! The server quit without updating PID file (/usr/local/var/mysql/{개인정보}.local.pid)
```


Mysql 접속 시 분명히 비밀번호를 맞게 입력했는데 접근이 거부되는 이상한 현상이 발생했다. `brew services start mysql` 명령어로 mysql을 활성화 시키고 `brew services` 로 mysql이 활성화 되어 있는지 확인 후 `mysql.server start`  명령어로 mysql 서버 접속 시 다음과 같은 Error가 발생했다.





## 어제의 해결 방법

**그냥 밀어버린다.**

Mac 환경에서 mysql을 brew로 설치한 경우 mysql의 설치 위치는 `/usr/local/var`

이다. 해당 위치로 이동 후 `rm -rf mysql` 이렇게 그냥 폴더를 통째로 다 지워버리고 `brew uninstall mysql` 명령어를 입력해서 mysql을 지웠다. 다소 무식한 방법을 선택했는데 그래서 그랬는지 이후 재설치 시 똑같은 에러가 발생했다. 

아래와 같은 명령어를 순차적으로 입력하면 현재 활성화 되고 있는 mysql processes를 중단시키는 것부터 시작해 그냥 brew로 설치한 mysql을 __완전삭제__ 할 수 있다. 

+ `ps -ax | grep mysql`
+ stop and `kill` any MySQL processes
+ `brew remove mysql`
+ `brew cleanup`
+ `sudo rm /usr/local/mysql`
+ `sudo rm -rf /usr/local/var/mysql`
+ `sudo rm -rf /usr/local/mysql*`
+ `sudo rm ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist`
+ `sudo rm -rf /Library/StartupItems/MySQLCOM`
+ `sudo rm -rf /Library/PreferencePanes/My*`
+ `launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist`
+ edit `/etc/hostconfig` and remove the line `MYSQLCOM=-YES-`
+ `rm -rf ~/Library/PreferencePanes/My*`
+ `sudo rm -rf /Library/Receipts/mysql*`
+ `sudo rm -rf /Library/Receipts/MySQL*`
+ `sudo rm -rf /private/var/db/receipts/*mysql*`
+ restart your computer just to ensure any MySQL processes are killed
+ try to run `mysql`, it shouldn't work



그런데 굳이 그렇게까지 할 필요는 없는 것 같아서 나는 두 가지 명령어만 사용했다.

```bash
rm -rf /usr/local/var/mysql
```

```bash
rm -rf /usr/local/mysql
```

그리고 다시 brew를 이용해 재설치한 후 `brew services start mysql` 그리고 `mysql_secure_installation` 작업까지 완료했다. 

성공! 문제 없이 비밀번호를 재설정하고 mysql 보안 관련 옵션을 지정한 후 그날 필요한 작업을 했음. 정말 아무런 문제가 없었다.



## 오늘의 해결 방법

아침에 일어나서 재접속을 시도했더니 같은 에러가 떴다. 

```bash
ERROR! The server quit without updating PID file (/usr/local/var/mysql/{개인정보}.local.pid).
```


어제 mysql을 그냥 다 밀어버린 이유는 내가 mysql을 오래 전에 깔아두고 방치했기 때문이다. 솔직히 비밀번호도 가물가물하고 brew도 업데이트 했으니 그냥 밀고 재설치하는 편이 낫다고 판단했기 때문인데 이렇게 되면 이야기가 다르다. 매번 작업을 할 때마다 시퀄라이즈만 믿고 local database를 밀어버리는 것은 말이 안 되기 때문에 저 에러의 원인이 무엇인지 규명할 때가 됐다. (결국 닥쳐야 해결하는구나...)

찾아보니 이 에러는 homebrew로 mysql을 설치했을 때 많이 발생하는 듯 하다. 

##### StackOverFlow User's Comments

  > same problem. Installed mysql with brew – [vrybas](https://stackoverflow.com/users/523157/vrybas)

  > same problem here. also installed with brew. – [jspooner](https://stackoverflow.com/users/68751/jspooner)

대략 이런 의견들이 많았다.
아무튼 대체 뭐가 문제인지 알려면 error log를 확인하는 쪽이 가장 빠르다고 생각한다.

`/usr/local/var/mysql/{개인정보: 본인 컴퓨터 이름}.local.err` 여기에 error log가 있다. 물론 이 파일을 읽기 위해서는 리눅스 명령어가 필요하다.

```bash
cat /usr/local/var/mysql/{개인정보: 본인 컴퓨터 이름}.local.err
```



뭐가 엄청 많은데... (에러가 이렇게 많다...) 그 중 관련있어 보이는 에러는 다음과 같다.

```bash
2021-02-02T04:48:11.080305Z 0 [ERROR] [MY-010262] [Server] Can't start server: Bind on TCP/IP port: Address already in use
```

```bash
2021-02-02T04:48:11.080598Z 0 [ERROR] [MY-010257] [Server] Do you already have another mysqld server running on port: 3306 ?
```

PORT 3306 지금 쓰고 계신 거 아닙니까? 하는 경고문이다. 3306은 mysql local 실행시 자동으로 설정되는 포트다. 이 에러를 보고 조금 민망해졌다.

```bash
lsof -i :3306
```

현재 3306 포트를 사용하고 있는 프로세스를 확인하기 위해 위와 같은 명령어를 터미널에 입력했는데 아무것도 안 떴다. 뭐지... 그래서 `lsof -i :0000` 을 입력해서 터미널 문제인지 확인했는데 그건 아니었다. 3306 포트 사용하고 있는 프로세스 없는데요? 장난하나.

그래서 아래와 같은 명령어를 사용했다.

```bash
ps -ef | grep mysql
```

ps는 프로세스의 현재 상태를 보여주는 명령어다. 그리고 뒤에 붙은 `-ef` 는 옵션인데 모든 프로세스를 풀 포맷으로 출력한다. 뒤의 `| grep mysql` 은 mysql이라는 문자열을 포함한 값만 출력하는 것이다. 저 옵션을 붙이지 않으면 프로세스의 홍수 속에서 괜한 고생을 하게 된다. 명령어를 실행하자 두 개의 프로세스가 출력되었다.

```
74  113   1  0 1:09PM ??     0:03.99 /usr/local/mysql/bin/mysqld.....
```
```
501 40887 1567  0 2:17PM ttys000  0:00.00 grep mysql
```

이렇게 두 개 출력되었다. 아래 PID 501은 방금 내가 입력한 명령어 프로세스인데 위의 PID 74는 대체 누구인지?... `brew services stop mysql` 명령어로 mysql을 비활성화 시키고 다시 프로세스를 출력했는데 그대로 남아있다. 해당 PID를 `kill` 시도했더니 `<pid> No such process` 라는 메세지가 출력되고 프로세스는 그대로였다. 약간 무서웠지만 기죽지 않고 다음 명령어를 실행했다.

```bash
lsof -i -n -P | grep mysql
```

아무것도 출력되지 않았다. 혹시 권한 문제인가 싶어서 명령어를 바꿨다.

```bash
sudo lsof -i -n -P | grep mysql
```

그러자 사용중인 두 개의 포트가 출력되었다.

```
mysqld   113     _mysql  29u *******   0t0  TCP *:33060 (LISTEN)
```
```
mysqld   113     _mysql  31u *******   0t0  TCP *:3306 (LISTEN)
```

아니 아까는 3306 포트 안 열려 있다며... 약간 억울해져서 `sudo lsof -i :3306` 으로 권한을 올려서 다시 명령어를 실행했다.

```bash
mysqld 113 _mysql  31u *******   0t0 TCP *:mysql (LISTEN)
```

그랬더니 포트가 사용되고 있다며 프로세스 정보가 출력이 되었다. (억울...) 그래서 `sudo kill -9 PID` 명령어로 역시 권한을 업그레이드 해서 해당 포트를 사용하고 있는 프로세스를 강제 종료 시켰다. 



## 죽지 않는 mysql 프로세스

그리고 진짜 죽었나 확인하려고 다시 `lsof -i : 3306` 을 입력했는데 또 살아 있는 거였다. 너무 무서웠다. 계속 `kill` 했는데 PID만 바뀌고 계속 살아 있었음. 죽지 않고 살아 돌아오는 존재가 되어 버렸다..

그렇지만 이건 컴퓨터고 저 프로세스가 저러는 데에는 반드시 이유가 있다. 문제는 의외로 단순하게 해결되었다. `system preferences` 였다. Mysql 최초 설치 시 내가 서버를 구동해놓고 여태 프로세스만 계속 `kill` 을 하고 있었던 거다. 그러니까 계속해서 mysql이 살아 돌아온 거였다. `system preferences` 에 들어가서 서버 구동을 중지한 다음 다시 3306 포트 상태를 확인해보니 포트가 비었다. 

> mac의 경우 `system preferences` 는 애플 아이콘 클릭 시 드롭다운 메뉴 안쪽에 위치하고 있다. 한국어로는 `시스템 환경설정`이다.

그리고 initialize database 작업을 진행했다. Mac 기준으로는 `system preferences` 안쪽에 버튼이 있다. 그러면 초기에 가입할 때 설정했던 root 유저 비밀번호를 설정할 수 있게 된다.



## 문제 해결 이후

```bash
//1   brew services start mysql
//2   mysql -u root -p
```

이렇게 두 명령어를 사용한 다음 설정한 root 비밀번호를 입력하면 접속된다

 현재는 초기에 설정해둔 root 유저만 local database에 존재하고 있는데, 필요에 따라 권한을 나눠서 여러명의 유저를 설정할 수도 있을 것이다. 일단은 그냥 둘 거지만.


___

##### 여담: 문제 해결하다가 발견한 것

> I got this case too on my mac, and just removed the error log, like '/usr/local/var/mysql/*.err', started successfully. – [Mathew P. Jones](https://stackoverflow.com/users/1122265/mathew-p-jones)

