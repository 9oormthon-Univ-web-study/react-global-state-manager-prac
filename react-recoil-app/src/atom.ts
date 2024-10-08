import axios from 'axios';
import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil';

export type TodoState = todoItem[];

export interface todoItem {
    id: number;
    text: string;
    isCompleted: boolean;
}

interface TodoListStats {
    totalNum: number;
    totalCompletedNum: number;
    totalUncompletedNum: number;
    percentCompleted: number;
}

// 필터 타입 정의
export type FilterState = 'Show All' | 'Show Completed' | 'Show Uncompleted';

// atom의 타입 명시
export const textState: RecoilState<string> = atom<string>({
    key: 'textState',
    default: '',
});

// selector의 타입 명시
export const charCounterState: RecoilValueReadOnly<number> = selector({
    key: 'charCounterState',
    get: ({ get }) => {
        // get함수로 반환한 새로운 값은 읽기 전용, 쓰려면 set사용해야함
        const text = get(textState);
        return text.length;
    },
});
// set말고 상태를 변경하는 `useSetRecoilState()`라는 함수도 존재하는데 이는 간단한 상황에서 변경, `set`은 복잡한 로직을 캡슐화

//RecoilState의 타입 : todoList키의 값에 대한 타입
//atom의 타입 : default값에 대한 타입
export const todoListState: RecoilState<TodoState> = atom<TodoState>({
    key: 'todoList',
    default: [],
});

export const todoListFilterState: RecoilState<string> = atom<string>({
    key: 'todoListFilterState',
    default: 'Show All',
});

// 읽기 전용이기 때문에 RecoilState로 선언하면 안되고 RecoilValueReadOnly로 해줘야 함
export const filteredTodoListState: RecoilValueReadOnly<TodoState> = selector<TodoState>({
    key: 'filteredTodoListState',
    get: ({ get }) => {
        const filter = get(todoListFilterState);
        const list = get(todoListState);

        switch (filter) {
            case 'Show Completed':
                return list.filter((item) => item.isCompleted);
            case 'Show Uncompleted':
                return list.filter((item) => !item.isCompleted);
            default:
                return list;
        }
    },
});

// 통계 관련 selector
export const todoListStatsState = selector<TodoListStats>({
    key: 'todoListStatsState',
    get: ({ get }) => {
        const todoList = get(todoListState);
        const totalNum = todoList.length;
        const totalCompletedNum = todoList.filter((item) => item.isCompleted).length;
        const totalUncompletedNum = totalNum - totalCompletedNum;
        const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum;

        return { totalNum, totalCompletedNum, totalUncompletedNum, percentCompleted };
    },
});

// selector로 가져오는 데이터 값은 자동으로 캐싱됨!(같은 값을 호출하게 되면 같은 결과 반환)
export const currentUserIdState = atom<string>({
    key: 'currentUserIdState',
    default: '1',
});

export const currentUserNameQuery = selector<any>({
    key: 'currentUserNameQuery',
    get: async ({ get }) => {
        const path = `https://jsonplaceholder.typicode.com/users/`; //base url
        const response = await axios.get(`${path}${get(currentUserIdState)}`);
        return response.data.name;
    },
});

let id: number = 0;
export const getId = () => id++;
