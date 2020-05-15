import React from 'react';
import ReactDOM from 'react-dom';
import delay from 'delay';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';

const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

const charCountState = selector({
  key: 'charCountState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(textState);

    return text.length;
  },
});

const encryptionState = selector({
  key: 'asyncState',
  get: async ({ get }) => {
    const text = get(textState);
    await delay(1000);
    return text.replace(/./gi, '*');
  },
});

const EncryptionCount = () => {
  const contentLoadable = useRecoilValueLoadable(encryptionState);

  try {
    contentLoadable.getValue();
  } catch (promise) {
    console.log(promise === contentLoadable.toPromise()); // true
  }

  return (
    <p>
      Encryption content:
      {contentLoadable.state === 'loading'
        ? 'loading'
        : contentLoadable.getValue()}
    </p>
  );
};

const CharacterCount = () => {
  const count = useRecoilValue(charCountState);

  return <>Character Count: {count}</>;
};

const TextInput = () => {
  const [text, setText] = useRecoilState(textState);

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
};

const CharacterCounter = () => {
  return (
    <div>
      <TextInput />
      <CharacterCount />
      <EncryptionCount />
    </div>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
