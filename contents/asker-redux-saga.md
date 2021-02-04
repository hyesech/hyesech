---
title: "Redux Saga 적용기"
subtitle: "Redux Saga makes my project awesome..."
date: "2021-02-04"
---

## Redux Saga

### Middleware

미들웨어란 무엇인가? 뭔가 중간에 있다는 뜻이다. 그냥 ''중간에 있는 무엇...' 이라고 이해해 버리는 것이 가장 마음에 들어서 그냥 이렇게 이해하기로 했다. 기본적으로 미들웨어는 아래와 같이 생겼다. 이렇게 작성하지 않을 수도 있지만 보통은 이렇게 생김.

```javascript
/* Example of Middleware */
const middleware = store => next => action => {
    // 여기에 하고 미들웨어 코드가 들어간다.
    // 무엇이든 미들웨어를 가지고 하고 싶은 일을 여기에 작성한다.
}
```

쓰고 보니까 진짜 이상하게 생긴 함수라는게 느껴지는데 사실 저런 형태도 그냥 함수다. 함수의 한 종류다. 공식 이름은 삼단 고차함수!

> 고차 함수는 함수를 인자로 전달 받거나 함수를 결과로 반환하는 함수를 말한다.
> 자바스크립트의 함수는 일급 객체이기 때문에 값처럼 인자로 전달할 수 있고 반환할 수도 있다. 인자로 받은 함수를 필요한 시점에 호출하거나 클로저를 생성하여 반환한다.

생긴게 저래서 그렇지 사실 위의 고차함수는 아래와 같이 다시 작성할 수 있다.

```javascript
const middleware = (store) => {
    return function (next) {
        return function (action) {
            // 하고 싶은 작업
        };
    };
};
```

첫번째로 받아온 파라미터 `store` 는 리덕스 스토어 인스턴스다. 이 안에 `dispatch`, `subscribe`, `getState` 등의 내장 함수가 들어 있다. 두 번째 `next` 는 액션을 다음 미들웨어에게 전달하는 역할을 한다. 따라서 `action` 은 현재 작동되고 있는 액션 객체이며 미들웨어는 여러개를 만들 수 있다. `next` 가 있다면 다음 미들웨어로 넘어가거나, 혹은 그 다음 미들웨어가 없다면 reducer로 넘어갈 테니까.

그러니 미들웨어는 역시 ''중간에서 뭔가 하는 것...' 이라고 이해하면 편하다.





## Redux Devtools

이제 리덕스 데브툴즈를 붙일 시간이다.

```bash
npm i redux-devtools-extension
```

설치하고 `configureStore.js`를 다음과 같이 작성한다.

```javascript
/* store/configureStore.js */
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

// import reducers
import reducer from '../reducers'

const configureStore = () => {
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware([]))
    : composeWIthDevTools(applyMiddleware([]))
const store = createStore(reducer, enhancer);
return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;

```

enhanser를 이용해서 middleware를 연결할 예정인데 개발 환경에 따라 다른 middleware를 적용하려고 한다. 삼항연산자를 이용해서 현재 개발 환경(`process.env.NODE_ENV`)가 'production'일 때, 즉 배포 환경이라면 ? 바로 뒤의 부분을 enhancer에 할당하고, 그렇지 않은 경우, 즉 개발 모드라면 : 뒤에 오는 내용을 enhancer에 할당한다는 뜻이다. 즉 개발 환경인 경우에만 `redux-devtools-extension` 기능을 사용한다.

개발 모드인 경우에만 사용해야 하는 이유는 리덕스 데브툴즈가 미들웨어로서 상태 변화를 전부 기록하기 때문이다. 당연히 배포시에는 필요 없는 기능인 데다가 보안에 취약하기 때문에 환경에 따라 다른 미들웨어를 적용해야 한다.

>  배포 환경에서 적용되는 미들웨어는 saga나 thunk가 있다.





### Redux Thunk

대표적인 미들웨어 중 하나다. 보통 비동기 작업을 처리할 때 많이 사용하는데 이걸 이용하면 액션 객체가 아닌 함수를 디스패치 할 수 있다. (redux-thunk는 리덕스를 만든 사람이 만들었다. Redux 공식 매뉴얼에서도 비동기 작업 처리를 설명할 때 이것을 예시로 든다.)

그리고 실제로 이 라이브러리의 깃허브 주소에 가서 코드를 열어보면 코드 길이를 보고 놀라게 되는데 왜냐하면 14줄이기 때문이다. 

