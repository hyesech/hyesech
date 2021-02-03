---
title: "Redux 적용기"
subtitle: "Redux makes my project awesome..."
date: "2021-02-03"
---





## Redux의 원리와 불변성 짚고 넘어가기

프로젝트에 Redux를 어떻게 적용했는지 기록하기 전에 Redux의 원리, 가장 중요한 핵심인 불변성(Immutability)이 무엇인지에 대해 잠깐 짚고 넘어가기로 했다. 

불변성은 무엇인가? 불친절하게 설명하자면 '상태를 변경하지 않는 것'이라고 짧게 줄여 말할 수 있겠다.

> 하지만 개인적으로 이런 설명은 별로 와닿지 않는다. 불변성을 왜 유지해야 하는지 그 중요성을 알지 못하는 단계에서는 그게 뭐 그렇게 중요한 일인가 싶기 때문이다.

이 설명이 만족스러우려면 ''상태''가 무엇인지, '메모리'는 무엇인지에 대한 개념이 명확하게 세워져 있어야 한다. 또 Redux의 action들은 불변성을 유지해야 하기 때문에 순수 함수(pure functions)로 작성되어야 한다는 이야기가 있는데 이것 역시 별로 와닿지 않는다. 함수면 함수지 대체 순수 함수는 뭐지?   



### 순수 함수

일반적으로 순수 함수는 다음과 같은 두 가지 특징을 가진다.

> 1. 동일한 인자가 주어진다면 언제나 동일한 결과를 도출한다.
> 2. 함수 외부의 상태를 변경하거나 외부의 상태에 영향을 받지 않는다.

순수 함수에 대한 설명은 다음 블로그에서 더 자세한 설명을 볼 수 있다. 바로 위에 서술한 순수 함수의 두 가지 특징이 무엇인지 와닿지 않는다면 아래 링크한 블로그 포스트에서 많은 도움을 받을 수 있을 것이다. 실제로 나도 많은 도움을 받았다.