```javascript
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

끝임. 14줄짜리 코드로 어마어마한 일을 해내고 또 깃허브 스타를 15.9k나 받았다. Wowee... (그래서 사실 이걸 받지 않아도 되고 그냥 내가 미들웨어를 작성해도 된다.)



다시 configureStore.js 파일로 돌아와서 다음과 같이 middlewares를 배열로 선언하고 enhancer 안쪽에 스프레드로 middlewares를 할당했다. (production 모드에서 사용하는 middleware다.)

```javascript
/* store/configureStore.js */
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

// import reducers
import reducer from '../reducers'

const configureStore = () => {
    // middlewares 배열 선언
    const middlewares = [];
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))	// spread
    : composeWIthDevTools(applyMiddleware([]))
const store = createStore(reducer, enhancer);
return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;

```

나는 thunk 대신 redux-saga를 쓸 예정이라 thunk를 다운 받지 않았지만 만약 thunk를 사용한다면 npm으로 설치한 다음 아래와 같이 코드를 작성해주면 된다. 레고 같다.

```javascript
// import
import thunkMiddleware from 'redux-thunk';

// middlewares 배열 선언해둔 부분
    const middlewares = [thunkMiddleware];
```

thunk는 결국 지연의 의미를 갖는다. dispatch를 나중에 묶어서 할 수 있도록 해주는 것이 thunk middleware의 역할이다.



### Custom Middleware

그렇다면 그냥 내 입맛에 맞게 중간에서 어떤 역할을 하는 미들웨어를 만들 수도 있을 것이다. 예를들면 Devtools 처럼(물론 Devtools 만큼의 기능 제공은 못하겠지만) 그냥 액션을 실행할 때마다 그 액션을 콘솔창에 찍어주는 기능을 가진 미들웨어를 만들 수 있다.

```javascript
/* store/configureStore.js */
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

// import reducers
import reducer from '../reducers'

// Custom Middleware
const actionLoggingMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    console.log(action);
    return next(action);
}

const configureStore = () => {
    const middlewares = [actionLoggingMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))	
    : composeWIthDevTools(applyMiddleware([]))
const store = createStore(reducer, enhancer);
return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;


```

이렇게 작성하면 내가 액션을 실행할 때마다 액션을 콘솔에 로깅해준다. next(action)을 반환하기 전에 `console.log(action);` 으로 액션을 찍어주고 있다. 액션을 로깅했다면 다음 액션으로 넘어가는 것이다. 정말 중간에 있는 친구다.

redux-devtools가 동작하는 원리도 이와 같다.



### Redux Saga

redux-thunk 대신 Saga를 쓰는 이유는 부가기능이 많이 때문이다. thunk를 썼을 때 Login 기능을 작성하려면 아래와 같이 작성하면 된다. 완전 간단하고 좋지만 다른 기능이 없다.

```javascript
export const loginAction = (data) => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(loginRequestAction());
        axios.post('약속된 End Point')
        .then((res) => {
            dispatch(loginSucceccAction(res.data));
        })
        .catch((err) => {
            dispatch(loginFailureAction(err));
        })
    }
}
```

예를 들면 delay나 한 번에 여러 번의 클릭(요청)이 발생했을 때 그걸 한 번만 요청으로 잡아줄 수 있도록 하는 기능도 알아서 구현해야 한다. 나는... 서버에 DOS 공격을... 날리는 개발자가 되고 싶지 않기 때문에... 그걸 배포하면 나는 DDOS 공격을 만들어버린 사람이 되기 때문에... 



그런 이유로 이 프로젝트에는 Redux-Saga를 적용하기로 했다. 

```shell
npm i next-redux-sata redux-saga
```

그리고 configureStore.js를 다음과 같이 변경했다.

```javascript
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// saga import
import createSagaMiddleware from "redux-saga";

import reducer from "../reducers";
// saga도 reducer처럼 쪼갤 수 있다.
import rootSaga from "../sagas";

const configureStore = () => {
    //saga
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer);

    // 이쪽에 rootSaga를 묶어줌
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;

```



그리고 _app.js에 다시 HOC를 적용한다.

```javascript
// HOC
export default wrapper.withRedux(withRduxSaga(Asker));
```



그리고 sagas 폴더를 만들었다. 

```shell
├── sagas
│   ├── ask.js
│   ├── index.js
│   └── user.js
```

그리고 reducer 파일을 만들었던 것처럼 index.js에 rootSaga 함수를 작성할 것이다. 여기에서 아주 재미있는 개념이 나온다.



#### Generator

```javascript
/* sagas/index.js */

export default function* rootSaga() {
    
}
```

짠! 별*이 있다. `function*` ! 이렇게 별이 붙은 함수를 Generator 함수라고 부른다. 개인적으로 예쁘게 생겨서 좋아함. 

```javascript
const genf = function* () {
    console.log('아니 이게 뭐야?');
}
```

위와 같이 '아니 이게 뭐야?'를 콘솔창에 출력하는 함수를 작성하고 genf라는 변수에 할당해두었다. 그러면 일반 상식으로는 `genf();` 하면 '아니 이게 뭐야?'가 출력되어야 한다. 하지만 제너레이터 함수는 그런 방식으로 일하지 않는다.

```javascript
genf().next();
```

이렇게 해야 호출된다. 그냥 부르면 안 된다. 또 다음과 같은 식으로 제너레이터를 이용할 수 있다.

```javascript
const genf = function* () {
    console.log('아니 이게 뭐야? 1');
    yield;
    console.log('아니 이게 뭐야? 2');
    yield;
    console.log('아니 이게 뭐야? 3');
    yield;
    console.log('아니 이게 뭐야? 4');
    yield console.log('아니 이게 뭐야? 5');
}

const generator = genf();
```

이렇게 선언을 한 다음

```javascript
generator.next();
```

로 계속해서 호출하면 `yield` 단위로 함수가 끊어서 실행되는 것을 확인할 수 있다.

여기에서 알 수 있는 것은 generator로 함수를 작성하면 yield가 있는 곳에서 멈춘다는 것이다. 결국 generator 함수는 중단점이 있다는 특성을 갖는다. 원래 자바스크립트 함수는 실행시 전체가 다 실행되는데(위에서 아래로) 이런 경우는 yield에서 멈춘다.

이 성질을 활용한 것이 바로 Redux-Saga이다.



#### 절대 멈추지 않는 Generator

제너레이터 함수는 yield라는 중단점을 제공하고 준비해둔 모든 yield가 끝나면 dont: false가 done: true로 변경되면서 함수가 끝나게 되는데 이 점을 이용하면 절대 멈추지 않는 Generator를 만들 수 있다. 나는 처음 이 개념을 들었을 때 아니 그런 걸 대체 왜 만들어요;; 하면서 뜨개질 빌런을 생각했다. 아니 그런 걸 왜 떠요?

```javascript
let i = 0;
const genf = function* () {
    while (true) {
        yield i++;
    }
}
```

원래 while(true) 반복문은 무한반복 되기 때문에 특수한 경우가 아니면 잘 쓰지 않는데 generator 함수와 함께 사용될 때는 굉장히 유용하다. yield가 중단점이기 때문에 반복문이 무한 반복되는 것이 아니라 매번 중단된다. 

```javascript
const generator = genf();
```

`generator.next();` 를 실제로 실행시켜도 중단점에서 끝날 뿐이다. 실제로 함수를 한 번 실행한 시점에서 i의 값은 0이 된다. 그리고 멈춘다. 

이벤트 리스너 같은 걸 사용할 때 굉장히 좋을 것 같다. 일단 무한으로 만들어 놓고 뭔가 이벤트를 발생시킨 다음 generator.next();를 일종의 트리거로 사용한다면 계속해서 이벤트를 뽑아낼 수 있는 것이다. 완전 좋음.

이 성질 역시 Redux Saga에서 사용된다.



### Saga Effects

Redux Saga에는 여러 이펙트들이 있다. 위에서 Redux Thunk를 사용하지 않고 Saga를 선택한 이유가 바로 이 Effects를 잘 지원하기 때문이라고 잠깐 언급했는데, 이것에 대해서도 몇 가지 정리를 하고 프로젝트에 적용을 할 예정이다.

```javascript
import { all, fork, take, call, put  } from "redux-saga/effects";
```

지금 프로젝트 단계는 위의 다섯 가지 이펙트를 활용하면 될 것 같아서 일단 다섯 개 정도만 보고 적용하기로 했다. throttle도 필요할 것 같지만 그건 업데이트를 하면서 다시 정리하는 편이 좋을 것 같다.



#### all, fork, take, call, put

```javascript
import { all, fork, take, call, put } from 'redux-saga/effects';

// 실제 호출 함수
function loginAPI() {
    return axios.post('/api/user', {}); // 약속된 엔드포인트
}

// api 호출 함수
function* login() {
    const result = yield call(loginAPI);
}

function* logout() {
    yield call(logoutAPI);
}

// action 실행 함수
function* watchLogin() {
    yield take('LOG_IN_REQUEST', login);
}

function* watchLogout() {
    yield take('LOG_OUT_REQUEST', logout);
}