> [수학에서 기원한 프로그래밍 패러다임, 순수 함수](https://evan-moon.github.io/2019/12/29/about-pure-functions/)   



### 불변성

다시 불변성에 대한 이야기로 돌아오면 불변성은 결국 상태 변화를 감지하기 쉽게 만들어준다는 결론에 닿을 수 있다. 이러한 특징은 React, 그리고 Redux의 원리와 곧장 연결된다. React의 경우 상태가 변경된 것을 감지하면 컴포넌트를 다시 렌더링한다. Redux 역시 비슷한 원리로 작동한다. 그래서 Reducer를 작성할 때 우리는 기존의 객체를 직접 수정하지 않고 새로운 객체를 만들어 반환하는 것이다. 그래야 상태가 변경되었음을 Redux가 감지할 수 있다.

Reducer의 상태 변화 감지 예시를 더 들어보면 다음과 같다.

```javascript
/* reducer */
switch (action.type) {
    case 'INCREASE':
        return {
            ...state,
            num++;
        }
    case 'DECREASE':
        return {
            ...state,
            num--;
        }
}
```

왜 `return`을 저렇게 해주어야 하는가? 아래 두 가지 경우를 보자.

```javascript
// CASE 1
{} === {}		// false
```

```javascript
// CASE 2
const a = {};
const b = a;
a === b			// true
```

좀 이상하다. 객체와 객체는 다른 것으로 인식되는데 참조관계가 있는 경우 같은 것으로 인식이 된다. 참조해서 대입하면 `true`가 되는 것이다. 그래서 reducer 함수를 다시 보면 return시 객체를 새로 만들어서 새로운 객체를 리턴하는 것이다.

왜 객체를 새로 만들어야 할까? 그래야 변경 내역이 추적되기 때문이다.

```javascript
// 이전 기록
const prev = { name: hceseyh };

// 다음 기록
const next = { name: hyesech };
```

위와 같은 코드가 있다고 가정하면 `prev`와 `next`는 서로 다르다. 서로 다르다는 것은 결국 `prev`와 `next` 객체가 각각 기록이 남는다는 것이다. 

그러면 객체를 새로 생성하지 않고 그 안의 내용만 참조하여 상태를 변경하면 어떻게 될까?

```javascript
// 이전 기록
const prev = { name: hceseyh };

// 다음 기록
const next = prev;
next.name = 'hyesech';
prev.name;		// hceseyh
```

위와 같이 `prev`를 `next`에 할당하고 `next.name`으로 상태를 변경하면 `prev`의 `name` 역시 바뀌어버리기 때문에 기록이 사라진다. history가 사라져 버리는 것임. 즉 나의 이름이 'hceseyh' 였다는 사실이 사라져버린다.

그렇다면 왜 객체 안에서 굳이

```javascript
{
    ...state,
    // 바꿀 상태
    name: action.data
}
```

위와 같이 `...state`를 해주는 것일까? 그것은 메모리와 관련이 있다. 다음과 같은 ` initialState`가 있다고 가정해보자.

```javascript
// initialState
{
    name: 'hyesech',
    job: 'gamer',
    games: [{}, {}, {}, {}], 
}
```

만약 해당 초기값 중 직업에 해당하는 `job` 부분만 변경하고 나머지는 그대로 둘 때 우리는 두 가지 선택을 할 수 있다.

```javascript
// CASE 1
return {
    name: 'hyesech',
    job: action.data	// 받아온 data로 변경
    games: [{}, {}, {}, {}]
}

// CASE 2
return {
    ...state,
    job: action.data	// 받아온 data로 변경
}
```

CASE 1의 경우 액션을 하나 실행할 때마다 새로운 객체를 생성하게 된다. `games` 안에 있는 것들이 객체의 배열이기 때문이다. 하지만 CASE 2의 경우처럼 바꾸고자 하는 부분을 제외한 나머지 부분을 `...state`로 참조 처리를 해버리면 해당 부분은 새로운 객체를 생성하지 않고도 우리가` job`의 상태를 변경했다는 기록을 남길 수 있다. 즉 메모리를 아낄 수 있다. 물론 코드가 짧아진다는 이점도 있다.



### 비구조화 할당

`...state` 는 비구조화 할당이다. 이것을 사용하면 객체가 새로 생성되는 것이 아니라 참조 처리된다. 이런 이중 구조가 있다고 가정하자.

```javascript
// 얕은 복사
const nest = { b: 'c' };
const prev = { a: nest };
// const prev = { a: { b: 'c'}};
```

```javascript
const next = { ...prev };
prev.a === next.a;	// true
```

스프레드를 해도 위와 같이 참조는 유지한다. 다만 아래는 성립하지 않는다.

```javascript
prev === next;	// false
```

객체를 새로 만들었기 때문에 `prev`와 `next`는 다르다. 하지만 그 안의 객체 `a`는 같다. 그래서 다음 객체를 새로 만들더라도 안쪽의 다른 객체는 참조를 유지하면서 새로운 객체를 만들어 낼 수 있기 때문에 효율적이다. 참조를 적절하게 유지하면서 상태를 변경하는 것이 redux, 그리고 reducer 작성의 핵심이다.

> 물론 배포 모드일 때는 history를 계속 가지고 있을 필요가 없기 때문에 메모리 관리가 된다.





## Next.js 프로젝트에 Redux 붙이기

Redux와 같은 역할을 하는 여러가지 선택지가 있었지만(Mobx, Context API) 코드량이 많더라도 초보에게는 Redux가 더 좋고 또 사용자가 많기 때문에 Redux를 선택했다. 데이터 흐름을 추적하기도 쉽고! Redux를 조금 더 익숙하게 쓸 수 있다면 추후 Mobx도 사용해보고 싶다.



### 기본 세팅

```bash
npm install next-redux-wrapper react-redux redux
```

이렇게 `next-redux-wrapper` , `react-redux` , `redux`를 동시에 설치했다. `yarn` 을 쓴다면 `nom install` 대신 `yarn add` 로 설치하면 된다. 

>next-redux-wrapper가 필요한 이유는 추후에 설명하겠다.



먼저 `store` 폴더를 만들고 하위에 `configureStore.js` 파일을 만들었다.

```javascript
/* store/configureStore.js */
import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux';

const configureStore = () => {
    // 추후 reducer가 들어감
    import store = createStore();
    return store;
};

const wrapper = createWrapper(configureStore, {debug: process.env.NODE_ENV === 'development'});
export default wrapper;
```



그리고 `_app.js` 파일로 넘어와서 export default 부분을 HOC Component로 감싸준다. 

```javascript
/* _app.js */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import wrapper from './store/configureStore';

const Asker = ({ Component }) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>Asker</title>
            </Head>
            <Component />
        </>
    );
};

Asker.proTypes = {
    Component: PropTypes.elementType.isRequired,
}

// 이 부분을 HOC Component로 감싸준다.
export default wrapper.withRedux(Asker);
```



그런데 보통 React에서 Redux를 쓸 때 Store를 등록하려면 아래와 같이`react-redux` 의 `<Provider store={store}` 로 감싸주었는데 Next.js에서는 그렇게 하지 않아도 된다.

```javascript
/* _app.js */
import React from 'react';

const Asker = ({ Component }) => {
    return (
        <Provider store={store}>
            <Head>
                <meta charSet="utf-8" />
                <title>Asker</title>
            </Head>
            <Component />
        </Provider>
    );
};
```

이전 버전에서는 `Provider` 를 써야 했는데 6버전 부터는 알아서 감싸주기 때문에 넣어주면 오히려 문제가 발생한다. Next.js에서 알아서 감싸주는데 또 감싸주면 중복이 발생한다.



### Reducer

`store` 폴더를 만든 것처럼 reducer들을 관리하기 위해 `reducers` 폴더를 만들고 하위에 `index.js` 파일을 만들었다.

```javascript
/* reducers/index.js */
const rootReducer = (() => {
    // switch 함수가 들어간다.
});

export default rootReducer;
```

그리고 reducer를 사용하기 위해 `store` 폴더의 `configureStore.js` 파일 안쪽에 reducer를 등록한다.

```javascript
/* store/configureStore.js */
import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux';

// reducers 폴더 전체를 import
import reducer from '../reducers';

const configureStore = () => {
    // 등록
    import store = createStore(reducer);
    return store;
};

const wrapper = createWrapper(configureStore, {debug: process.env.NODE_ENV === 'development'});
export default wrapper;
```

이렇게 되면 `reducers` 폴더의 `index.js` 파일이 reducer들의 컨트롤 타워가 된다. 그래서 `index.js` 안쪽의 함수 이름이 그냥 `reducer`가 아니라 `rootReducer`다. 물론 그냥 `reducer`로 함수명을 지정해도 아무 문제 없다. 그냥 `index.js`에 있는 `reducer` 함수가 일반적으로 컨트롤 타워 역할을 할 뿐이고 사람들이 `rootReducer`라는 이름을 많이 쓰는 것 뿐이다. 나는 추후에 `reducer`가 늘어날 것을 대비해서 그냥 미리 `rootReducer`라는 이름을 붙여두었다. 추후 컨트롤 타워로 변경하는 부분까지 포스팅할 예정이다.

등록이 완료되었다면 이후 `rootReducer` 함수가 있는 `reducers/index.js` 파일로 이동해 `initialState(초기값)` 를 만든다.

```javascript
/* reducers/index.js */

// initialState 설정
const initialState = {
    username: 'hceseyh',
    email: 'hyesech@gmail.com',
    password: '1234567890',
}

// action 설정
const changeUsername = {
    type: 'CHANGE_USERNAME',
    data: 'hyesech',
}

// reducer 함수
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_USERNAME':
            return {
                ...state,
                username: action.data,
            }
    }
};

export default rootReducer;
```

설정된 action은 상태를 변경해야 할 때 `store.dispatch()`를 이용해 호출할 수 있으며(주로 컴포넌트 안쪽에서 사용하게 된다.) action에 미리 정해 놓은 로직을 따라 상태를 변경하게 된다. (immutable) 위 코드에 있는 액션은 사실상 data를 정해진 것으로 바꿀 수 있게 해놓은 거라 동적인 함수는 아니다.

동적인 함수로 작성하려면 아래와 같이 Action Creator 함수로 작성하면 된다.

```javascript
// action creator
const changeUsername = (data) => {
    return {
        type: 'CHANGE_USERNAME',
        data,
    }
};
```

같은 역할을 하지만 이렇게 동적으로 작성하면(Action Creator) 입력값을 받아서 변경할 수 있다. 물론 대부분의 경우 동적으로 작성해야 한다. 그러면 컴포넌트에서 아래와 같은 방식으로 호출하게 된다.

```javascript
store.dispatch(changeUsername('hyesech'));
```

이와 같이 Action Creator는 그때그때 액션을 새로 만들어내는 역할을 한다.





## Asker에 Redux 붙이기

그래서 이제 실제 프로젝트인 Asker에 Redux를 붙여야 한다. Asker에는 특정 사용자에게 익명으로 Ask를 보내는 기능, Ask에 대한 대답을 하는 기능, 팔로우, 언팔로우 등 여러가지 기능이 있지만 일단 가장 먼저 해결하고 싶은 부분은 역시 회원가입과 로그인이었다. 

백엔드는 Node.js 기반 Express 프레임워크를 이용해서 개발할 예정이라 우선 더미데이터로 프론트엔드 작업을 먼저 해두려고 한다. 



### Reducer 분리하기

그러면 이제 위의 `rootReducer` 말고 유저와 관련된 기능을 담당할 user 관련 `reducer`를 새로 만들고 기존의 `rootReducer`는 새로 작성한 `reducer`들을 컨트롤할 타워로 바꿔야 한다. 그래서 일단 파일을 나눴다.



> 아무래도 나중에 다 뜯어고치게 될 것 같지만 일단 하자!



reducer폴더 구조를 다음과 같이 만들었다.

```bash
├── reducers
│   ├── ask.js
│   ├── index.js
│   └── user.js
```

그리고 `user.js` 파일에 user 관련 reducer 함수를 작성했다.

```javascript
/* reducers/user.js */
const initialState = {
    
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
    
};

export default reducer;
```

`ask.js`도 처음에 설계한 기능에 따라 작성해줬다. 이제 기존의 `rootReducer`를 컨트롤타워로 변경하기 위한 작업을 해야 한다. 



### HYDRATE, next-redux-wrapper

React에 Redux를 붙이는 것은 어렵지 않다. React로 만든 앱에는 하나의 Redux Store가 존재하기 때문이다. 그러나 Next.js 프로젝트에 Redux를 붙이는 것은 생각보다 복잡하다. Next를 사용하면 유저가 요청할 때마다 redux store를 새로 생성해야 하기 때문이다. 또 Next.js의 `getInitialProps`, `getServerSideProps` 등에서도 Redux Store에 접근할 수 있어야 한다. 이 때 필요한 것이 바로 `next-redux-wrapper` 다.

우선 `HYDRATE` action을 적용한다. `HYDRATE`는  `next-redux-wrapper`에서 제공하는 액션이다. next.js에서 생성한 redux store와 client에서 생성한 redux store는 다르다. 이 둘을 합칠 때 사용하는 것이 `HYDRATE` 기능이다. `HYDRATE`는 서버에서 생성한 상태를 client store에 합쳐준다. 

```javascript
/* reducers/index.js */
import { HYDRATE } from 'next-redux-wrapper';

// initialState 설정
// action 설정

// reducer 함수
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload };
        case 'CHANGE_USERNAME':
            return {
                ...state,
                username: action.data,
            }
    }
};

export default rootReducer;
```



그 다음 `combineReducer`를 이용해 분리한 객체들을 `rootReducer`로 다음과 같이 묶어준다.

```javascript
/* reducers/index.js */
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducer } from 'redux';

// reducer 불러오기
import user from './user';
import ask from './ask';

// Root Reducer 함수
const rootReducer = combineReducer({
    index: (state = {}, action) => {
        switch (action.type) {
            case HYDRATE:
                console.log('HYDRATE', action);
                return { ...state, ...action.payload };
            default:
                return state;
        }
    },
    user,
    ask,
});

export default rootReducer;
```

실제로  `consol.log('HYDRATE', action);` 으로 로그를 찍어보면 reducers 폴더 안에 분리해둔 각각의 reducer(index, user, ask)가 객체로 묶여서 출력되는 것을 볼 수 있다. 또, `combineReducer` 같이 `redux`에서 지원하는 기능을 써야 하는가? 함수를 합치는 것은 객체를 합치는 것과 달라서 복잡하기 때문이다. 