// 주시 함수
export default function* rootSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout)
    ])
}
```

아래에서 위로 읽는 편이 이해하기 쉬웠다.

`all` 은 기본적으로 배열 안에 함수를 담는데, 이것이 실행되면 인자로 받은 함수들을 한번에 실행한다. `fork` 는 비동기 호출 함수로, 함수를 파라미터로 받고, 해당 함수를 실행하는 역할을 한다. 

그러면 결국 `all` 은 `watchLogin`, `watchLogout` 함수를 동시에 실행시키는 역할을 하는데, 위쪽에 정의된 두 함수를 보면 `take` 라는 이펙트가 사용된 것을 확인할 수 있다. 이 때 `yield take('LOG_IN_REQUEST or LOG_OUT_REQUEST');` 이 의미하는 바는 'LOG_IN_REQUEST', 'LOG_OUT_REQUEST' 액션이 실행될 때까지 기다린다는 것이다. 

여기까지 반대로 함수 실행 흐름을 따라가면 결국 'LOG_IN', 'LOG_OUT' 액션이 실행되는지 rootSaga의 all이 주시하고 있는 모양새임을 알 수 있다. 

```javascript
function* watchLogin() {
    yield take('LOG_IN_REQUEST', login);
}
```

`watchLogin()` 함수를 보면 'LOG_IN_REQUEST' 액션이 실행되었을 때 두 번째 인자를 실행시키는 역할을 한다. 이 함수의 재미있는 점은 요청을 두 갈래로 나눠서 보낸다는 것인데, 하나는 두번째 파라미터에 정의된 login 함수이고, 다른 하나는 액션 함수이다.

```javascript
// api 호출 함수
function* login() {
    const result = yield call(loginAPI);
}
```

login이라는 이름의 함수는 api 함수를 호출하는 역할을 한다. loginAPI라는 사전에 정의해둔 함수를 `call` 이펙트로 호출하는데 이 때, `call` 이펙트는 `fork` 와 달리 동기 함수 호출이다. 따라서 loginAPI 함수는 보통 프로미스, aixos 라이브러리 등을 이용해 서버와 데이터 통신을 할 수 있도록 코드를 작성한다. 그러면 result에 결과값이 담길때까지 기다렸다가 그 결과값을 이용해 다시 액션을 호출할 수도 있다. 그런 경우 put 이펙트를 사용하는데 마치 dispatch와 같은 역할을 한다.

```javascript
// api 호출 함수
function* login() {
    const result = yield call(loginAPI);
    yield put({
        type: 'LOG_IN_SUCCESS',
        data: result.data
    });
}
```

(물론 위의 함수가 작동하려면 redux에 우리가 이미 LOG_IN_SUCCESS 액션을 정의해 두었어야 한다.) 또 loginAPI 와 같이 요청을 하는 함수는 요청에 실패하기도 하고 성공하기도 하기 때문에 login 함수는 `try{}catch{}` 를 이용해 다음과 같이 작성해주는 것이 좋다. (아래)

```javascript
// api 호출 함수
function* login() {
   try{
        const result = yield call(loginAPI);
    	yield put({
        	type: 'LOG_IN_SUCCESS',
        	data: result.data
    });
   } catch(err){
       yield put({
           type: 'LOG_IN_FAILURE',
           data: err.response.data,
       });  
   }
}
```



이제 login 함수에서 호출했던 loginAPI 함수를 보면 아래와 같이 axios 라이브러리를 이용해서 데이터를 보내고 또 받을 수 있도록 코드를 작성했다.

```javascript
// 실제 호출 함수
function loginAPI() {
    return axios.post('/api/user') // 약속된 엔드포인트
}
```

중요한 것은 가장 마지막에 호출되는 이 함수는 generator로 작성하면 안된다. 어차피 login 함수에서 동기요청을 하고 있기 때문에 loginAPI 함수는 말 그대로 요청만 수행하면 되는 거라 async await를 해줄 이유도 없다.

Saga는 Thunk와 달리 비동기 액션 크리에이터를 직접 실행했지만 Saga는 이벤트리스너처럼 작동한다. 함수가 계속해서 호출되기 때문에 흐름이 굉장히 복잡하다... 처음에 이해하는데 꽤 오래 걸렸지만 한 번 흐름을 이해하고 나면 굉장히 편리한 시스템이라는 것을 알게 된다. (개인적으로 너무 좋고 행복했습니다....) 





## Asker에 Redux Saga 적용



그러면 이제 store와 reducers, 그리고 sagas를 포함한 폴더 구조는 아래와 같다.

```shell
├── reducers
│   ├── ask.js
│   ├── index.js
│   └── user.js
├── sagas
│   ├── ask.js
│   ├── index.js
│   └── user.js
└── store
    └── configureStore.js
```

